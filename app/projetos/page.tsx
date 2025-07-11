'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Calendar, Target, Heart } from 'lucide-react';
import Link from 'next/link';

interface Projeto {
  _id: string;
  nome: string;
  descricao: string;
  objetivo?: string;
  seguidores: number;
  imagem_capa?: string;
  categoria: string;
  status: 'ativo' | 'concluido' | 'pausado';
  talento_lider_id?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  criador_id?: {
    _id: string;
    name: string;
    avatar?: string;
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
  sponsors?: any[];
  favoritos?: any[];
  criado_em: string;
}

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  useEffect(() => {
    fetchProjetos();
  }, []);

  const fetchProjetos = async () => {
    try {
      const response = await fetch('/api/projetos');
      if (response.ok) {
        const data = await response.json();
        setProjetos(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      setProjetos([]);
    } finally {
      setLoading(false);
    }
  };

  const projetosFiltrados = projetos.filter(projeto => {
    if (filtroStatus === 'todos') return true;
    return projeto.status === filtroStatus;
  });

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
        <p className="text-gray-600 mb-6">
          Explore projetos inovadores criados pelos talentos da plataforma
        </p>

        {/* Filtros */}
        <div className="flex justify-center gap-2 mb-8">
          {['todos', 'ativo', 'concluido', 'pausado'].map((status) => (
            <Button
              key={status}
              variant={filtroStatus === status ? 'default' : 'outline'}
              onClick={() => setFiltroStatus(status)}
            >
              {status === 'todos' ? 'Todos' : 
               status === 'ativo' ? 'Ativos' :
               status === 'concluido' ? 'Concluídos' : 'Pausados'}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetosFiltrados.map((projeto) => {
          // Verificações de segurança
          const nome = projeto?.nome || 'Projeto sem nome';
          const descricao = projeto?.descricao || 'Sem descrição';
          const liderNome = projeto?.talento_lider_id?.name || 'Líder';
          const liderAvatar = projeto?.talento_lider_id?.avatar || '';
          const liderInicial = liderNome?.[0]?.toUpperCase() || 'L';
          const criadorNome = projeto?.criador_id?.name || '';
          const criadorAvatar = projeto?.criador_id?.avatar || '';
          const criadorInicial = criadorNome?.[0]?.toUpperCase() || 'C';
          const criadorTipo = projeto?.criador_id?.account_type === 'mentor' ? 'Mentor' : 'Talent';

          return (
            <Card key={projeto._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(projeto.status)}>
                    {projeto.status}
                  </Badge>
                  {projeto.desafio_id && (
                    <Badge variant="outline">Desafio</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{nome}</CardTitle>
              </CardHeader>
              
              <CardContent>
                {projeto.imagem_capa && (
                  <img
                    src={projeto.imagem_capa}
                    alt={nome}
                    className="w-full h-32 object-cover rounded-md mb-4"
                  />
                )}
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{descricao}</p>

                  {projeto.objetivo && (
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-600 line-clamp-1">{projeto.objetivo}</span>
                    </div>
                  )}

                  {/* Líder do Projeto */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={liderAvatar} />
                      <AvatarFallback>{liderInicial}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{liderNome}</span>
                    <Badge variant="outline" className="text-xs">Líder</Badge>
                  </div>

                  {/* Criador (se diferente do líder) */}
                  {projeto.criador_id && projeto.talento_lider_id && 
                   projeto.criador_id._id !== projeto.talento_lider_id._id && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={criadorAvatar} />
                        <AvatarFallback>{criadorInicial}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">
                        Criado por {criadorNome}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {criadorTipo}
                      </Badge>
                    </div>
                  )}

                  {/* Sponsors */}
                  {projeto.sponsors && projeto.sponsors.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-yellow-50">
                        💰 {projeto.sponsors.length} Mentor{projeto.sponsors.length > 1 ? 'es' : ''}
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{projeto.seguidores || 0}</span>
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
                      <Link href={`/projetos/${projeto._id}`}>Ver Projeto</Link>
                    </Button>
                    {projeto.portfolio_id && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/portfolios/${projeto.portfolio_id._id}`}>Portfólio</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
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