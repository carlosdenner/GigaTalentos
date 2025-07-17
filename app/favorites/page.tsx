"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Users, Star, Play, Code, Calendar, Trophy, CheckCircle, Clock } from "lucide-react";
import { getYouTubeEmbedUrl } from "@/utils";

interface FeedItem {
  type: 'video' | 'project' | 'channel' | 'desafio';
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  created_at: string;
  action: string;
  fromSubscription?: boolean;
  [key: string]: any;
}

function FeedItemCard({ item }: { item: FeedItem }) {
  const getItemLink = () => {
    switch (item.type) {
      case 'video':
        return item.youtube_id ? `/video-carousel/${item.id}` : `/videos/${item.id}`;
      case 'project':
        return `/projetos/${item.id}`;
      case 'channel':
        return `/channels/${item.id}`;
      case 'desafio':
        return `/desafios/${item.id}`;
      default:
        return '#';
    }
  };

  const getActionText = () => {
    if (item.fromSubscription) {
      return `${item.channel?.name || 'Canal'} ${item.action}`;
    }
    return `Você ${item.action}`;
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'project':
        return <Code className="h-4 w-4" />;
      case 'channel':
        return <Users className="h-4 w-4" />;
      case 'desafio':
        return <Trophy className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'video':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'project':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'channel':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'desafio':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = () => {
    if (item.type === 'project') {
      switch (item.status) {
        case 'ativo':
          return <Clock className="h-3 w-3 text-green-400" />;
        case 'concluido':
          return <CheckCircle className="h-3 w-3 text-blue-400" />;
        case 'pausado':
          return <Clock className="h-3 w-3 text-yellow-400" />;
        default:
          return null;
      }
    }
    if (item.type === 'desafio') {
      switch (item.status) {
        case 'Ativo':
          return <Clock className="h-3 w-3 text-green-400" />;
        case 'Finalizado':
          return <CheckCircle className="h-3 w-3 text-blue-400" />;
        case 'Em Breve':
          return <Calendar className="h-3 w-3 text-yellow-400" />;
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <Link href={getItemLink()} className="group">
      <Card className="bg-[#1a2942] border-gray-800 hover:bg-[#243555] transition">
        <CardContent className="p-4">
          {/* Action and timestamp */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`border ${getTypeColor()}`}>
                {getTypeIcon()}
                <span className="ml-1 capitalize">{item.type}</span>
              </Badge>
              {getStatusIcon()}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(item.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>

          {/* Action text */}
          <p className="text-sm text-gray-300 mb-3">{getActionText()}</p>

          {/* Content based on type */}
          <div className="space-y-3">
            {/* Thumbnail/Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden">
              {item.type === 'video' && item.youtube_id ? (
                <img
                  src={item.thumbnail || `https://img.youtube.com/vi/${item.youtube_id}/maxresdefault.jpg`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src.includes('maxresdefault')) {
                      img.src = `https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`;
                    } else if (img.src.includes('mqdefault')) {
                      img.src = `https://img.youtube.com/vi/${item.youtube_id}/default.jpg`;
                    } else {
                      img.src = '/placeholder.jpg';
                    }
                  }}
                />
              ) : item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  {getTypeIcon()}
                </div>
              )}
            </div>

            {/* Title and description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Type-specific metadata */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              {item.type === 'video' && (
                <>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {(item.views || 0).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {(item.likes || 0).toLocaleString()}
                  </span>
                </>
              )}
              
              {item.type === 'project' && (
                <>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {(item.likes || 0).toLocaleString()}
                  </span>
                  {item.technologies && item.technologies.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Code className="h-4 w-4" />
                      {item.technologies.slice(0, 2).join(', ')}
                      {item.technologies.length > 2 && '...'}
                    </span>
                  )}
                </>
              )}
              
              {item.type === 'channel' && (
                <>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {(item.subscribers || 0).toLocaleString()} seguidores
                  </span>
                  {item.verified && (
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verificado
                    </Badge>
                  )}
                </>
              )}
              
              {item.type === 'desafio' && (
                <>
                  <span className="text-sm">
                    {item.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {item.duration}
                  </span>
                  {item.prizes && item.prizes.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      {item.prizes[0].value}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Channel/Creator info */}
            {(item.channel || item.creator) && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                <img
                  src={(item.channel?.avatar || item.creator?.avatar) || '/placeholder-user.jpg'}
                  alt="Avatar"
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-user.jpg';
                  }}
                />
                <span className="text-sm text-gray-300">
                  {item.channel?.name || item.creator?.name || 'Anônimo'}
                </span>
                {item.category && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    {typeof item.category === 'string' ? item.category : item.category?.name}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function FavoritesPage() {
  const [feedData, setFeedData] = useState<{ feed: FeedItem[]; count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchFavoritesFeed() {
      try {
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data = await response.json();
          setFeedData(data);
        } else {
          console.error('Failed to fetch favorites feed');
        }
      } catch (error) {
        console.error('Error fetching favorites feed:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchFavoritesFeed();
    } else {
      setLoading(false);
    }
  }, [session]);

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-gray-400 py-12">
          <h2 className="text-2xl font-bold mb-4">Faça login para ver seus favoritos</h2>
          <p>Entre na sua conta para acessar seu feed personalizado</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-white py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando seu feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Meus Favoritos</h1>
          <p className="text-gray-400">
            Seu feed personalizado com conteúdos favoritos e atualizações dos canais que você segue
          </p>
        </div>
        {feedData && (
          <Badge variant="outline" className="text-lg px-3 py-1">
            {feedData.count} itens
          </Badge>
        )}
      </div>
      
      {feedData && feedData.feed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedData.feed.map((item, index) => (
            <FeedItemCard key={`${item.type}-${item.id}-${index}`} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12">
          <div className="mb-6">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold mb-4">Seu feed está vazio</h2>
            <p className="mb-6">
              Comece a favoritar conteúdos e seguir canais para ver atualizações aqui!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link href="/videos" className="p-4 bg-[#1a2942] rounded-lg hover:bg-[#243555] transition">
              <Play className="h-8 w-8 mx-auto mb-2 text-red-400" />
              <p className="text-sm">Explore Vídeos</p>
            </Link>
            <Link href="/projetos" className="p-4 bg-[#1a2942] rounded-lg hover:bg-[#243555] transition">
              <Code className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <p className="text-sm">Descubra Projetos</p>
            </Link>
            <Link href="/featured-channels" className="p-4 bg-[#1a2942] rounded-lg hover:bg-[#243555] transition">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-400" />
              <p className="text-sm">Siga Canais</p>
            </Link>
            <Link href="/desafios" className="p-4 bg-[#1a2942] rounded-lg hover:bg-[#243555] transition">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-400" />
              <p className="text-sm">Participe de Desafios</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

