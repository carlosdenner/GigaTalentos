'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Users, Calendar, Trophy, Play } from 'lucide-react';
import { useUserType } from '@/hooks/useUserType';
import { useAnalytics } from '@/hooks/useAnalytics';
import { getYouTubeEmbedUrl } from '@/utils';

interface ContentItem {
  _id: string;
  type: 'video' | 'projeto' | 'desafio';
  title?: string;
  name?: string;
  description?: string;
  video_url?: string;
  views?: number;
  likes?: number;
  seguidores?: number;
  participants?: number;
  prazo_final?: string;
  status?: string;
  channel_id?: {
    name: string;
    avatar?: string;
  };
  talento_lider_id?: {
    name: string;
    avatar?: string;
  };
  portfolio_id?: {
    name: string;
  };
  category?: {
    name: string;
  };
  categoria?: string;
  premio?: string;
  duration?: string;
}

export default function FeaturedContent() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { userType, isLoading: userTypeLoading } = useUserType();
  const { trackClick, trackView } = useAnalytics();

  useEffect(() => {
    async function fetchContent() {
      if (userTypeLoading) return;
      
      try {
        const response = await fetch(`/api/popular-content?userType=${userType || 'other'}&limit=6`);
        const data = await response.json();
        setContent(data.data || []);
      } catch (error) {
        console.error('Error fetching popular content:', error);
        setContent([]);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [userType, userTypeLoading]);

  // Track views for loaded content
  useEffect(() => {
    if (content.length > 0) {
      content.forEach((item, index) => {
        trackView(item._id, item.type, {
          source: 'featured-section',
          position: index,
          userType: userType || 'anonymous'
        });
      });
    }
  }, [content, trackView, userType]);

  const handleContentClick = (item: ContentItem) => {
    trackClick(item._id, item.type, {
      source: 'featured-section',
      userType: userType || 'anonymous',
      position: content.findIndex(c => c._id === item._id)
    });
  };

  const getContentLink = (item: ContentItem) => {
    switch (item.type) {
      case 'video':
        return `/talents/${item._id}`;
      case 'projeto':
        return `/projetos/${item._id}`;
      case 'desafio':
        return `/desafios/${item._id}`;
      default:
        return '#';
    }
  };

  const getContentTitle = (item: ContentItem) => {
    return item.title || item.name || 'Conteúdo';
  };

  const renderVideoCard = (item: ContentItem) => (
    <Card key={item._id} className="bg-[#1a2942] border-gray-800 overflow-hidden group hover:border-[#3b82f6] transition-colors">
      <div className="relative aspect-video">
        {item.video_url ? (
          <iframe
            width="100%"
            height="100%"
            src={getYouTubeEmbedUrl(item.video_url)}
            title={getContentTitle(item)}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-t-lg">
            <Play className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <Badge className="absolute top-2 left-2 bg-red-600 text-white">
          <Play className="h-3 w-3 mr-1" />
          Vídeo
        </Badge>
        {item.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-sm">
            {item.duration}
          </div>
        )}
        <div className="absolute top-2 right-2 flex items-center gap-2 text-white text-sm">
          {item.views && (
            <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded">
              <Eye className="h-3 w-3" />
              <span>{item.views.toLocaleString()}</span>
            </div>
          )}
          {item.likes && (
            <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded">
              <Heart className="h-3 w-3 text-red-500" />
              <span>{item.likes.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-white font-medium group-hover:text-[#3b82f6] mb-2 line-clamp-2">
          {getContentTitle(item)}
        </h3>
        {item.channel_id?.name && (
          <p className="text-[#1e90ff] text-sm">{item.channel_id.name}</p>
        )}
      </CardContent>
    </Card>
  );

  const renderProjetoCard = (item: ContentItem) => (
    <Card key={item._id} className="bg-[#1a2942] border-gray-800 overflow-hidden group hover:border-[#10b981] transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge className="bg-green-600 text-white">
            <Trophy className="h-3 w-3 mr-1" />
            Projeto
          </Badge>
          {item.status && (
            <Badge variant={item.status === 'concluido' ? 'default' : 'secondary'}>
              {item.status}
            </Badge>
          )}
        </div>
        
        <h3 className="text-white font-medium group-hover:text-[#10b981] mb-2 line-clamp-2">
          {getContentTitle(item)}
        </h3>
        
        {item.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{item.description}</p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          {item.talento_lider_id?.name && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#10b981] rounded-full flex items-center justify-center text-white text-xs">
                {item.talento_lider_id.name.charAt(0)}
              </div>
              <span>{item.talento_lider_id.name}</span>
            </div>
          )}
          {item.seguidores && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{item.seguidores} seguidores</span>
            </div>
          )}
        </div>
        
        {item.portfolio_id?.name && (
          <p className="text-[#1e90ff] text-sm mt-2">Portfolio: {item.portfolio_id.name}</p>
        )}
      </CardContent>
    </Card>
  );

  const renderDesafioCard = (item: ContentItem) => (
    <Card key={item._id} className="bg-[#1a2942] border-gray-800 overflow-hidden group hover:border-[#f59e0b] transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge className="bg-yellow-600 text-white">
            <Trophy className="h-3 w-3 mr-1" />
            Desafio
          </Badge>
          {item.prazo_final && (
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Calendar className="h-3 w-3" />
              <span>{new Date(item.prazo_final).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-white font-medium group-hover:text-[#f59e0b] mb-2 line-clamp-2">
          {getContentTitle(item)}
        </h3>
        
        {item.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{item.description}</p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          {item.participants && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{item.participants} participantes</span>
            </div>
          )}
          {item.premio && (
            <div className="text-[#f59e0b] font-medium">
              Prêmio: {item.premio}
            </div>
          )}
        </div>
        
        {(item.category?.name || item.categoria) && (
          <p className="text-[#1e90ff] text-sm mt-2">
            Categoria: {item.category?.name || item.categoria}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const renderContentCard = (item: ContentItem) => {
    return (
      <Link 
        href={getContentLink(item)} 
        key={item._id}
        onClick={() => handleContentClick(item)}
      >
        {item.type === 'video' && renderVideoCard(item)}
        {item.type === 'projeto' && renderProjetoCard(item)}
        {item.type === 'desafio' && renderDesafioCard(item)}
      </Link>
    );
  };

  if (loading || userTypeLoading) {
    return (
      <section>
        <h2 className="text-3xl font-bold text-white mb-6">Empreendedorismo em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-[#1a2942] border-gray-800 animate-pulse">
              <div className="aspect-video bg-gray-700 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  const getRecommendationMessage = () => {
    switch (userType) {
      case 'talent':
        return 'Desafios e projetos recomendados para talentos em ascensão';
      case 'sponsor':
        return 'Projetos e talentos promissores para patrocínio';
      case 'fan':
        return 'Conteúdo popular e projetos em destaque';
      default:
        return 'Descubra os melhores projetos, vídeos e desafios da plataforma';
    }
  };

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Empreendedorismo em Destaque</h2>
          <p className="text-gray-400">{getRecommendationMessage()}</p>
        </div>
        {userType && (
          <Badge variant="outline" className="mt-2 sm:mt-0">
            Personalizado para {userType}
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map(renderContentCard)}
      </div>
      
      {content.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Nenhum conteúdo popular encontrado no momento.</p>
          <Link href="/categories">
            <Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90">
              Explorar Categorias
            </Button>
          </Link>
        </div>
      )}
      
      {content.length > 0 && (
        <div className="mt-8 text-center">
          <Link href="/search">
            <Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white mr-4">
              Explorar Mais Conteúdo
            </Button>
          </Link>
          <Link href="/projetos">
            <Button variant="outline">
              Ver Todos os Projetos
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
