"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { Medal, MapPin, Star, Users, ExternalLink, Briefcase } from "lucide-react"

// Type definitions for talents (users)
interface Talent {
  _id: string;
  name: string;
  bio: string;
  location?: string;
  skills: string[];
  experience?: string;
  portfolio?: string;
  categories: string[];
  avatar: string;
  verified: boolean;
  projects_count: number;
  created_at: string;
}

// Format date to be more readable
function formatDate(dateString: string | number | Date) {
  const options = { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
}

export default function TalentsPage() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("Todos");

  const categoryFilters = [
    "Todos",
    "Habilidade Cognitiva & Técnica",
    "Criatividade & Inovação", 
    "Liderança & Colaboração",
    "Comunicação & Persuasão",
    "Consciência Social & Ética",
    "Resiliência & Adaptabilidade"
  ];

  const filteredTalents = filter === "Todos" 
    ? talents 
    : talents.filter(talent => talent.categories?.includes(filter));

  useEffect(() => {
    let isMounted = true;

    async function fetchTalents() {
      try {
        const response = await fetch('/api/users?type=talent');
        if (!response.ok) {
          throw new Error('Failed to fetch talents');
        }
        const data = await response.json();
        
        if (isMounted) {
          setTalents(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Erro ao carregar talentos');
          setLoading(false);
        }
      }
    }

    fetchTalents();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Talentos da Comunidade</h1>
          <p className="text-gray-400 text-lg">Carregando perfis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-white mb-4">Talentos da Comunidade</h1>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Talentos da Comunidade</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Conheça os empreendedores talentosos da nossa plataforma. Cada perfil representa uma jornada única de inovação e transformação.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categoryFilters.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            size="sm"
            className={filter === category 
              ? "bg-[#10b981] hover:bg-[#10b981]/90" 
              : "border-gray-600 text-gray-300 hover:bg-gray-700"
            }
            onClick={() => setFilter(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {filteredTalents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map((talent) => (
            <Card key={talent._id} className="bg-[#1a2942] border-gray-800 hover:border-[#10b981] transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={talent.avatar} alt={talent.name} />
                      <AvatarFallback className="bg-[#3b82f6] text-white">
                        {talent.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        {talent.name}
                        {talent.verified && (
                          <Star className="h-4 w-4 text-[#10b981]" fill="currentColor" />
                        )}
                      </CardTitle>
                      {talent.location && (
                        <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{talent.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm line-clamp-3">
                  {talent.bio}
                </p>

                {/* Categories */}
                <div className="flex flex-wrap gap-1">
                  {talent.categories?.slice(0, 2).map((category, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
                      {category.replace(/^.+& /, '')} {/* Show short version */}
                    </Badge>
                  ))}
                  {talent.categories?.length > 2 && (
                    <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                      +{talent.categories.length - 2}
                    </Badge>
                  )}
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {talent.skills?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="text-xs bg-[#3b82f6]/20 text-[#3b82f6] px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                  {talent.skills?.length > 3 && (
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      +{talent.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400 pt-2 border-t border-gray-700">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{talent.projects_count} projetos</span>
                  </div>
                  <span>Desde {formatDate(talent.created_at)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/talents/${talent._id}`} className="flex-1">
                    <Button className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white">
                      Ver Perfil
                    </Button>
                  </Link>
                  {talent.portfolio && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white"
                      onClick={() => window.open(talent.portfolio, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#1a2942] rounded-lg border border-gray-800">
          <Users className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-medium text-white mb-2">
            {filter === "Todos" ? "Nenhum talento encontrado" : `Nenhum talento encontrado para "${filter}"`}
          </h3>
          <p className="text-gray-400 mb-6">
            Os talentos mais promissores aparecerão aqui em breve!
          </p>
          <Link href="/auth/register">
            <Button className="bg-[#10b981] hover:bg-[#10b981]/80 text-white">
              Seja o Primeiro Talento
            </Button>
          </Link>
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center py-12 bg-gradient-to-r from-[#1a2942] to-[#0a192f] rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-4">Faça Parte da Comunidade</h2>
        <p className="text-gray-300 mb-6">
          Conecte-se com outros talentos empreendedores e acelere sua jornada de crescimento
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register">
            <Button className="bg-[#10b981] hover:bg-[#10b981]/90 text-white">
              Criar Conta de Talento
            </Button>
          </Link>
          <Link href="/upload">
            <Button variant="outline" className="border-[#3b82f6] text-[#3b82f6]">
              Compartilhar Projeto
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}