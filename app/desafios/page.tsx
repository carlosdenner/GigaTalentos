"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Calendar, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

const challenges = [
  {
    id: 1,
    title: "Desafio de Habilidade Cognitiva & Técnica",
    description: "Demonstre suas habilidades de resolução de problemas e competência técnica através de projetos inovadores",
    category: "Habilidade Cognitiva & Técnica",
    participants: 245,
    duration: "30 dias",
    difficulty: "Intermediário",
    prize: "R$ 5.000",
    status: "Ativo",
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Desafio de Criatividade & Inovação",
    description: "Crie soluções criativas e inovadoras para problemas do mundo real",
    category: "Criatividade & Inovação",
    participants: 189,
    duration: "45 dias",
    difficulty: "Avançado",
    prize: "R$ 8.000",
    status: "Ativo",
    color: "bg-purple-500"
  },
  {
    id: 3,
    title: "Desafio de Motivação & Paixão",
    description: "Demonstre sua dedicação e paixão por empreendedorismo através de projetos significativos",
    category: "Motivação & Paixão",
    participants: 312,
    duration: "21 dias",
    difficulty: "Iniciante",
    prize: "R$ 3.000",
    status: "Ativo",
    color: "bg-red-500"
  },
  {
    id: 4,
    title: "Desafio de Liderança & Colaboração",
    description: "Lidere equipes e colabore efetivamente em projetos de impacto social",
    category: "Liderança & Colaboração",
    participants: 156,
    duration: "60 dias",
    difficulty: "Avançado",
    prize: "R$ 10.000",
    status: "Ativo",
    color: "bg-green-500"
  },
  {
    id: 5,
    title: "Desafio de Consciência Social & Integridade",
    description: "Desenvolva soluções éticas que causem impacto positivo na sociedade",
    category: "Consciência Social & Integridade",
    participants: 98,
    duration: "90 dias",
    difficulty: "Avançado",
    prize: "R$ 15.000",
    status: "Ativo",
    color: "bg-teal-500"
  },
  {
    id: 6,
    title: "Desafio de Adaptabilidade & Resistência",
    description: "Mostre sua capacidade de adaptação e resistência em cenários desafiadores",
    category: "Adaptabilidade & Resistência",
    participants: 203,
    duration: "35 dias",
    difficulty: "Intermediário",
    prize: "R$ 6.000",
    status: "Ativo",
    color: "bg-orange-500"
  }
]

export default function DesafiosPage() {
  const [activeFilter, setActiveFilter] = useState("Todos")
  const [filteredChallenges, setFilteredChallenges] = useState(challenges)

  const filters = ["Todos", "Ativo", "Iniciante", "Intermediário", "Avançado"]

  useEffect(() => {
    if (activeFilter === "Todos") {
      setFilteredChallenges(challenges)
    } else if (activeFilter === "Ativo") {
      setFilteredChallenges(challenges.filter(c => c.status === "Ativo"))
    } else {
      setFilteredChallenges(challenges.filter(c => c.difficulty === activeFilter))
    }
  }, [activeFilter])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Iniciante": return "bg-green-100 text-green-800"
      case "Intermediário": return "bg-yellow-100 text-yellow-800"
      case "Avançado": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Desafios de Empreendedorismo</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Participe de desafios exclusivos que testam suas habilidades empreendedoras nas 6 dimensões-chave do talento.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            className={activeFilter === filter ? "bg-[#10b981] hover:bg-[#10b981]/90" : "border-gray-600 text-gray-300 hover:bg-gray-700"}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge.id} className="bg-[#1a2942] border-gray-800 hover:border-[#10b981] transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-lg ${challenge.color} flex items-center justify-center mb-4`}>
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary" className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-white text-lg">{challenge.title}</CardTitle>
              <CardDescription className="text-gray-400">
                {challenge.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{challenge.participants} participantes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{challenge.duration}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#10b981]">
                  <Star className="h-4 w-4" />
                  <span className="font-semibold">{challenge.prize}</span>
                </div>
                <Badge variant="outline" className="border-[#10b981] text-[#10b981]">
                  {challenge.status}
                </Badge>
              </div>

              <Link href={`/desafios/${challenge.id}`}>
                <Button className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white">
                  Participar do Desafio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

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
