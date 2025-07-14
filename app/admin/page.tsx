'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Video, 
  Target, 
  Folder, 
  Eye, 
  Heart, 
  TrendingUp, 
  Activity,
  BarChart3,
  RefreshCw,
  Calendar
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalVideos: number;
    totalProjetos: number;
    totalDesafios: number;
    totalChannels: number;
    totalCategories: number;
  };
  engagement: {
    videos: any;
    projetos: any;
    desafios: any;
  };
  distribution: {
    users: Array<{ _id: string; count: number }>;
    videosByCategory: Array<{ _id: string; count: number; totalViews: number; avgViews: number }>;
    projetosByCategory: Array<{ _id: string; count: number; totalFollowers: number; avgFollowers: number }>;
    desafiosByCategory: Array<{ _id: string; count: number; totalParticipants: number; avgParticipants: number }>;
  };
  recent: {
    videos: any[];
    projetos: any[];
    desafios: any[];
  };
  topPerforming: {
    videos: any[];
    projetos: any[];
    desafios: any[];
  };
  interactions: {
    stats: {
      totalInteractions: number;
      byAction: Record<string, number>;
      byContentType: Record<string, number>;
    };
    usersWithInteractions: number;
    totalUsers: number;
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/analytics');
      const analytics = await response.json();
      setData(analytics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toLocaleString() || '0';
  };

  const formatPercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1) + '%';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0f1419] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">
            <p>Erro ao carregar dados do dashboard</p>
            <Button onClick={fetchData} className="mt-4">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Monitoramento da Plataforma Giga Talentos</p>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Atualizado: {lastUpdated.toLocaleTimeString('pt-BR')}
              </div>
            )}
            <Button onClick={fetchData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-[#1a2942] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Usuários</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(data.overview.totalUsers)}</p>
                </div>
                <Users className="h-8 w-8 text-[#3b82f6]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Vídeos</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(data.overview.totalVideos)}</p>
                </div>
                <Video className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Projetos</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(data.overview.totalProjetos)}</p>
                </div>
                <Folder className="h-8 w-8 text-[#10b981]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Desafios</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(data.overview.totalDesafios)}</p>
                </div>
                <Target className="h-8 w-8 text-[#f59e0b]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Canais</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(data.overview.totalChannels)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Categorias</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(data.overview.totalCategories)}</p>
                </div>
                <Activity className="h-8 w-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-[#1a2942] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Video className="h-5 w-5 text-red-500" />
                Engajamento de Vídeos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total de Views</span>
                <span className="text-white font-medium">{formatNumber(data.engagement.videos.totalViews)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total de Likes</span>
                <span className="text-white font-medium">{formatNumber(data.engagement.videos.totalLikes)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Média de Views</span>
                <span className="text-white font-medium">{formatNumber(data.engagement.videos.avgViews)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Views Máximas</span>
                <span className="text-white font-medium">{formatNumber(data.engagement.videos.maxViews)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Folder className="h-5 w-5 text-[#10b981]" />
                Engajamento de Projetos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Seguidores</span>
                <span className="text-white font-medium">{formatNumber(data.engagement.projetos.totalFollowers)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Média Seguidores</span>
                <span className="text-white font-medium">{formatNumber(data.engagement.projetos.avgFollowers)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Projetos Ativos</span>
                <span className="text-white font-medium">{formatNumber(data.engagement.projetos.totalActive)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Projetos Concluídos</span>
                <span className="text-white font-medium">{formatNumber(data.engagement.projetos.totalCompleted)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-[#f59e0b]" />
                Engajamento de Desafios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Participantes</span>
                <span className="text-white font-medium">{formatNumber(data.engagement.desafios.totalParticipants)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Média Participantes</span>
                <span className="text-white font-medium">{formatNumber(data.engagement.desafios.avgParticipants)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Desafios Ativos</span>
                <span className="text-white font-medium">{formatNumber(data.engagement.desafios.totalActive)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Em Destaque</span>
                <span className="text-white font-medium">{formatNumber(data.engagement.desafios.totalFeatured)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="bg-[#1a2942] border-gray-800">
            <TabsTrigger value="content" className="text-white">Conteúdo</TabsTrigger>
            <TabsTrigger value="users" className="text-white">Usuários</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
            <TabsTrigger value="recommendations" className="text-white">Recomendações</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Videos */}
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Vídeos Mais Populares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.topPerforming.videos.slice(0, 5).map((video, index) => (
                      <div key={video._id} className="flex items-center justify-between p-3 bg-[#0f1419] rounded-lg">
                        <div className="flex-1">
                          <p className="text-white font-medium truncate">{video.title}</p>
                          <p className="text-sm text-gray-400">{video.channel_id?.name}</p>
                          <Badge variant="outline" className="mt-1">{video.category}</Badge>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Eye className="h-4 w-4" />
                            {formatNumber(video.views)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Heart className="h-4 w-4" />
                            {formatNumber(video.likes)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Projects */}
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Projetos Mais Seguidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.topPerforming.projetos.slice(0, 5).map((projeto, index) => (
                      <div key={projeto._id} className="flex items-center justify-between p-3 bg-[#0f1419] rounded-lg">
                        <div className="flex-1">
                          <p className="text-white font-medium truncate">{projeto.nome}</p>
                          <p className="text-sm text-gray-400">{projeto.talento_lider_id?.name}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{projeto.categoria}</Badge>
                            <Badge variant={projeto.status === 'ativo' ? 'default' : 'secondary'}>
                              {projeto.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Users className="h-4 w-4" />
                            {formatNumber(projeto.seguidores)} seguidores
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Distribution */}
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Distribuição de Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.distribution.users.map((userType) => (
                      <div key={userType._id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            userType._id === 'talent' ? 'bg-[#10b981]' :
                            userType._id === 'fan' ? 'bg-[#3b82f6]' : 'bg-[#f59e0b]'
                          }`}></div>
                          <span className="text-white capitalize">{userType._id}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-medium">{userType.count}</span>
                          <span className="text-sm text-gray-400 ml-2">
                            ({formatPercentage(userType.count, data.overview.totalUsers)})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Interaction Stats */}
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Estatísticas de Interação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total de Interações</span>
                      <span className="text-white font-medium">{formatNumber(data.interactions.stats.totalInteractions)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Usuários com Interações</span>
                      <span className="text-white font-medium">
                        {data.interactions.usersWithInteractions} / {data.interactions.totalUsers}
                        <span className="text-sm text-gray-400 ml-2">
                          ({formatPercentage(data.interactions.usersWithInteractions, data.interactions.totalUsers)})
                        </span>
                      </span>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-white font-medium mb-3">Por Tipo de Ação</h4>
                      <div className="space-y-2">
                        {Object.entries(data.interactions.stats.byAction).map(([action, count]) => (
                          <div key={action} className="flex justify-between items-center">
                            <span className="text-gray-400 capitalize">{action}</span>
                            <span className="text-white">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-white font-medium mb-3">Por Tipo de Conteúdo</h4>
                      <div className="space-y-2">
                        {Object.entries(data.interactions.stats.byContentType).map(([type, count]) => (
                          <div key={type} className="flex justify-between items-center">
                            <span className="text-gray-400 capitalize">{type}</span>
                            <span className="text-white">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Videos by Category */}
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Vídeos por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.distribution.videosByCategory.map((category) => (
                      <div key={category._id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm">{category._id}</span>
                          <span className="text-gray-400 text-sm">{category.count} vídeos</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">Total Views: {formatNumber(category.totalViews)}</span>
                          <span className="text-gray-400">Avg: {formatNumber(category.avgViews)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Projects by Category */}
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Projetos por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.distribution.projetosByCategory.map((category) => (
                      <div key={category._id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm">{category._id}</span>
                          <span className="text-gray-400 text-sm">{category.count} projetos</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">Total: {formatNumber(category.totalFollowers)} seguidores</span>
                          <span className="text-gray-400">Avg: {formatNumber(category.avgFollowers)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Challenges by Category */}
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Desafios por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.distribution.desafiosByCategory.map((category) => (
                      <div key={category._id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm">{category._id}</span>
                          <span className="text-gray-400 text-sm">{category.count} desafios</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">Total: {formatNumber(category.totalParticipants)} participantes</span>
                          <span className="text-gray-400">Avg: {formatNumber(category.avgParticipants)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card className="bg-[#1a2942] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Sistema de Recomendações - Como Funciona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-[#10b981] font-semibold">Para Talentos</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Desafios com ≥50 participantes</li>
                      <li>• Projetos com ≥100 seguidores</li>
                      <li>• Vídeos educacionais/tutoriais</li>
                      <li>• Conteúdo das categorias preferidas</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-[#3b82f6] font-semibold">Para Sponsors</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Projetos com ≥50 seguidores</li>
                      <li>• Vídeos com ≥200 views</li>
                      <li>• Desafios populares (≥100 participantes)</li>
                      <li>• Projetos com sponsors existentes</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-[#f59e0b] font-semibold">Para Visitantes</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Vídeos com ≥100 views</li>
                      <li>• Projetos com ≥30 seguidores</li>
                      <li>• Desafios em destaque</li>
                      <li>• Conteúdo geral popular</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-white font-semibold mb-4">Algoritmo de Pontuação</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-gray-300">Fatores de Popularidade:</h4>
                      <ul className="space-y-1 text-sm text-gray-400">
                        <li>• Views/Participantes (escala logarítmica)</li>
                        <li>• Likes e engajamento</li>
                        <li>• Recência do conteúdo</li>
                        <li>• Status de destaque</li>
                        <li>• Projetos concluídos</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-gray-300">Personalização:</h4>
                      <ul className="space-y-1 text-sm text-gray-400">
                        <li>• Categorias do usuário (+30% score)</li>
                        <li>• Histórico de interações</li>
                        <li>• Tipo de usuário (weights)</li>
                        <li>• Shuffle inteligente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
