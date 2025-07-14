"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Users, Calendar, Star, ArrowRight, Clock, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
  participants: number;
  prizes: Prize[];
  status: string;
  featured: boolean;
  start_date: string;
  end_date: string;
  popularityScore: number;
  daysRemaining: number;
  formattedPrizes: string;
}

interface FilterOptions {
  categories: Array<{ _id: string; name: string; count: number }>;
  difficulties: Array<{ value: string; count: number }>;
  statuses: Array<{ value: string; count: number }>;
  sortOptions: Array<{ value: string; label: string }>;
}

export default function DesafiosPage() {
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
              <Card key={desafio._id} className="bg-[#1a2942] border-gray-800 hover:border-[#10b981] transition-all duration-300 group h-full flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {desafio.category.thumbnail ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={desafio.category.thumbnail}
                            alt={desafio.category.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`w-12 h-12 rounded-lg ${getCategoryColor(index)} flex items-center justify-center`}>
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                      )}
                      {desafio.featured && (
                        <Badge className="bg-yellow-500 text-yellow-900 border-yellow-600">
                          ⭐ Destaque
                        </Badge>
                      )}
                    </div>
                    <Badge variant="secondary" className={getDifficultyColor(desafio.difficulty)}>
                      {desafio.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg leading-tight group-hover:text-[#10b981] transition-colors">
                    {desafio.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-sm leading-relaxed">
                    {desafio.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 pt-0 flex-grow flex flex-col">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{desafio.participants} participantes</span>
                      </div>
                      <div className="flex items-center gap-1">
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

                  <Link href={`/desafios/${desafio._id}`} className="mt-auto">
                    <Button className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white group-hover:shadow-lg transition-all">
                      Participar do Desafio
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
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
    </div>
  )
}
