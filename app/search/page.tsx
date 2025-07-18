"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  SearchIcon, 
  Video, 
  Users, 
  Target, 
  FolderKanban, 
  Play, 
  Heart, 
  Eye, 
  Star,
  Clock,
  User,
  Code2,
  Award,
  Building,
  Layers,
  Hash,
  Sparkles,
  Loader2,
  Filter,
  FileText,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchResult {
  id: string;
  type: 'video' | 'channel' | 'user' | 'projeto' | 'desafio' | 'category' | 'skill' | 'page';
  title: string;
  description?: string;
  avatar?: string;
  metadata?: any;
  score: number;
  category?: string;
  tags?: string[];
}

interface SearchResponse {
  results: SearchResult[];
  groupedResults: { [key: string]: SearchResult[] };
  suggestions: string[];
  totalCount: number;
  query: string;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'video': return <Video className="w-4 h-4" />;
    case 'projeto': return <FolderKanban className="w-4 h-4" />;
    case 'desafio': return <Target className="w-4 h-4" />;
    case 'user': return <User className="w-4 h-4" />;
    case 'channel': return <Play className="w-4 h-4" />;
    case 'category': return <Layers className="w-4 h-4" />;
    case 'skill': return <Code2 className="w-4 h-4" />;
    case 'page': return <FileText className="w-4 h-4" />;
    default: return <SearchIcon className="w-4 h-4" />;
  }
};

const getTypeName = (type: string) => {
  switch (type) {
    case 'video': return 'Vídeos';
    case 'projeto': return 'Projetos';
    case 'desafio': return 'Desafios';
    case 'user': return 'Pessoas';
    case 'channel': return 'Canais';
    case 'category': return 'Habilidades';
    case 'skill': return 'Habilidades';
    case 'page': return 'Páginas';
    default: return type;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'video': return 'bg-red-900/20 text-red-300 border-red-800';
    case 'projeto': return 'bg-blue-900/20 text-blue-300 border-blue-800';
    case 'desafio': return 'bg-purple-900/20 text-purple-300 border-purple-800';
    case 'user': return 'bg-green-900/20 text-green-300 border-green-800';
    case 'channel': return 'bg-orange-900/20 text-orange-300 border-orange-800';
    case 'category': return 'bg-indigo-900/20 text-indigo-300 border-indigo-800';
    case 'skill': return 'bg-yellow-900/20 text-yellow-300 border-yellow-800';
    case 'page': return 'bg-cyan-900/20 text-cyan-300 border-cyan-800';
    default: return 'bg-gray-900/20 text-gray-300 border-gray-600';
  }
};

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const hasInitialized = useRef(false)
  const lastSearchQuery = useRef("")

  // Debounce search query for better performance
  const debouncedQuery = useDebounce(query, 300)

  // Initialize query from URL parameters on mount
  useEffect(() => {
    const urlQuery = searchParams.get('q')
    if (urlQuery && !hasInitialized.current) {
      setQuery(urlQuery)
      hasInitialized.current = true
    }
  }, [searchParams])

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('giga-recent-searches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  // Trigger search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setSearchResults(null)
      lastSearchQuery.current = ""
      return
    }

    const searchQuery = debouncedQuery.trim()
    
    // Prevent duplicate searches using ref
    if (lastSearchQuery.current === searchQuery) {
      return
    }
    
    let isCancelled = false
    lastSearchQuery.current = searchQuery
    setIsLoading(true)

    const performSearchAction = async () => {
      try {
        const params = new URLSearchParams({
          q: searchQuery,
          type: 'all', // Always search all types
          limit: '50'
        })

        const response = await fetch(`/api/search?${params}`)
        const data: SearchResponse = await response.json()

        if (!isCancelled) {
          setSearchResults(data)
          
          // Save to recent searches
          setRecentSearches(prevSearches => {
            const updated = [searchQuery, ...prevSearches.filter(s => s !== searchQuery)].slice(0, 8)
            localStorage.setItem('giga-recent-searches', JSON.stringify(updated))
            return updated
          })
        }
      } catch (error) {
        console.error("Search error:", error)
        if (!isCancelled) {
          setSearchResults(null)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    performSearchAction()

    // Cleanup function
    return () => {
      isCancelled = true
    }
  }, [debouncedQuery])

  // Filter results based on active tab
  const filteredResults = useMemo(() => {
    if (!searchResults) return []
    
    if (activeTab === 'all') {
      return searchResults.results || []
    }
    
    return searchResults.groupedResults?.[activeTab] || []
  }, [searchResults, activeTab])

  // Get result counts by type
  const resultCounts = useMemo(() => {
    if (!searchResults) return {}
    
    const counts: { [key: string]: number } = { all: searchResults.totalCount || 0 }
    
    // Safely handle groupedResults which might be undefined
    if (searchResults.groupedResults) {
      Object.entries(searchResults.groupedResults).forEach(([type, results]) => {
        counts[type] = results?.length || 0
      })
    }
    
    return counts
  }, [searchResults])

  const renderResultCard = (result: SearchResult) => {
    const getResultLink = () => {
      switch (result.type) {
        case 'video':
          return `/videos/${result.id}`;
        case 'projeto':
          return `/projetos/${result.id}`;
        case 'desafio':
          return `/desafios/${result.id}`;
        case 'user':
          return `/profile/${result.id}`;
        case 'channel':
          return `/channel/${result.id}`;
        case 'category':
          return `/categories?category=${encodeURIComponent(result.title)}`;
        case 'skill':
          return `/search?q=${encodeURIComponent(result.title)}&type=users`;
        case 'page':
          return result.metadata?.url || '/';
        default:
          return '#';
      }
    };

    return (
      <Link key={result.id} href={getResultLink()}>
        <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-emerald-500 group bg-[#1a2942] border-gray-600">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Avatar/Icon */}
              <div className="flex-shrink-0">
                {result.avatar ? (
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={result.avatar} alt={result.title} />
                    <AvatarFallback className="bg-[#0a192f] text-gray-300">{result.title.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#0a192f] border border-gray-600 flex items-center justify-center">
                    {getTypeIcon(result.type)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {result.title}
                    </h3>
                    
                    {result.description && (
                      <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                        {result.description}
                      </p>
                    )}

                    {/* Metadata row */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <Badge variant="outline" className={`${getTypeColor(result.type)} text-xs border-gray-600`}>
                        {getTypeIcon(result.type)}
                        <span className="ml-1">{getTypeName(result.type)}</span>
                      </Badge>

                      {/* Type-specific metadata */}
                      {result.type === 'video' && result.metadata && (
                        <>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {result.metadata.views?.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {result.metadata.duration}
                          </span>
                        </>
                      )}

                      {result.type === 'projeto' && result.metadata && (
                        <>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {result.metadata.participants} participantes
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {result.metadata.likes}
                          </span>
                          {result.metadata.verified && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              Verificado
                            </Badge>
                          )}
                        </>
                      )}

                      {result.type === 'desafio' && result.metadata && (
                        <>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {result.metadata.favorites} favoritos
                          </span>
                          <Badge className={`text-xs ${
                            result.metadata.difficulty === 'Avançado' ? 'bg-red-100 text-red-800' :
                            result.metadata.difficulty === 'Intermediário' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {result.metadata.difficulty}
                          </Badge>
                          {result.metadata.prizes?.[0] && (
                            <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              {result.metadata.prizes[0].value}
                            </Badge>
                          )}
                        </>
                      )}

                      {result.type === 'user' && result.metadata && (
                        <>
                          <Badge className={`text-xs ${
                            result.metadata.account_type === 'mentor' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {result.metadata.account_type === 'mentor' ? 'Mentor' : 'Talento'}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {result.metadata.followers} seguidores
                          </span>
                        </>
                      )}

                      {result.type === 'skill' && result.metadata && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {result.metadata.user_count} pessoa{result.metadata.user_count === 1 ? '' : 's'}
                        </span>
                      )}

                      {result.type === 'page' && result.metadata && (
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {result.metadata.category}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {result.tags && result.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {result.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Hash className="w-2 h-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {result.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{result.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Score indicator (for debugging - can be removed in production) */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="text-xs text-gray-400 font-mono">
                      {Math.round(result.score)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a192f]">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Buscar</h1>
          <p className="text-gray-400">
            Descubra vídeos, projetos, desafios, talentos e muito mais
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            ) : (
              <SearchIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <Input
            type="text"
            placeholder="Buscar por vídeos, canais ou criadores..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 py-3 text-lg bg-[#1a2942] border-gray-600 text-white placeholder:text-gray-400 focus:border-[#10b981] focus:ring-[#10b981]"
            autoFocus
          />
          
          {/* Clear button */}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <span className="text-gray-400 hover:text-gray-300 text-sm">✕</span>
            </button>
          )}
        </div>

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <Card className="mb-6 bg-[#1a2942] border-gray-600">
            <CardHeader className="pb-3">
              <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Buscas Recentes
              </h3>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(search)}
                    className="text-xs bg-[#0a192f] border-gray-600 text-gray-300 hover:bg-[#10b981] hover:text-white hover:border-[#10b981]"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Suggestions */}
        {searchResults?.suggestions && searchResults.suggestions.length > 0 && (
          <Card className="mb-6 bg-[#1a2942] border-gray-600">
            <CardHeader className="pb-3">
              <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Sugestões
              </h3>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {searchResults.suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(suggestion)}
                    className="text-xs bg-[#0a192f] border-gray-600 text-gray-300 hover:bg-[#10b981] hover:text-white hover:border-[#10b981]"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Tabs */}
        {searchResults && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-8 mb-6 bg-[#1a2942] border border-gray-600">
              <TabsTrigger value="all" className="text-xs data-[state=active]:bg-[#10b981] data-[state=active]:text-white text-gray-300">
                Todos {resultCounts.all ? `(${resultCounts.all})` : ''}
              </TabsTrigger>
              <TabsTrigger value="video" className="text-xs data-[state=active]:bg-[#10b981] data-[state=active]:text-white text-gray-300">
                <Video className="w-3 h-3 mr-1" />
                Vídeos {resultCounts.video ? `(${resultCounts.video})` : ''}
              </TabsTrigger>
              <TabsTrigger value="projeto" className="text-xs data-[state=active]:bg-[#10b981] data-[state=active]:text-white text-gray-300">
                <FolderKanban className="w-3 h-3 mr-1" />
                Projetos {resultCounts.projeto ? `(${resultCounts.projeto})` : ''}
              </TabsTrigger>
              <TabsTrigger value="desafio" className="text-xs data-[state=active]:bg-[#10b981] data-[state=active]:text-white text-gray-300">
                <Target className="w-3 h-3 mr-1" />
                Desafios {resultCounts.desafio ? `(${resultCounts.desafio})` : ''}
              </TabsTrigger>
              <TabsTrigger value="user" className="text-xs data-[state=active]:bg-[#10b981] data-[state=active]:text-white text-gray-300">
                <Users className="w-3 h-3 mr-1" />
                Pessoas {resultCounts.user ? `(${resultCounts.user})` : ''}
              </TabsTrigger>
              <TabsTrigger value="channel" className="text-xs data-[state=active]:bg-[#10b981] data-[state=active]:text-white text-gray-300">
                <Play className="w-3 h-3 mr-1" />
                Canais {resultCounts.channel ? `(${resultCounts.channel})` : ''}
              </TabsTrigger>
              <TabsTrigger value="category" className="text-xs data-[state=active]:bg-[#10b981] data-[state=active]:text-white text-gray-300">
                <Layers className="w-3 h-3 mr-1" />
                Habilidades {resultCounts.category ? `(${resultCounts.category})` : ''}
              </TabsTrigger>
              <TabsTrigger value="page" className="text-xs data-[state=active]:bg-[#10b981] data-[state=active]:text-white text-gray-300">
                <FileText className="w-3 h-3 mr-1" />
                Páginas {resultCounts.page ? `(${resultCounts.page})` : ''}
              </TabsTrigger>
            </TabsList>

            {/* Results */}
            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                  <span className="ml-2 text-gray-600">Buscando...</span>
                </div>
              ) : filteredResults.length > 0 ? (
                <div className="space-y-3">
                  {filteredResults.map(renderResultCard)}
                  
                  {filteredResults.length >= 50 && (
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-gray-600">
                          Mostrando primeiros 50 resultados. Refine sua busca para encontrar conteúdo mais específico.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : query.trim().length >= 2 ? (
                <Card className="bg-[#1a2942] border-gray-600">
                  <CardContent className="p-8 text-center">
                    <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Nenhum resultado encontrado
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Não encontramos resultados para "{query}" em {getTypeName(activeTab)}.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={() => setActiveTab('all')} className="border-gray-600 text-gray-300 hover:bg-[#10b981] hover:text-white hover:border-[#10b981]">
                        Buscar em tudo
                      </Button>
                      <Button variant="outline" onClick={() => setQuery('')} className="border-gray-600 text-gray-300 hover:bg-[#10b981] hover:text-white hover:border-[#10b981]">
                        Limpar busca
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </TabsContent>
          </Tabs>
        )}

        {/* Search Tips */}
        {!query && (
          <Card className="mt-8 bg-[#1a2942] border-gray-600">
            <CardHeader>
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Dicas de Busca
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">Busque por:</h4>
                  <ul className="space-y-1">
                    <li>• Nomes de projetos ou desafios</li>
                    <li>• Tecnologias (React, Python, etc.)</li>
                    <li>• Nomes de talentos ou mentores</li>
                    <li>• Categorias de habilidades</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Exemplos:</h4>
                  <ul className="space-y-1">
                    <li>• "FinTech Revolution"</li>
                    <li>• "Next.js"</li>
                    <li>• "Roberto Silva"</li>
                    <li>• "Liderança"</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

