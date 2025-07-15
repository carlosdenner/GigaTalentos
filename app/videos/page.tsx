"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Play, RefreshCw, Youtube } from "lucide-react"
import YouTubeVideoCard from "@/components/youtube-video-card"

interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtube_id: string;
  youtube_views: number;
  youtube_likes: number;
  youtube_channel_title: string;
  duration: string;
  category: string;
  featured: boolean;
  tags: string[];
  youtube_last_updated: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchVideos();
    checkLastSync();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/videos?youtubeOnly=true&sortBy=youtube_views&order=desc');
      if (response.ok) {
        const data = await response.json();
        setVideos(data); // API returns array directly when youtubeOnly=true
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkLastSync = async () => {
    try {
      const response = await fetch('/api/youtube/sync-metrics');
      if (response.ok) {
        const data = await response.json();
        setLastUpdate(data.lastUpdate);
      }
    } catch (error) {
      console.error("Error checking sync status:", error);
    }
  };

  const syncYouTubeMetrics = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/youtube/sync-metrics', {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setLastUpdate(new Date().toISOString());
        await fetchVideos(); // Refresh videos with new metrics
      }
    } catch (error) {
      console.error("Error syncing YouTube metrics:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getFilteredVideos = () => {
    if (activeCategory === "all") {
      return videos;
    }
    const selectedCategory = categories.find(cat => cat._id === activeCategory);
    return videos.filter(video => video.category === selectedCategory?.name);
  };

  const getVideoCountByCategory = (categoryName: string) => {
    return videos.filter(video => video.category === categoryName).length;
  };

  const formatLastUpdate = (dateString: string | null) => {
    if (!dateString) return "Nunca";
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Agora mesmo";
    if (diffHours < 24) return `${diffHours}h atrás`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  };

  const filteredVideos = getFilteredVideos();
  const totalViews = videos.reduce((sum, video) => sum + video.youtube_views, 0);
  const featuredCount = videos.filter(video => video.featured).length;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Youtube className="h-8 w-8 text-red-600" />
          <h1 className="text-4xl font-bold text-white">Vídeos de Empreendedorismo</h1>
        </div>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          Aprenda com os melhores conteúdos de empreendedorismo do YouTube, organizados por habilidades fundamentais
        </p>
        
        {/* Stats */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            <span>{videos.length} vídeos</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
              <span>{featuredCount} em destaque</span>
            </Badge>
          </div>
          <div>
            {totalViews.toLocaleString()} visualizações totais
          </div>
        </div>
      </div>

      {/* Sync Controls */}
      <div className="flex items-center justify-between bg-[#1a2942] border border-gray-800 rounded-lg p-4">
        <div className="text-sm text-gray-400">
          Última atualização das métricas: <span className="text-white">{formatLastUpdate(lastUpdate)}</span>
        </div>
        <Button
          onClick={syncYouTubeMetrics}
          disabled={isSyncing}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Atualizando...' : 'Atualizar Métricas'}
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-[#1a2942] border border-gray-800">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white"
          >
            Todos ({videos.length})
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger
              key={category._id}
              value={category._id}
              className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white text-center text-xs"
            >
              <div className="flex flex-col items-center">
                <span className="truncate max-w-full">{category.name.split(' ')[0]}</span>
                <span className="text-xs opacity-75">({getVideoCountByCategory(category.name)})</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Todos os Vídeos</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-[#1a2942] border border-gray-800 rounded-lg p-4 animate-pulse">
                    <div className="aspect-video bg-gray-700 rounded mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded" />
                      <div className="h-3 bg-gray-700 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <YouTubeVideoCard 
                    key={video._id} 
                    video={video} 
                    showEmbed={false}
                    source="video_list"
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category._id} value={category._id} className="mt-6">
            <div className="space-y-4">
              <div className="bg-[#1a2942] border border-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{category.name}</h2>
                <p className="text-gray-400">{category.description}</p>
                <div className="mt-4 text-sm text-gray-500">
                  {getVideoCountByCategory(category.name)} vídeos nesta categoria
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-[#1a2942] border border-gray-800 rounded-lg p-4 animate-pulse">
                      <div className="aspect-video bg-gray-700 rounded mb-4" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded" />
                        <div className="h-3 bg-gray-700 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => (
                    <YouTubeVideoCard 
                      key={video._id} 
                      video={video} 
                      showEmbed={false}
                      source={`category_${activeCategory}`}
                    />
                  ))}
                </div>
              )}

              {!isLoading && filteredVideos.length === 0 && (
                <div className="text-center py-12">
                  <Youtube className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Nenhum vídeo encontrado</h3>
                  <p className="text-gray-400">
                    Ainda não temos vídeos para esta categoria.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
