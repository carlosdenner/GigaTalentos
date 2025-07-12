'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle, Eye, Heart, Users, Star, TrendingUp } from "lucide-react";

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
  favoritos: string[];
  verificado: boolean;
  demo: boolean;
  criado_em: string;
}

export default function FeaturedProjectsPage() {
  const [projects, setProjects] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFeaturedProjects() {
      try {
        const response = await fetch('/api/projetos');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const allProjects = await response.json();
        
        // Ordenar projetos por popularidade (combinação de seguidores e favoritos)
        const sortedProjects = allProjects
          .filter((project: Projeto) => project.status === 'ativo') // Apenas projetos ativos
          .sort((a: Projeto, b: Projeto) => {
            const scoreA = (a.seguidores || 0) + (a.favoritos?.length || 0) * 2 + (a.verificado ? 10 : 0);
            const scoreB = (b.seguidores || 0) + (b.favoritos?.length || 0) * 2 + (b.verificado ? 10 : 0);
            return scoreB - scoreA;
          })
          .slice(0, 12); // Pegar apenas os 12 mais populares
        
        setProjects(sortedProjects);
      } catch (err) {
        setError('Erro ao carregar projetos em destaque');
        console.error('Error fetching featured projects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProjects();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🌟 Projetos em Destaque</h1>
          <p className="text-gray-400 text-lg">
            Descubra os projetos mais populares e inovadores da nossa comunidade
          </p>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🌟 Projetos em Destaque</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <TrendingUp className="h-10 w-10 text-[#10b981]" />
          Projetos em Destaque
        </h1>
        <p className="text-gray-400 text-lg">
          Descubra os projetos mais populares e inovadores criados por talentos empreendedores da nossa comunidade
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>Ordenados por popularidade (seguidores + favoritos + verificação)</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <Card key={project._id} className="bg-[#1a2942] border-gray-800 hover:border-[#10b981] transition-colors group relative">
            {/* Badge de posição para os top 3 */}
            {index < 3 && (
              <div className="absolute top-3 right-3 z-10">
                <Badge className={`
                  ${index === 0 ? 'bg-yellow-500 text-black' : ''}
                  ${index === 1 ? 'bg-gray-400 text-black' : ''}
                  ${index === 2 ? 'bg-amber-600 text-white' : ''}
                `}>
                  #{index + 1}
                </Badge>
              </div>
            )}
            
            <CardContent className="p-0">
              <div className="relative h-48 rounded-t-lg overflow-hidden">
                <Image
                  src={project.imagem_capa || project.avatar || "/placeholder.jpg"}
                  alt={project.nome}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-[#10b981] text-white">
                    {project.categoria || 'Geral'}
                  </Badge>
                </div>
                {project.verificado && (
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-blue-600 text-white flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Verificado
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={project.talento_lider_id?.avatar || project.criador_id?.avatar} alt={project.talento_lider_id?.name || project.criador_id?.name} />
                    <AvatarFallback className="bg-[#3b82f6] text-white text-xs">
                      {(project.talento_lider_id?.name || project.criador_id?.name || 'T')
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-[#10b981] font-medium">
                      {project.talento_lider_id?.name || project.criador_id?.name || 'Talento'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {project.criador_id?.account_type === 'mentor' ? 'Mentor' : 'Talento Empreendedor'}
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#10b981] transition-colors">
                  {project.nome}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.descricao || project.objetivo}
                </p>
                
                <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{project.seguidores || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{project.favoritos?.length || 0}</span>
                    </div>
                  </div>
                  <span>{new Date(project.criado_em).toLocaleDateString('pt-BR')}</span>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/projetos/${project._id}`} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-[#10b981] to-[#3b82f6] hover:from-[#059669] hover:to-[#2563eb] text-white">
                      Ver Projeto
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum projeto em destaque ainda</h3>
          <p className="text-gray-500">
            Os projetos mais inovadores da nossa comunidade aparecerão aqui em breve!
          </p>
          <Link href="/projetos">
            <Button className="mt-4 bg-[#10b981] hover:bg-[#059669] text-white">
              Explorar Todos os Projetos
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

