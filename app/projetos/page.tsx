'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserType } from '@/hooks/useUserType';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Users, Calendar, Target, Heart, Star, Plus, Settings, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ProjectFavoriteButton from '@/components/project-favorite-button';
import ProjectParticipationRequest from '@/components/project-participation-request';
import { toast } from '@/hooks/use-toast';

interface Projeto {
  _id: string;
  nome: string;
  descricao: string;
  objetivo: string;
  seguidores: number;
  avatar: string;
  imagem_capa: string;
  categoria: {
    _id: string;
    name: string;
  } | string; // Support both populated and unpopulated formats
  status: 'ativo' | 'concluido' | 'pausado';
  tecnologias?: string[];
  talento_lider_id?: {
    _id: string;
    name: string;
    avatar: string;
  };
  criador_id?: {
    _id: string;
    name: string;
    avatar: string;
    account_type: string;
  };
  portfolio_id?: {
    _id: string;
    name: string;
  };
  desafio_id?: {
    _id: string;
    title: string;
  };
  sponsors?: Array<{
    _id: string;
    name: string;
    avatar: string;
  }>;
  participantes_aprovados?: Array<{
    _id: string;
    name: string;
    avatar: string;
    account_type: string;
  }>;
  desafio_aprovado: boolean;
  favoritos: string[];
  likes: string[];
  criado_em: string;
}

export default function ProjetosPage() {
  const { data: session } = useSession();
  const { userType, isLoading: userTypeLoading } = useUserType();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroCriador, setFiltroCriador] = useState<string>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroTecnologia, setFiltroTecnologia] = useState<string>('todas');

  useEffect(() => {
    fetchProjetos();
    if (session?.user?.id) {
      fetchUserFavorites();
    }
  }, [session]);

  const fetchProjetos = async () => {
    try {
      const response = await fetch('/api/projetos');
      const data = await response.json();
      setProjetos(data);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavorites = async () => {
    try {
      const response = await fetch('/api/project-favorites');
      if (response.ok) {
        const favoritedProjects = await response.json();
        console.log('Fetched favorites:', favoritedProjects); // Debug log
        const favoriteIds = favoritedProjects.map((p: any) => p._id);
        console.log('Favorite IDs:', favoriteIds); // Debug log
        setUserFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  const handleDeleteProjeto = async (projetoId: string) => {
    if (!confirm("Tem certeza que deseja deletar este projeto? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const response = await fetch(`/api/projetos/${projetoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjetos(prev => prev.filter(p => p._id !== projetoId));
        toast({
          title: "Sucesso",
          description: "Projeto deletado com sucesso!",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Erro",
          description: error.error || "Falha ao deletar projeto",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting projeto:', error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive",
      });
    }
  };

  const projetosFiltrados = projetos.filter(projeto => {
    // Filtro por status
    if (filtroStatus !== 'todos' && projeto.status !== filtroStatus) return false;
    
    // Filtro por tipo de criador
    if (filtroCriador === 'mentores' && projeto.criador_id?.account_type !== 'mentor') return false;
    if (filtroCriador === 'talents' && projeto.criador_id?.account_type !== 'talent') return false;
    
    // Filtro por categoria
    if (filtroCategoria !== 'todas' && getCategoryName(projeto.categoria) !== filtroCategoria) return false;
    
    // Filtro por tecnologia
    if (filtroTecnologia !== 'todas' && projeto.tecnologias && !projeto.tecnologias.includes(filtroTecnologia)) return false;
    
    return true;
  });

  // Helper function to get category name
  const getCategoryName = (categoria: any) => {
    if (typeof categoria === 'string') return categoria;
    return categoria?.name || '';
  };

  const categorias = [...new Set(projetos.filter(p => p && p.categoria).map(p => getCategoryName(p.categoria)))].sort();
  
  // Extract all unique technologies
  const tecnologias = [...new Set(
    projetos
      .filter(p => p && p.tecnologias)
      .flatMap(p => p.tecnologias || [])
  )].sort();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      case 'pausado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">Carregando projetos...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Giga Projetos dos Talentos</h1>
          {session && ['talent', 'mentor'].includes(userType || '') && (
            <div className="flex gap-2">
              <Button asChild className="bg-[#10b981] hover:bg-[#10b981]/90">
                <Link href="/projetos/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Projeto
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/participation-requests">
                  <Settings className="h-4 w-4 mr-2" />
                  Minhas Solicitações
                </Link>
              </Button>
            </div>
          )}
        </div>
        <p className="text-gray-600 mb-4">
          Explore projetos inovadores criados pelos talentos e mentores da plataforma
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-4xl mx-auto">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Como funcionam os projetos:</h3>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• <strong>Projetos podem ser criados</strong> por talentos ou mentores</li>
            <li>• <strong>Sempre são liderados</strong> por um talento</li>
            <li>• <strong>Portfólio:</strong> cada projeto faz parte do portfólio do talento líder</li>
            <li>• <strong>Mentores podem ser sponsors</strong> oferecendo suporte e recursos</li>
            <li>• <strong>Desafios requerem aprovação</strong> de mentor para serem associados</li>
          </ul>
        </div>

        {/* Filtros */}
        <div className="space-y-4 mb-8">
          {/* Filtros de Status */}
          <div className="flex justify-center gap-2">
            <Button
              variant={filtroStatus === 'todos' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('todos')}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={filtroStatus === 'ativo' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('ativo')}
              size="sm"
            >
              Ativos
            </Button>
            <Button
              variant={filtroStatus === 'concluido' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('concluido')}
              size="sm"
            >
              Concluídos
            </Button>
            <Button
              variant={filtroStatus === 'pausado' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('pausado')}
              size="sm"
            >
              Pausados
            </Button>
          </div>

          {/* Filtros de Criador */}
          <div className="flex justify-center gap-2">
            <Button
              variant={filtroCriador === 'todos' ? 'default' : 'outline'}
              onClick={() => setFiltroCriador('todos')}
              size="sm"
            >
              Todos Criadores
            </Button>
            <Button
              variant={filtroCriador === 'talents' ? 'default' : 'outline'}
              onClick={() => setFiltroCriador('talents')}
              size="sm"
            >
              Por Talentos
            </Button>
            <Button
              variant={filtroCriador === 'mentores' ? 'default' : 'outline'}
              onClick={() => setFiltroCriador('mentores')}
              size="sm"
            >
              Por Mentores
            </Button>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex justify-center gap-2 flex-wrap">
            <Button
              variant={filtroCategoria === 'todas' ? 'default' : 'outline'}
              onClick={() => setFiltroCategoria('todas')}
              size="sm"
            >
              Todas Categorias
            </Button>
            {categorias.map((categoria) => (
              <Button
                key={categoria}
                variant={filtroCategoria === categoria ? 'default' : 'outline'}
                onClick={() => setFiltroCategoria(categoria)}
                size="sm"
                className="text-xs"
              >
                {categoria}
              </Button>
            ))}
          </div>

          {/* Filtros de Tecnologia */}
          <div className="flex justify-center gap-2 flex-wrap">
            <Button
              variant={filtroTecnologia === 'todas' ? 'default' : 'outline'}
              onClick={() => setFiltroTecnologia('todas')}
              size="sm"
            >
              Todas Tecnologias
            </Button>
            {tecnologias.map((tecnologia) => (
              <Button
                key={tecnologia}
                variant={filtroTecnologia === tecnologia ? 'default' : 'outline'}
                onClick={() => setFiltroTecnologia(tecnologia)}
                size="sm"
                className="text-xs"
              >
                {tecnologia}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetosFiltrados.map((projeto) => (
          <Card 
            key={projeto._id} 
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge className={getStatusColor(projeto.status)}>
                    {projeto.status}
                  </Badge>
                  {projeto.participantes_aprovados && projeto.participantes_aprovados.length > 0 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-blue-200 transition-colors">
                          <Users className="h-3 w-3 mr-1" />
                          {projeto.participantes_aprovados.length} participante{projeto.participantes_aprovados.length > 1 ? 's' : ''}
                        </Badge>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Participantes do Projeto</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          {projeto.participantes_aprovados.map((participante) => (
                            <div key={participante._id} className="flex items-center gap-3 p-2 rounded-lg border">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={participante.avatar} />
                                <AvatarFallback>
                                  {participante.name?.[0] || 'P'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <Link 
                                  href={`/profile/${participante._id}`}
                                  className="font-medium hover:text-blue-600 transition-colors"
                                >
                                  {participante.name}
                                </Link>
                                <p className="text-xs text-gray-500 capitalize">
                                  {participante.account_type}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {projeto.desafio_id && (
                    <Badge variant="outline" className="text-xs">
                      {projeto.desafio_aprovado ? '✓ Desafio' : '⏳ Desafio'}
                    </Badge>
                  )}
                  {projeto.sponsors && projeto.sponsors.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Com Mentoria
                    </Badge>
                  )}
                  {session?.user?.id === projeto.criador_id?._id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteProjeto(projeto._id);
                      }}
                      className="h-6 w-6 p-0 ml-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              <CardTitle className="text-lg">{projeto.nome}</CardTitle>
            </CardHeader>
            
            <CardContent>
              {projeto.imagem_capa && (
                <img
                  src={projeto.imagem_capa}
                  alt={projeto.nome}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
              )}
              
              <div className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {projeto.descricao}
                </p>

                {projeto.objetivo && (
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600 line-clamp-1">{projeto.objetivo}</span>
                  </div>
                )}

                {/* Líder do Projeto */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={projeto.talento_lider_id?.avatar} />
                    <AvatarFallback>
                      {projeto.talento_lider_id?.name?.[0] || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <Link 
                    href={`/profile/${projeto.talento_lider_id?._id}`}
                    className="text-sm font-medium hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {projeto.talento_lider_id?.name || 'Líder'}
                  </Link>
                  <Badge variant="outline" className="text-xs">
                    Líder
                  </Badge>
                </div>

                {/* Criador (se diferente do líder) */}
                {projeto.criador_id && projeto.talento_lider_id && 
                 projeto.criador_id._id !== projeto.talento_lider_id._id && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={projeto.criador_id?.avatar} />
                      <AvatarFallback>
                        {projeto.criador_id?.name?.[0] || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500">
                      Criado por{' '}
                      <Link 
                        href={`/profile/${projeto.criador_id._id}`}
                        className="hover:text-blue-600 transition-colors font-medium"
                      >
                        {projeto.criador_id?.name || 'Usuário'}
                      </Link>
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {projeto.criador_id?.account_type === 'mentor' ? 'Mentor' : 'Talent'}
                    </Badge>
                  </div>
                )}

                {/* Sponsors */}
                {projeto.sponsors && projeto.sponsors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-gray-500">
                      Com mentoria de {projeto.sponsors.length} mentor{projeto.sponsors.length > 1 ? 'es' : ''}
                    </span>
                  </div>
                )}

                {/* Technologies */}
                {projeto.tecnologias && projeto.tecnologias.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-gray-700">Tecnologias:</span>
                    <div className="flex flex-wrap gap-1">
                      {projeto.tecnologias.slice(0, 4).map((tech, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {projeto.tecnologias.length > 4 && (
                        <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-700 border-gray-200">
                          +{projeto.tecnologias.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{projeto.seguidores}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{projeto.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{projeto.favoritos?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(projeto.criado_em).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 flex-wrap">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/projetos/${projeto._id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Projeto
                    </Link>
                  </Button>
                  
                  {projeto.portfolio_id && (
                    <Button asChild variant="outline" size="sm" title={`Ver portfólio de ${projeto.talento_lider_id?.name}`}>
                      <Link href={`/channels/${projeto.portfolio_id._id}`}>
                        📁 Portfólio
                      </Link>
                    </Button>
                  )}

                  {/* Favorite Button */}
                  <ProjectFavoriteButton 
                    projectId={projeto._id}
                    initialFavorited={userFavorites.includes(projeto._id)}
                    onFavoriteChange={(favorited) => {
                      if (favorited) {
                        setUserFavorites(prev => [...prev, projeto._id]);
                      } else {
                        setUserFavorites(prev => prev.filter(id => id !== projeto._id));
                      }
                      // Refresh favorites from server to ensure consistency
                      setTimeout(() => {
                        if (session?.user?.id) {
                          fetchUserFavorites();
                        }
                      }, 500);
                    }}
                  />

                  {/* Participation Request Button */}
                  <ProjectParticipationRequest
                    projectId={projeto._id}
                    projectName={projeto.nome}
                    isLeader={session?.user?.id === projeto.talento_lider_id?._id}
                  />

                  {/* Edit button for creators/leaders */}
                  {session && (
                    session.user.id === projeto.criador_id?._id || 
                    session.user.id === projeto.talento_lider_id?._id
                  ) && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/projetos/${projeto._id}/edit`}>
                        <Settings className="h-4 w-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projetosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Nenhum projeto encontrado</h3>
          <p className="text-gray-600">
            Tente ajustar os filtros ou volte mais tarde.
          </p>
        </div>
      )}
    </div>
  );
}
