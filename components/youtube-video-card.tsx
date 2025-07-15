"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Eye, ThumbsUp, ExternalLink, Clock } from "lucide-react"
import Image from "next/image"

interface YouTubeVideoProps {
  video: {
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
    featured: boolean;
    tags?: string[];
  };
  showEmbed?: boolean;
  onPlay?: () => void;
  source?: string; // For analytics tracking
}

export default function YouTubeVideoCard({ 
  video, 
  showEmbed = false, 
  onPlay,
  source = 'video_list'
}: YouTubeVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const router = useRouter();

  const formatNumber = (num: number | undefined | null) => {
    if (!num || num === 0) {
      return '0';
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  };

  const getYouTubeUrl = (videoId: string) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
  };

  const getThumbnailUrl = (videoId: string, fallbackThumbnail?: string) => {
    if (fallbackThumbnail && fallbackThumbnail.trim() !== '') {
      return fallbackThumbnail;
    }
    // Try different YouTube thumbnail qualities - start with medium quality which is more reliable
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  const getFallbackThumbnails = (videoId: string) => {
    return [
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/default.jpg`,
      '/placeholder.jpg'
    ];
  };

  const handleWatchVideo = () => {
    // Navigate to carousel page instead of playing inline
    const queryParams = new URLSearchParams({
      category: video.category,
      source: source
    });
    
    router.push(`/video-carousel/${video._id}?${queryParams.toString()}`);
    
    if (onPlay) onPlay();
  };

  const handlePlay = () => {
    if (showEmbed) {
      setIsPlaying(true);
      if (onPlay) onPlay();
    } else {
      handleWatchVideo();
    }
  };

  const truncateDescription = (text: string | undefined | null, maxLength: number = 150) => {
    if (!text) return 'Sem descrição disponível';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="bg-[#1a2942] border-gray-800 hover:border-[#10b981] transition-all duration-300 group overflow-hidden">
      {/* Video Thumbnail or Embed */}
      <div className="relative aspect-video bg-gray-900">
        {isPlaying && showEmbed ? (
          <iframe
            src={getYouTubeEmbedUrl(video.youtube_id)}
            title={video.title || 'Vídeo do YouTube'}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full cursor-pointer" onClick={handlePlay}>
            <Image
              src={getThumbnailUrl(video.youtube_id, video.thumbnail)}
              alt={video.title || 'Thumbnail do vídeo'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const img = e.currentTarget;
                const fallbacks = getFallbackThumbnails(video.youtube_id);
                const currentSrc = img.src;
                const currentIndex = fallbacks.findIndex(url => img.src.includes(url.split('/').pop()?.split('.')[0] || ''));
                
                if (currentIndex < fallbacks.length - 1) {
                  img.src = fallbacks[currentIndex + 1];
                } else {
                  // Last fallback - use placeholder
                  img.src = '/placeholder.jpg';
                }
              }}
            />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-red-600 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>

            {/* Featured Badge */}
            {video.featured && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-yellow-500 text-yellow-900 border-yellow-600">
                  ⭐ Destaque
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-white text-lg leading-tight group-hover:text-[#10b981] transition-colors line-clamp-2">
              {video.title || 'Título não disponível'}
            </CardTitle>
            <p className="text-gray-400 text-sm mt-1">
              {video.youtube_channel_title || 'Canal desconhecido'}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{formatNumber(video.youtube_views)} visualizações</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{formatNumber(video.youtube_likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{video.duration || 'N/A'}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Description */}
        <div>
          <CardDescription className="text-gray-400 text-sm leading-relaxed">
            {showFullDescription 
              ? (video.description || 'Sem descrição disponível')
              : truncateDescription(video.description)
            }
            {video.description && video.description.length > 150 && (
              <button 
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-[#10b981] hover:underline ml-1 text-sm"
              >
                {showFullDescription ? "Ver menos" : "Ver mais"}
              </button>
            )}
          </CardDescription>
        </div>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-gray-600 text-gray-400 bg-gray-800/50"
              >
                {tag}
              </Badge>
            ))}
            {video.tags.length > 3 && (
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400 bg-gray-800/50">
                +{video.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={handleWatchVideo}
          >
            <Play className="mr-2 h-4 w-4" />
            Assistir
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => window.open(getYouTubeUrl(video.youtube_id), '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Category */}
        <div className="text-xs text-gray-500 pt-1 border-t border-gray-800">
          Categoria: {video.category}
        </div>
      </CardContent>
    </Card>
  );
}
