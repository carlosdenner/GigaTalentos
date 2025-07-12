'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Users, Calendar, Target, Heart, Star } from 'lucide-react';
import Link from 'next/link';

interface Projeto {
  _id: string;
  nome: string;
  descricao: string;
  objetivo: string;
  seguidores: number;
  avatar: string;
  imagem_capa: string;
  categoria: string;
  status: 'ativo' | 'concluido' | 'pausado';
  talento_lider_id: {
    _id: string;
    name: string;
    avatar: string;
  };
  criador_id: {
    _id: string;
    name: string;
    avatar: string;
    account_type: string;
  };
  portfolio_id: {
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
  desafio_aprovado: boolean;
  favoritos: string[];
  criado_em: string;
}

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroCriador, setFiltroCriador] = useState<string>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');

  useEffect(() => {
    fetchProjetos();
  }, []);

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

  const projetosFiltrados = projetos.filter(projeto => {
    // Filtro por status
    if (filtroStatus !== 'todos' && projeto.status !== filtroStatus) return false;
    
    // Filtro por tipo de criador
    if (filtroCriador === 'mentores' && projeto.criador_id?.account_type !== 'mentor') return false;
    if (filtroCriador === 'talents' && projeto.criador_id?.account_type !== 'talent') return false;
    
    // Filtro por categoria
    if (filtroCategoria !== 'todas' && projeto.categoria !== filtroCategoria) return false;
    
    return true;
  });

  const categorias = [...new Set(projetos.map(p => p.categoria))].sort();

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
        <h1 className="text-3xl font-bold mb-4">Giga Projetos dos Talentos</h1>
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
        </div>
      </div>

      {/* Grid de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetosFiltrados.map((projeto) => (
          <Card 
            key={projeto._id} 
            className={`hover:shadow-lg transition-shadow ${
              projeto.criador_id?.account_type === 'mentor' 
                ? 'border-2 border-blue-300 bg-blue-50/30' 
                : ''
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge className={getStatusColor(projeto.status)}>
                    {projeto.status}
                  </Badge>
                  {projeto.criador_id?.account_type === 'mentor' && (
                    <Badge variant="default" className="bg-blue-600 text-white">
                      Criado por Mentor
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
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
                  <span className="text-sm font-medium">
                    {projeto.talento_lider_id?.name || 'Líder'}
                  </span>
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
                      Criado por {projeto.criador_id?.name || 'Usuário'}
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

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{projeto.seguidores}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{projeto.favoritos?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(projeto.criado_em).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/projetos/${projeto._id}`}>
                      Ver Projeto
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" title={`Ver portfólio de ${projeto.talento_lider_id?.name}`}>
                    <Link href={`/portfolios/${projeto.portfolio_id._id}`}>
                      📁 Portfólio
                    </Link>
                  </Button>
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
