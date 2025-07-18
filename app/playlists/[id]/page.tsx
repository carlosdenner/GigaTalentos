'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Play, 
  Heart, 
  Users, 
  Clock, 
  PlayCircle,
  ListMusic,
  ArrowLeft,
  Share2,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Video {
  _id: string;
  title: string;
  duration: string;
  thumbnail?: string;
  youtube_id?: string;
  channel_id: {
    name: string;
    avatar?: string;
  };
  view_count: number;
  youtube_views: number;
}

interface Playlist {
  _id: string;
  name: string;
  description?: string;
  user_id: {
    _id: string;
    name: string;
    avatar?: string;
    account_type: string;
  };
  videos: Video[];
  followers: string[];
  isFollowing?: boolean;
  is_public: boolean;
  total_duration: number;
  created_at: string;
}

export default function PlaylistDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchPlaylist();
    }
  }, [params.id, session]);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/playlists/${params.id}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Playlist não encontrada",
            description: "Esta playlist pode ter sido removida ou não existe",
            variant: "destructive"
          });
          router.push('/playlists');
          return;
        }
        throw new Error('Failed to fetch playlist');
      }

      const data = await response.json();
      setPlaylist(data);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar playlist",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollowPlaylist = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Login necessário",
        description: "Faça login para seguir playlists",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/playlists/${params.id}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Playlist seguida!"
        });
        fetchPlaylist(); // Refresh data
      } else {
        throw new Error('Failed to follow playlist');
      }
    } catch (error) {
      console.error("Error following playlist:", error);
      toast({
        title: "Erro",
        description: "Falha ao seguir playlist",
        variant: "destructive"
      });
    }
  };

  const handleUnfollowPlaylist = async () => {
    try {
      const response = await fetch(`/api/playlists/${params.id}/follow`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Playlist não seguida"
        });
        fetchPlaylist(); // Refresh data
      } else {
        throw new Error('Failed to unfollow playlist');
      }
    } catch (error) {
      console.error("Error unfollowing playlist:", error);
      toast({
        title: "Erro",
        description: "Falha ao deixar de seguir playlist",
        variant: "destructive"
      });
    }
  };

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const playVideo = (index: number) => {
    const video = playlist?.videos[index];
    if (video?.youtube_id) {
      router.push(`/video-carousel/${video._id}?playlist=${params.id}&index=${index}`);
    } else {
      router.push(`/talents/${video?._id}`);
    }
  };

  const sharePlaylist = async () => {
    const url = `${window.location.origin}/playlists/${params.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copiado!",
        description: "O link da playlist foi copiado para a área de transferência"
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Erro",
        description: "Falha ao copiar link",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-[#1a2942] border-gray-800">
          <CardContent className="p-8 text-center">
            <ListMusic className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Playlist não encontrada</h2>
            <p className="text-gray-400 mb-6">
              Esta playlist pode ter sido removida ou você não tem permissão para visualizá-la
            </p>
            <Link href="/playlists">
              <Button className="bg-[#10b981] hover:bg-[#059669] text-white">
                Voltar às Playlists
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = session?.user?.id === playlist.user_id._id;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/playlists">
          <Button variant="outline" size="sm" className="text-gray-400 border-gray-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Playlist Info */}
      <Card className="bg-[#1a2942] border-gray-800">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            {/* Playlist Icon */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-[#10b981] to-[#3b82f6] rounded-lg flex items-center justify-center">
                <ListMusic className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">{playlist.videos.length}</span>
              </div>
            </div>

            {/* Playlist Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{playlist.name}</h1>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={playlist.user_id.avatar} />
                      <AvatarFallback>
                        {playlist.user_id.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-300 text-lg">{playlist.user_id.name}</span>
                    <Badge variant="outline">
                      {playlist.user_id.account_type}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button onClick={sharePlaylist} variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  
                  {!isOwner && (
                    <Button
                      onClick={playlist.isFollowing ? handleUnfollowPlaylist : handleFollowPlaylist}
                      variant={playlist.isFollowing ? "outline" : "default"}
                      className={playlist.isFollowing ? "border-green-600 text-green-600" : "bg-[#10b981] hover:bg-[#059669]"}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${playlist.isFollowing ? 'fill-current' : ''}`} />
                      {playlist.isFollowing ? 'Seguindo' : 'Seguir'}
                    </Button>
                  )}

                  {isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#1a2942] border-gray-800">
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-gray-700">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              {playlist.description && (
                <p className="text-gray-300 mb-4">{playlist.description}</p>
              )}

              <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-1">
                  <PlayCircle className="h-4 w-4" />
                  <span>{playlist.videos.length} vídeos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(playlist.total_duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{playlist.followers.length} seguidores</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{playlist.is_public ? 'Pública' : 'Privada'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(playlist.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <Button 
                onClick={() => playVideo(0)}
                className="bg-[#10b981] hover:bg-[#059669] text-white"
                disabled={playlist.videos.length === 0}
              >
                <Play className="h-4 w-4 mr-2" />
                Reproduzir Tudo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Videos List */}
      <Card className="bg-[#1a2942] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Vídeos da Playlist</CardTitle>
        </CardHeader>
        <CardContent>
          {playlist.videos.length === 0 ? (
            <div className="text-center py-12">
              <PlayCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Playlist vazia</h3>
              <p className="text-gray-500">
                Esta playlist ainda não possui vídeos
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {playlist.videos.map((video, index) => (
                <div
                  key={video._id}
                  className="flex items-center gap-4 p-4 bg-[#0a192f] rounded-lg hover:bg-[#243555] transition-colors cursor-pointer group"
                  onClick={() => playVideo(index)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-gray-400 w-8 text-center">{index + 1}</span>
                    
                    <div className="relative w-24 h-16 rounded overflow-hidden bg-gray-800">
                      {video.youtube_id && (
                        <img
                          src={video.thumbnail || `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-white font-medium line-clamp-1">{video.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <span>{video.channel_id.name}</span>
                        <span>•</span>
                        <span>{(video.youtube_views || video.view_count || 0).toLocaleString()} visualizações</span>
                      </div>
                    </div>
                  </div>
                  
                  <span className="text-gray-400 text-sm">{video.duration}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
