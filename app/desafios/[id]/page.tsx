"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useUserType } from "@/hooks/useUserType"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Users, Calendar, Star, ArrowLeft, Clock, Edit, Save, X, User, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
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
  requirements: string[];
  status: string;
  featured: boolean;
  start_date: string;
  end_date: string;
  popularityScore: number;
  daysRemaining: number;
  formattedPrizes: string;
  favoritesCount: number;
  projetos_vinculados?: Array<{
    projeto_id: string;
    status: 'pendente' | 'aprovado' | 'rejeitado';
    solicitado_em: string;
    aprovado_em?: string;
  }>;
  created_by: {
    _id: string;
    name: string;
    avatar?: string;
    account_type?: string;
  };
}

export default function DesafioDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { userType } = useUserType()
  const [desafio, setDesafio] = useState<Desafio | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    difficulty: '',
    duration: '',
    status: ''
  })

  const handleParticipate = () => {
    if (!session) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para participar do desafio.",
        variant: "destructive"
      })
      return
    }

    // Show options to either create new project or join existing one
    const userChoice = confirm(
      "Como você gostaria de participar?\n\n" +
      "OK = Criar um novo projeto\n" +
      "Cancelar = Ver projetos existentes para participar"
    )

    if (userChoice) {
      // Create new project
      router.push(`/projetos/create?desafio=${params.id}&title=${encodeURIComponent(desafio?.title || '')}`)
    } else {
      // Browse existing projects for this challenge
      router.push(`/projetos?desafio=${params.id}`)
    }
  }

  useEffect(() => {
    async function fetchDesafio() {
      try {
        const response = await fetch(`/api/desafios/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setDesafio(data)
          setEditForm({
            title: data.title,
            description: data.description,
            difficulty: data.difficulty,
            duration: data.duration,
            status: data.status
          })
        } else {
          router.push('/desafios')
        }
      } catch (error) {
        console.error("Error fetching desafio:", error)
        router.push('/desafios')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchDesafio()
    }
  }, [params.id, router])

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/desafios/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        const updatedDesafio = await response.json()
        setDesafio(updatedDesafio)
        setIsEditing(false)
        toast({
          title: "Desafio atualizado!",
          description: "As informações do desafio foram salvas com sucesso."
        })
      } else {
        throw new Error('Erro ao salvar')
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      })
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Iniciante": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Intermediário": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Avançado": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "border-green-500 text-green-500"
      case "Em Breve": return "border-blue-500 text-blue-500"
      case "Finalizado": return "border-gray-500 text-gray-500"
      default: return "border-gray-500 text-gray-500"
    }
  }

  const formatDaysRemaining = (days: number) => {
    if (days === 0) return "Último dia!"
    if (days === 1) return "1 dia restante"
    if (days <= 7) return `${days} dias restantes`
    if (days <= 30) return `${Math.ceil(days / 7)} semanas restantes`
    return `${Math.ceil(days / 30)} meses restantes`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const isOwner = session?.user?.id && desafio?.created_by._id && 
                  session.user.id.toString() === desafio.created_by._id.toString()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a192f] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-700 rounded mb-6"></div>
            <div className="h-32 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!desafio) {
    return (
      <div className="min-h-screen bg-[#0a192f] text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Desafio não encontrado</h1>
          <Link href="/desafios">
            <Button variant="outline">Voltar aos Desafios</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a192f] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/desafios" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar aos Desafios
          </Link>
          
          <div className="flex items-center gap-3">
            <DesafioFavoriteButton desafioId={desafio._id} showCount={true} />
            {isOwner && (
              <>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" className="bg-[#10b981] hover:bg-[#10b981]/90">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#1a2942] border-gray-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        className="text-xl font-bold bg-transparent border-gray-600 text-white mb-4"
                      />
                    ) : (
                      <CardTitle className="text-2xl text-white mb-2">{desafio.title}</CardTitle>
                    )}
                    
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="secondary" className={getDifficultyColor(desafio.difficulty)}>
                        {desafio.difficulty}
                      </Badge>
                      {desafio.featured && (
                        <Badge className="bg-yellow-500 text-yellow-900 border-yellow-600">
                          ⭐ Destaque
                        </Badge>
                      )}
                      <Badge variant="outline" className={getStatusColor(desafio.status)}>
                        {desafio.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {desafio.category.thumbnail ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={desafio.category.thumbnail}
                          alt={desafio.category.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-[#10b981] flex items-center justify-center">
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="bg-transparent border-gray-600 text-gray-300"
                    rows={4}
                  />
                ) : (
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {desafio.description}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-[#1a2942] border-gray-800">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-[#10b981] mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">{desafio.approvedProjects || 0}</div>
                  <div className="text-xs text-gray-400">Projetos Aprovados</div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1a2942] border-gray-800">
                <CardContent className="p-4 text-center">
                  <Calendar className="h-6 w-6 text-[#3b82f6] mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">{desafio.duration}</div>
                  <div className="text-xs text-gray-400">Duração</div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1a2942] border-gray-800">
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-sm font-bold text-white">{formatDaysRemaining(desafio.daysRemaining)}</div>
                  <div className="text-xs text-gray-400">Restante</div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1a2942] border-gray-800">
                <CardContent className="p-4 text-center">
                  <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-sm font-bold text-white">{desafio.formattedPrizes}</div>
                  <div className="text-xs text-gray-400">Prêmios</div>
                </CardContent>
              </Card>
            </div>

            {/* Requirements */}
            {desafio.requirements && desafio.requirements.length > 0 && (
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Requisitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {desafio.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-[#10b981] rounded-full mt-2 flex-shrink-0"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Prizes */}
            {desafio.prizes && desafio.prizes.length > 0 && (
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Premiação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {desafio.prizes.map((prize, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[#0a192f] rounded-lg">
                        <div>
                          <div className="font-semibold text-white">{prize.position}</div>
                          <div className="text-sm text-gray-400">{prize.description}</div>
                        </div>
                        <div className="text-[#10b981] font-bold">{prize.value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Creator Info */}
            <Card className="bg-[#1a2942] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Criado por</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/profile/${desafio.created_by._id}`} className="block">
                  <div className="flex items-center gap-3 hover:bg-[#0a192f] p-2 rounded-lg transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-[#10b981] flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white hover:text-[#10b981] transition-colors">{desafio.created_by.name}</div>
                      <div className="text-sm text-gray-400 capitalize">{desafio.created_by.account_type}</div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Category Info */}
            <Card className="bg-[#1a2942] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-white font-medium">{desafio.category.name}</div>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card className="bg-[#1a2942] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Cronograma</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-gray-400">Início</div>
                  <div className="text-white">{formatDate(desafio.start_date)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Fim</div>
                  <div className="text-white">{formatDate(desafio.end_date)}</div>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            {!isOwner && desafio.status === 'Ativo' && (
              <Button 
                onClick={handleParticipate}
                className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white"
              >
                Participar do Desafio
              </Button>
            )}

            {/* Linked Projects */}
            {desafio.projetos_vinculados && desafio.projetos_vinculados.length > 0 && (
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center justify-between">
                    Projetos Participando
                    <span className="text-xs text-gray-400">
                      {desafio.projetos_vinculados.filter((p: any) => p.status === 'aprovado').length} aprovados
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {desafio.projetos_vinculados
                      .filter((p: any) => p.status === 'aprovado')
                      .slice(0, 5)
                      .map((projeto: any, index: number) => (
                        <div key={index} className="p-2 bg-[#0a192f] rounded text-sm">
                          <div className="text-white font-medium">Projeto #{index + 1}</div>
                          <div className="text-xs text-gray-400">
                            Aprovado em {new Date(projeto.aprovado_em || projeto.solicitado_em).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      ))}
                    {desafio.projetos_vinculados.filter((p: any) => p.status === 'aprovado').length > 5 && (
                      <div className="text-xs text-gray-400 text-center pt-2">
                        +{desafio.projetos_vinculados.filter((p: any) => p.status === 'aprovado').length - 5} mais projetos
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
