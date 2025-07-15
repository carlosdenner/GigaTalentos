"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Clock,
  User
} from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface Video {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  youtube_id: string;
  youtube_views?: number;
  youtube_likes?: number;
  youtube_channel_title?: string;
  duration?: string;
  category: string;
  tags?: string[];
  featured: boolean;
}

interface Comment {
  _id: string;
  content: string;
  user_id: {
    name: string;
    avatar?: string;
  };
  likes: string[];
  created_at: string;
  replies?: Comment[];
}

interface WatchSession {
  session_id: string;
  start_time: Date;
  current_position: number;
}

export default function VideoCarouselPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
  // Video player state
  const [videos, setVideos] = useState<Video[]>([])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // User interaction state
  const [isFavorited, setIsFavorited] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)
  
  // Analytics state
  const [watchSession, setWatchSession] = useState<WatchSession | null>(null)
  const [watchStartTime, setWatchStartTime] = useState<Date | null>(null)
  const [lastPosition, setLastPosition] = useState(0)
  const [pauseCount, setPauseCount] = useState(0)
  
  // Refs
  const playerRef = useRef<HTMLIFrameElement>(null)
  const analyticsTimer = useRef<NodeJS.Timeout | null>(null)

  const videoId = params.id as string
  const category = searchParams.get('category')
  const source = searchParams.get('source') || 'direct'

  useEffect(() => {
    console.log('🎬 Carousel page loaded with videoId:', videoId, 'category:', category)
    loadVideos()
  }, [videoId, category])

  useEffect(() => {
    console.log('📹 Videos loaded:', videos.length, 'videos. Looking for videoId:', videoId)
    if (videos.length > 0 && videoId) {
      const index = videos.findIndex(v => v._id === videoId)
      console.log('🔍 Video index found:', index)
      if (index !== -1) {
        setCurrentVideoIndex(index)
        setCurrentVideo(videos[index])
        console.log('✅ Current video set:', videos[index].title)
        initializeWatchSession(videos[index])
      } else {
        console.error('❌ Video not found in loaded videos. Available video IDs:', videos.map(v => v._id))
        // Try to load the specific video if not found in the list
        loadSpecificVideo(videoId)
      }
    } else if (videoId && videos.length === 0 && !isLoading) {
      // If no videos loaded but we have a videoId, try to load it specifically
      console.log('🔄 No videos in list, trying to load specific video:', videoId)
      loadSpecificVideo(videoId)
    }
  }, [videos, videoId])

  useEffect(() => {
    if (currentVideo) {
      loadComments(currentVideo._id)
      checkUserInteractions(currentVideo._id)
    }
  }, [currentVideo])

  // Analytics tracking
  useEffect(() => {
    if (currentVideo && watchSession) {
      startAnalyticsTracking()
    }
    return () => {
      if (analyticsTimer.current) {
        clearInterval(analyticsTimer.current)
      }
    }
  }, [currentVideo, watchSession])

  const loadSpecificVideo = async (videoId: string) => {
    try {
      console.log('Loading specific video by ID:', videoId);
      const response = await fetch(`/api/videos/${videoId}`);
      if (response.ok) {
        const video = await response.json();
        console.log('Specific video loaded:', video);
        setVideos([video]);
        setCurrentVideoIndex(0);
        setCurrentVideo(video);
        initializeWatchSession(video);
        return true;
      } else {
        console.error('Failed to load specific video:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error loading specific video:', error);
      return false;
    }
  };

  const loadVideos = async () => {
    try {
      setIsLoading(true)
      let endpoint = '/api/videos?youtubeOnly=true&limit=50'
      
      if (category) {
        endpoint += `&category=${encodeURIComponent(category)}`
      }
      
      const response = await fetch(endpoint)
      const data = await response.json()
      
      // Handle the direct array response from youtubeOnly=true
      if (Array.isArray(data)) {
        setVideos(data)
      } else if (data.success && data.videos) {
        setVideos(data.videos)
      } else if (data.data) {
        setVideos(data.data)
      } else {
        console.error('Unexpected API response format:', data)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os vídeos",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error loading videos:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar vídeos",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const initializeWatchSession = async (video: Video) => {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const session: WatchSession = {
        session_id: sessionId,
        start_time: new Date(),
        current_position: 0
      }
      
      setWatchSession(session)
      setWatchStartTime(new Date())
      
      // Track video view
      await trackInteraction({
        content_id: video._id,
        content_type: 'video',
        action: 'view',
        context: {
          page: 'carousel',
          position: currentVideoIndex,
          session_id: sessionId
        }
      })
      
    } catch (error) {
      console.error('Error initializing watch session:', error)
    }
  }

  const startAnalyticsTracking = () => {
    if (analyticsTimer.current) {
      clearInterval(analyticsTimer.current)
    }
    
    // Track watch progress every 10 seconds
    analyticsTimer.current = setInterval(async () => {
      if (currentVideo && watchSession && isPlaying) {
        await updateWatchProgress()
      }
    }, 10000)
  }

  const updateWatchProgress = async () => {
    if (!currentVideo || !watchSession) return
    
    try {
      const currentTime = Date.now()
      const watchDuration = Math.floor((currentTime - watchSession.start_time.getTime()) / 1000)
      
      await fetch('/api/analytics/watch-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: currentVideo._id,
          session_id: watchSession.session_id,
          watch_duration: watchDuration,
          last_position: lastPosition,
          source,
          paused_count: pauseCount
        })
      })
    } catch (error) {
      console.error('Error updating watch progress:', error)
    }
  }

  const trackInteraction = async (interaction: any) => {
    try {
      await fetch('/api/analytics/interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...interaction,
          timestamp: new Date(),
          device_info: {
            type: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            user_agent: navigator.userAgent
          }
        })
      })
    } catch (error) {
      console.error('Error tracking interaction:', error)
    }
  }

  const loadComments = async (videoId: string) => {
    try {
      const response = await fetch(`/api/comments?video_id=${videoId}`)
      const data = await response.json()
      
      if (data.success) {
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    }
  }

  const checkUserInteractions = async (videoId: string) => {
    try {
      const response = await fetch(`/api/user-interactions?video_id=${videoId}`)
      const data = await response.json()
      
      if (data.success) {
        setIsFavorited(data.isFavorited || false)
        setIsBookmarked(data.isBookmarked || false)
        setHasLiked(data.hasLiked || false)
      }
    } catch (error) {
      console.error('Error checking user interactions:', error)
    }
  }

  const navigateVideo = async (direction: 'prev' | 'next') => {
    if (!videos.length) return
    
    // Save current watch session before navigating
    if (currentVideo && watchSession) {
      await updateWatchProgress()
    }
    
    let newIndex: number
    if (direction === 'next') {
      newIndex = currentVideoIndex >= videos.length - 1 ? 0 : currentVideoIndex + 1
    } else {
      newIndex = currentVideoIndex <= 0 ? videos.length - 1 : currentVideoIndex - 1
    }
    
    const newVideo = videos[newIndex]
    setCurrentVideoIndex(newIndex)
    setCurrentVideo(newVideo)
    
    // Update URL without page reload
    const newUrl = `/video-carousel/${newVideo._id}?${searchParams.toString()}`
    window.history.pushState({}, '', newUrl)
    
    // Reset player state
    setIsPlaying(false)
    
    // Track navigation
    await trackInteraction({
      content_id: newVideo._id,
      content_type: 'video',
      action: 'view',
      context: {
        page: 'carousel',
        position: newIndex,
        session_id: watchSession?.session_id
      },
      metadata: {
        navigation_direction: direction,
        previous_video_id: currentVideo?._id
      }
    })
    
    // Initialize new session
    await initializeWatchSession(newVideo)
  }

  const toggleFavorite = async () => {
    if (!currentVideo) return
    
    try {
      const response = await fetch('/api/favorites', {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: currentVideo._id })
      })
      
      if (response.ok) {
        setIsFavorited(!isFavorited)
        await trackInteraction({
          content_id: currentVideo._id,
          content_type: 'video',
          action: isFavorited ? 'unfavorite' : 'favorite'
        })
        
        toast({
          title: isFavorited ? "Removido dos favoritos" : "Adicionado aos favoritos",
          description: isFavorited ? "Vídeo removido da sua lista de favoritos" : "Vídeo adicionado aos seus favoritos"
        })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar favoritos",
        variant: "destructive"
      })
    }
  }

  const toggleBookmark = async () => {
    if (!currentVideo) return
    
    try {
      const response = await fetch('/api/bookmarks', {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: currentVideo._id })
      })
      
      if (response.ok) {
        setIsBookmarked(!isBookmarked)
        await trackInteraction({
          content_id: currentVideo._id,
          content_type: 'video',
          action: isBookmarked ? 'unbookmark' : 'bookmark'
        })
        
        toast({
          title: isBookmarked ? "Bookmark removido" : "Bookmark adicionado",
          description: isBookmarked ? "Vídeo removido dos bookmarks" : "Vídeo salvo nos seus bookmarks"
        })
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar bookmark",
        variant: "destructive"
      })
    }
  }

  const addComment = async () => {
    if (!currentVideo || !newComment.trim()) return
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: currentVideo._id,
          content: newComment.trim()
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setComments([data.comment, ...comments])
          setNewComment('')
          
          await trackInteraction({
            content_id: currentVideo._id,
            content_type: 'video',
            action: 'comment',
            metadata: {
              comment_length: newComment.length
            }
          })
          
          toast({
            title: "Comentário adicionado",
            description: "Seu comentário foi publicado com sucesso"
          })
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar comentário",
        variant: "destructive"
      })
    }
  }

  const likeComment = async (commentId: string) => {
    try {
      const response = await fetch('/api/comments/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: commentId })
      })
      
      if (response.ok) {
        // Reload comments to get updated like counts
        await loadComments(currentVideo!._id)
        
        await trackInteraction({
          content_id: commentId,
          content_type: 'comment',
          action: 'like'
        })
      }
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  const shareVideo = async () => {
    if (!currentVideo) return
    
    try {
      const shareUrl = `${window.location.origin}/video-carousel/${currentVideo._id}`
      await navigator.clipboard.writeText(shareUrl)
      
      await trackInteraction({
        content_id: currentVideo._id,
        content_type: 'video',
        action: 'share',
        metadata: {
          share_method: 'clipboard'
        }
      })
      
      toast({
        title: "Link copiado",
        description: "Link do vídeo copiado para a área de transferência"
      })
    } catch (error) {
      console.error('Error sharing video:', error)
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link",
        variant: "destructive"
      })
    }
  }

  const formatNumber = (num: number | undefined | null) => {
    if (!num || num === 0) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDuration = (duration: string | undefined) => {
    if (!duration) return '0:00'
    return duration
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando vídeos...</p>
        </div>
      </div>
    )
  }

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Vídeo não encontrado</p>
          <p className="text-muted-foreground mb-4">O vídeo que você está procurando não existe ou foi removido.</p>
          <Button onClick={() => router.push('/videos')}>
            Voltar para Vídeos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Video Player Section */}
      <div className="relative">
        <div className="aspect-video bg-black">
          <iframe
            ref={playerRef}
            src={`https://www.youtube.com/embed/${currentVideo.youtube_id}?autoplay=1&rel=0&modestbranding=1`}
            title={currentVideo.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {/* Navigation Controls */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
          onClick={() => navigateVideo('prev')}
          disabled={videos.length <= 1}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
          onClick={() => navigateVideo('next')}
          disabled={videos.length <= 1}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
        
        {/* Video Counter */}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-md px-3 py-1 text-sm">
          {currentVideoIndex + 1} de {videos.length}
        </div>
      </div>

      {/* Video Info and Controls */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Title and Meta */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{currentVideo.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatNumber(currentVideo.youtube_views)} visualizações</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{formatNumber(currentVideo.youtube_likes)} curtidas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(currentVideo.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{currentVideo.youtube_channel_title}</span>
                </div>
              </div>
              
              {/* Category and Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{currentVideo.category}</Badge>
                {currentVideo.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant={isFavorited ? "default" : "outline"}
                size="sm"
                onClick={toggleFavorite}
                className="flex items-center gap-2"
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favoritado' : 'Favoritar'}
              </Button>
              
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="sm"
                onClick={toggleBookmark}
                className="flex items-center gap-2"
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Salvo' : 'Salvar'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={shareVideo}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Comentários ({comments.length})
              </Button>
            </div>

            {/* Description */}
            {currentVideo.description && (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {currentVideo.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            {showComments && (
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-4">Comentários</h3>
                  
                  {/* Add Comment */}
                  <div className="mb-6">
                    <Textarea
                      placeholder="Adicione um comentário..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-2"
                      rows={3}
                    />
                    <Button
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      size="sm"
                    >
                      Comentar
                    </Button>
                  </div>
                  
                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment._id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.user_id.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mb-2">{comment.content}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => likeComment(comment._id)}
                              className="text-xs"
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {comment.likes.length}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {comments.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhum comentário ainda. Seja o primeiro a comentar!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Related Videos */}
          <div className="space-y-4">
            <h3 className="font-semibold">Próximos Vídeos</h3>
            <div className="space-y-3">
              {videos.slice(currentVideoIndex + 1, currentVideoIndex + 6).map((video, index) => (
                <Card
                  key={video._id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => {
                    const newIndex = currentVideoIndex + 1 + index
                    setCurrentVideoIndex(newIndex)
                    setCurrentVideo(video)
                    
                    const newUrl = `/video-carousel/${video._id}?${searchParams.toString()}`
                    window.history.pushState({}, '', newUrl)
                    initializeWatchSession(video)
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <div className="relative w-24 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                        {video.thumbnail && (
                          <img
                            src={video.thumbnail || `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const img = e.currentTarget;
                              if (img.src.includes('maxresdefault')) {
                                img.src = `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`;
                              } else if (img.src.includes('mqdefault')) {
                                img.src = `https://img.youtube.com/vi/${video.youtube_id}/default.jpg`;
                              } else {
                                img.src = '/placeholder.jpg';
                              }
                            }}
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          {video.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {video.youtube_channel_title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{formatNumber(video.youtube_views)} views</span>
                          <span>{formatDuration(video.duration)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
