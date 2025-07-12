"use client"

import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, Calendar, Star, ArrowRight, Target, Award, Clock } from "lucide-react"
import Link from "next/link"

export default function ChallengeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [isParticipating, setIsParticipating] = useState(false)

  // Mock challenge data based on ID
  const challenges = {
    "1": {
      title: "Desafio de Habilidade Cognitiva & Técnica",
      description: "Demonstre suas habilidades de resolução de problemas e competência técnica através de projetos inovadores. Este desafio foca em avaliar sua capacidade analítica, pensamento crítico e implementação de soluções técnicas.",
      category: "Habilidade Cognitiva & Técnica",
      participants: 245,
      duration: "30 dias",
      difficulty: "Intermediário",
      prize: "R$ 5.000",
      status: "Ativo",
      color: "bg-blue-500",
      icon: Target,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      requirements: [
        "Conhecimento em programação",
        "Experiência com resolução de problemas",
        "Capacidade analítica",
        "Pensamento crítico"
      ],
      objectives: [
        "Desenvolver uma solução técnica inovadora",
        "Demonstrar capacidade de análise de problemas",
        "Apresentar documentação técnica clara",
        "Implementar testes e validação"
      ]
    },
    "2": {
      title: "Desafio de Criatividade & Inovação",
      description: "Crie soluções criativas e inovadoras para problemas do mundo real. Este desafio avalia sua capacidade de pensar fora da caixa e desenvolver ideias disruptivas.",
      category: "Criatividade & Inovação",
      participants: 189,
      duration: "45 dias",
      difficulty: "Avançado",
      prize: "R$ 8.000",
      status: "Ativo",
      color: "bg-purple-500",
      icon: Star,
      startDate: "2024-01-10",
      endDate: "2024-02-25",
      requirements: [
        "Pensamento criativo",
        "Capacidade de inovação",
        "Visão empreendedora",
        "Habilidades de design thinking"
      ],
      objectives: [
        "Desenvolver uma ideia inovadora",
        "Criar protótipo funcional",
        "Demonstrar potencial de mercado",
        "Apresentar plano de implementação"
      ]
    }
  }

  const challenge = challenges[id as keyof typeof challenges]

  if (!challenge) {
    return <div className="text-white">Desafio não encontrado</div>
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Iniciante": return "bg-green-100 text-green-800"
      case "Intermediário": return "bg-yellow-100 text-yellow-800"
      case "Avançado": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const IconComponent = challenge.icon

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-16 h-16 rounded-lg ${challenge.color} flex items-center justify-center`}>
          <IconComponent className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white">{challenge.title}</h1>
          <p className="text-gray-400 text-lg mt-2">{challenge.category}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1a2942] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Sobre o Desafio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">{challenge.description}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="objectives" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#1a2942]">
              <TabsTrigger value="objectives" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
                Objetivos
              </TabsTrigger>
              <TabsTrigger value="requirements" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
                Requisitos
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
                Cronograma
              </TabsTrigger>
            </TabsList>

            <TabsContent value="objectives" className="mt-6">
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Objetivos do Desafio</CardTitle>
                  <CardDescription className="text-gray-400">
                    O que você precisa alcançar para completar este desafio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {challenge.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="mt-6">
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Requisitos</CardTitle>
                  <CardDescription className="text-gray-400">
                    Habilidades e conhecimentos necessários
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {challenge.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Award className="h-5 w-5 text-[#3b82f6] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Cronograma</CardTitle>
                  <CardDescription className="text-gray-400">
                    Prazos e marcos importantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-[#10b981]" />
                      <span className="text-gray-300">Início: {challenge.startDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-[#10b981]" />
                      <span className="text-gray-300">Fim: {challenge.endDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-[#10b981]" />
                      <span className="text-gray-300">Duração: {challenge.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#1a2942] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Detalhes do Desafio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Dificuldade:</span>
                <Badge variant="secondary" className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Participantes:</span>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-white">{challenge.participants}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Duração:</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-white">{challenge.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Prêmio:</span>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-[#10b981]" />
                  <span className="text-[#10b981] font-semibold">{challenge.prize}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status:</span>
                <Badge variant="outline" className="border-[#10b981] text-[#10b981]">
                  {challenge.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800">
            <CardContent className="p-6">
              <Button 
                className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white"
                onClick={() => setIsParticipating(!isParticipating)}
              >
                {isParticipating ? "Sair do Desafio" : "Participar do Desafio"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="mt-4 text-center">
                <Link href="/desafios" className="text-[#3b82f6] hover:underline text-sm">
                  Ver todos os desafios
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
