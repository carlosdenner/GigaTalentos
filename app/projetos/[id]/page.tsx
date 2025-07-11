'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Users, Calendar, Target, Trophy } from 'lucide-react';
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
    bio: string;
  };
  portfolio_id: {
    _id: string;
    name: string;
  };
  desafio_id?: {
    _id: string;
    title: string;
    description: string;
  };
  criado_em: string;
  atualizado_em: string;
}

export default function ProjetoPage() {
  const params = useParams();
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProjeto(params.id as string);
    }
  }, [params.id]);

  const fetchProjeto = async (id: string) => {
    try {
      const response = await fetch(`/api/projetos/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProjeto(data);
      }
    } catch (error) {
      console.error('Erro ao buscar projeto:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold">Carregando projeto...</h1>
        </div>
      </div>
    );
  }

  if (!projeto) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Projeto não encontrado</h1>
          <Button asChild>
            <Link href="/projetos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Projetos
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/projetos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Projetos
          </Link>
        </Button>
      </div>

      {/* Capa do Projeto */}
      {projeto.imagem_capa && (
        <div className="mb-8">
          <img
            src={projeto.imagem_capa}
            alt={projeto.nome}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conteúdo Principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl">{projeto.nome}</CardTitle>
                  <Badge className={getStatusColor(projeto.status)}>
                    {projeto.status}
                  </Badge>
                </div>
                {projeto.desafio_id && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    Desafio
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-gray-600">{projeto.descricao}</p>
              </div>

              {projeto.objetivo && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Objetivo
                  </h3>
                  <p className="text-gray-600">{projeto.objetivo}</p>
                </div>
              )}

              {projeto.desafio_id && (
                <div>
                  <h3 className="font-semibold mb-2">Desafio Relacionado</h3>
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <h4 className="font-medium">{projeto.desafio_id.title}</h4>
                      {projeto.desafio_id.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {projeto.desafio_id.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{projeto.seguidores} seguidores</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Criado em {new Date(projeto.criado_em).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Talento Líder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Talento Líder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={projeto.talento_lider_id.avatar} />
                  <AvatarFallback>
                    {projeto.talento_lider_id.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{projeto.talento_lider_id.name}</h4>
                  <p className="text-sm text-gray-600">Líder do Projeto</p>
                </div>
              </div>
              {projeto.talento_lider_id.bio && (
                <p className="text-sm text-gray-600 mb-4">
                  {projeto.talento_lider_id.bio}
                </p>
              )}
              <Button asChild variant="outline" className="w-full">
                <Link href={`/talentos/${projeto.talento_lider_id._id}`}>
                  Ver Perfil
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Portfólio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Portfólio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-medium">{projeto.portfolio_id.name}</h4>
                <p className="text-sm text-gray-600">
                  Este projeto faz parte do portfólio do talento
                </p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/portfolios/${projeto.portfolio_id._id}`}>
                  Ver Portfólio Completo
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Categoria */}
          {projeto.categoria && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-sm">
                  {projeto.categoria}
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
