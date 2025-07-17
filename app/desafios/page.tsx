"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useUserType } from "@/hooks/useUserType"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Users, Calendar, Star, ArrowRight, Clock, Filter, Trash2, Heart, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"
import DesafioFavoriteButton from "@/components/desafio-favorite-button"

interface Prize {
  position: string;
  description: string;
  value: string;
}

interface Desafio {
  _id: string;
  title: string;
  description: string;
  category: {
    _id: string;
    name: string;
    thumbnail?: string;
  };
  difficulty: string;
  duration: string;
  approvedProjects: number; // Number of approved projects
  prizes: Prize[];
  status: string;
  featured: boolean;
  start_date: string;
  end_date: string;
  popularityScore: number;
  daysRemaining: number;
  formattedPrizes: string;
  favoritesCount: number;
  created_by: {
    _id: string;
    name: string;
    avatar?: string;
    account_type?: string;
  };
}

interface FilterOptions {
  categories: Array<{ _id: string; name: string; count: number }>;
  difficulties: Array<{ value: string; count: number }>;
  statuses: Array<{ value: string; count: number }>;
  sortOptions: Array<{ value: string; label: string }>;
}

export default function DesafiosPage() {
  const { data: session } = useSession();
  const { userType, isLoading: userTypeLoading } = useUserType();
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'Todos',
    difficulty: 'Todos',
    status: 'Todos',
    sortBy: 'popularity'
  });

  // Fetch filter options
  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const response = await fetch('/api/desafios/filters');
        if (response.ok) {
          const data = await response.json();
          setFilterOptions(data);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    }
    fetchFilterOptions();
  }, []);

  // Fetch desafios based on filters
  useEffect(() => {
    async function fetchDesafios() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.category !== 'Todos') params.append('category', filters.category);
        if (filters.difficulty !== 'Todos') params.append('difficulty', filters.difficulty);
        if (filters.status !== 'Todos') params.append('status', filters.status);
        params.append('sortBy', filters.sortBy);

        const response = await fetch(`/api/desafios?${params}`);
        if (response.ok) {
          const data = await response.json();
          setDesafios(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching desafios:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDesafios();
  }, [filters]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Iniciante": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Intermediário": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Avançado": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "border-green-500 text-green-500"
      case "Em Breve": return "border-blue-500 text-blue-500"
      case "Finalizado": return "border-gray-500 text-gray-500"
      default: return "border-gray-500 text-gray-500"
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      "bg-blue-500", "bg-purple-500", "bg-red-500", 
      "bg-green-500", "bg-teal-500", "bg-orange-500"
    ];
    return colors[index % colors.length];
  };

  const formatDaysRemaining = (days: number) => {
    if (days === 0) return "Último dia!";
    if (days === 1) return "1 dia restante";
    if (days <= 7) return `${days} dias restantes`;
    if (days <= 30) return `${Math.ceil(days / 7)} semanas restantes`;
    return `${Math.ceil(days / 30)} meses restantes`;
  };

  const handleDeleteDesafio = async (desafioId: string) => {
    if (!confirm("Tem certeza que deseja deletar este desafio? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const response = await fetch(`/api/desafios/${desafioId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDesafios(prev => prev.filter(d => d._id !== desafioId));
        toast({
          title: "Sucesso",
          description: "Desafio deletado com sucesso!",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Erro",
          description: error.error || "Falha ao deletar desafio",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting desafio:', error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Desafios de Empreendedorismo</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Participe de desafios exclusivos que testam suas habilidades empreendedoras nas 6 dimensões-chave do talento.
        </p>
      </div>

      {/* Filters */}
      {filterOptions && (
        <div className="bg-[#1a2942] border border-gray-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 text-white mb-4">
            <Filter className="h-5 w-5" />
            <span className="font-semibold">Filtros</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Categoria</label>
              <Select 
                value={filters.category} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-[#0a192f] border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2942] border-gray-700">
                  <SelectItem value="Todos" className="text-white">Todas as Categorias</SelectItem>
                  {filterOptions.categories.map((category) => (
                    <SelectItem key={category._id} value={category._id} className="text-white">
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Dificuldade</label>
              <Select 
                value={filters.difficulty} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger className="bg-[#0a192f] border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2942] border-gray-700">
                  <SelectItem value="Todos" className="text-white">Todas as Dificuldades</SelectItem>
                  {filterOptions.difficulties.map((difficulty) => (
                    <SelectItem key={difficulty.value} value={difficulty.value} className="text-white">
                      {difficulty.value} ({difficulty.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Status</label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="bg-[#0a192f] border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2942] border-gray-700">
                  <SelectItem value="Todos" className="text-white">Todos os Status</SelectItem>
                  {filterOptions.statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value} className="text-white">
                      {status.value} ({status.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Ordenar por</label>
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
              >
                <SelectTrigger className="bg-[#0a192f] border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2942] border-gray-700">
                  {filterOptions.sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="bg-[#1a2942] border-gray-800 animate-pulse">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-gray-700 mb-4" />
                  <div className="w-20 h-6 rounded bg-gray-700" />
                </div>
                <div className="h-6 bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-700 rounded mb-1" />
                <div className="h-4 bg-gray-700 rounded w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-700 rounded w-24" />
                  <div className="h-4 bg-gray-700 rounded w-16" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-700 rounded w-20" />
                  <div className="h-6 bg-gray-700 rounded w-16" />
                </div>
                <div className="h-10 bg-gray-700 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Results */}
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              {desafios.length} desafio{desafios.length !== 1 ? 's' : ''} encontrado{desafios.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {desafios.map((desafio, index) => (
              <Link key={desafio._id} href={`/desafios/${desafio._id}`}>
                <Card className="bg-[#1a2942] border-gray-800 hover:border-[#10b981] transition-all duration-300 group h-full flex flex-col cursor-pointer overflow-hidden">
                  {/* Header with category thumbnail and actions */}
                  <div className="relative h-32 bg-gradient-to-br from-[#0a192f] to-[#1a2942]">
                    {desafio.category.thumbnail ? (
                      <div className="absolute inset-0">
                        <Image
                          src={desafio.category.thumbnail}
                          alt={desafio.category.name}
                          fill
                          className="object-cover opacity-30"
                        />
                      </div>
                    ) : (
                      <div className={`absolute inset-0 ${getCategoryColor(index)} opacity-20`} />
                    )}
                    
                    {/* Top badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {desafio.featured && (
                        <Badge className="bg-yellow-500/90 text-yellow-900 border-yellow-600 backdrop-blur-sm">
                          ⭐ Destaque
                        </Badge>
                      )}
                      <Badge variant="secondary" className={`${getDifficultyColor(desafio.difficulty)} backdrop-blur-sm`}>
                        {desafio.difficulty}
                      </Badge>
                    </div>

                    {/* Top right actions */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <div onClick={(e) => e.preventDefault()}>
                        <DesafioFavoriteButton desafioId={desafio._id} showCount={true} variant="outline" />
                      </div>
                      {session?.user?.id === desafio.created_by?._id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteDesafio(desafio._id);
                          }}
                          className="h-8 w-8 p-0 backdrop-blur-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Category icon */}
                    <div className="absolute bottom-3 left-3">
                      <div className={`w-10 h-10 rounded-lg ${getCategoryColor(index)} flex items-center justify-center shadow-lg`}>
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg leading-tight group-hover:text-[#10b981] transition-colors line-clamp-2">
                      {desafio.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {desafio.description}
                    </CardDescription>
                    
                    {/* Creator info */}
                    {desafio.created_by && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
                        <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs text-gray-400">
                          Criado por <span className="text-[#10b981] font-medium">{desafio.created_by.name}</span>
                        </span>
                      </div>
                    )}
                  </CardHeader>                  <CardContent className="space-y-4 pt-0 flex-grow flex flex-col px-6 pb-6">
                    <div className="space-y-3 flex-grow">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Users className="h-4 w-4" />
                          <span>{desafio.approvedProjects || 0} projetos aprovados</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>{desafio.duration}</span>
                        </div>
                      </div>

                      {desafio.daysRemaining > 0 && (
                        <div className="flex items-center gap-1 text-sm text-orange-400">
                          <Clock className="h-4 w-4" />
                          <span>{formatDaysRemaining(desafio.daysRemaining)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[#10b981]">
                          <Star className="h-4 w-4" />
                          <span className="font-semibold text-sm">{desafio.formattedPrizes}</span>
                        </div>
                        <Badge variant="outline" className={getStatusColor(desafio.status)}>
                          {desafio.status}
                        </Badge>
                      </div>

                      <div className="text-xs text-gray-500">
                        Categoria: {desafio.category.name}
                      </div>
                    </div>

                    <Button className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white group-hover:shadow-lg transition-all mt-auto">
                      Participar do Desafio
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {desafios.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum desafio encontrado</h3>
              <p className="text-gray-400 mb-6">
                Tente ajustar os filtros para encontrar desafios que correspondam aos seus interesses.
              </p>
              <Button 
                onClick={() => setFilters({ category: 'Todos', difficulty: 'Todos', status: 'Todos', sortBy: 'popularity' })}
                variant="outline"
                className="border-[#10b981] text-[#10b981] hover:bg-[#10b981] hover:text-white"
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </>
      )}

      {/* Call to Action */}
      {(userType === 'mentor' || userType === 'admin') && (
        <div className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-bold text-white">Pronto para o Próximo Nível?</h2>
          <p className="text-gray-400">
            Crie seu próprio desafio e convide outros empreendedores para participar
          </p>
          <Link href="/desafios/criar">
            <Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white">
              Criar Novo Desafio
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
