"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, Star } from "lucide-react";
import Link from "next/link";

interface Projeto {
  _id: string;
  nome: string;
  descricao: string;
  seguidores: number;
  categoria: string;
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
  status: string;
}

export default function FeaturedChannels() {
  const [projects, setProjects] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProjects() {
      try {
        const response = await fetch('/api/projetos');
        if (!response.ok) return;
        
        const allProjects = await response.json();
        
        // Pegar os 6 projetos mais populares para a sidebar
        const featuredProjects = allProjects
          .filter((project: Projeto) => project.status === 'ativo')
          .sort((a: Projeto, b: Projeto) => {
            const scoreA = (a.seguidores || 0) + (a.favoritos?.length || 0) * 2 + (a.verificado ? 10 : 0);
            const scoreB = (b.seguidores || 0) + (b.favoritos?.length || 0) * 2 + (b.verificado ? 10 : 0);
            return scoreB - scoreA;
          })
          .slice(0, 6);
        
        setProjects(featuredProjects);
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProjects();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2 animate-pulse">
            <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded mb-1"></div>
              <div className="h-3 bg-gray-800 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <Link
          key={project._id}
          href={`/projetos/${project._id}`}
          className="flex items-center gap-3 text-gray-300 hover:text-white py-2 group transition-colors"
        >
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={project.talento_lider_id?.avatar || project.criador_id?.avatar} 
                alt={project.talento_lider_id?.name || project.criador_id?.name} 
              />
              <AvatarFallback className="bg-[#10b981] text-white text-xs">
                {(project.talento_lider_id?.name || project.criador_id?.name || 'P')
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {index < 3 && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {index + 1}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium group-hover:text-[#10b981] transition-colors truncate">
                {project.nome}
              </span>
              {project.verificado && (
                <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{project.seguidores || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{project.favoritos?.length || 0}</span>
              </div>
              {project.categoria && (
                <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                  {project.categoria}
                </Badge>
              )}
            </div>
          </div>
        </Link>
      ))}
      
      {projects.length > 0 && (
        <Link 
          href="/featured-channels" 
          className="block text-center text-sm text-[#10b981] hover:text-[#059669] transition-colors mt-4 py-2"
        >
          Ver todos os projetos em destaque →
        </Link>
      )}
    </div>
  );
}