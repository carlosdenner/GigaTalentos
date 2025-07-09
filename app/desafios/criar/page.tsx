"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateChallengePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    duration: "",
    prize: "",
    objectives: [] as string[],
    requirements: [] as string[]
  })

  const [newObjective, setNewObjective] = useState("")
  const [newRequirement, setNewRequirement] = useState("")

  const categories = [
    "Habilidade Cognitiva & Técnica",
    "Criatividade & Inovação",
    "Motivação & Paixão",
    "Liderança & Colaboração",
    "Consciência Social & Integridade",
    "Adaptabilidade & Resistência"
  ]

  const difficulties = ["Iniciante", "Intermediário", "Avançado"]

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }))
      setNewObjective("")
    }
  }

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }))
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }))
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log("Challenge data:", formData)
    alert("Desafio criado com sucesso!")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Iniciante": return "bg-green-100 text-green-800"
      case "Intermediário": return "bg-yellow-100 text-yellow-800"
      case "Avançado": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/desafios">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white">Criar Novo Desafio</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Informações Básicas</CardTitle>
                  <CardDescription className="text-gray-400">
                    Defina as informações principais do desafio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-300">Título do Desafio</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Desafio de Inovação Tecnológica"
                      className="bg-[#0a192f] border-gray-700 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva o desafio, seus objetivos e o que os participantes devem fazer..."
                      className="bg-[#0a192f] border-gray-700 text-white min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-300">Categoria</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="bg-[#0a192f] border-gray-700 text-white">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty" className="text-gray-300">Dificuldade</Label>
                      <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                        <SelectTrigger className="bg-[#0a192f] border-gray-700 text-white">
                          <SelectValue placeholder="Selecione a dificuldade" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficulties.map((difficulty) => (
                            <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-gray-300">Duração</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="Ex: 30 dias"
                        className="bg-[#0a192f] border-gray-700 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prize" className="text-gray-300">Prêmio</Label>
                      <Input
                        id="prize"
                        value={formData.prize}
                        onChange={(e) => setFormData(prev => ({ ...prev, prize: e.target.value }))}
                        placeholder="Ex: R$ 5.000"
                        className="bg-[#0a192f] border-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Objetivos</CardTitle>
                  <CardDescription className="text-gray-400">
                    Liste os objetivos que os participantes devem alcançar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      placeholder="Adicionar objetivo..."
                      className="bg-[#0a192f] border-gray-700 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                    />
                    <Button type="button" onClick={addObjective} size="sm" className="bg-[#10b981] hover:bg-[#10b981]/90">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {formData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-[#0a192f] rounded border">
                        <span className="text-gray-300 flex-1">{objective}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeObjective(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1a2942] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Requisitos</CardTitle>
                  <CardDescription className="text-gray-400">
                    Defina os requisitos e habilidades necessárias
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Adicionar requisito..."
                      className="bg-[#0a192f] border-gray-700 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                    />
                    <Button type="button" onClick={addRequirement} size="sm" className="bg-[#10b981] hover:bg-[#10b981]/90">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {formData.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-[#0a192f] rounded border">
                        <span className="text-gray-300 flex-1">{requirement}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRequirement(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-[#1a2942] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Pré-visualização</CardTitle>
              <CardDescription className="text-gray-400">
                Veja como seu desafio aparecerá para os participantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-[#0a192f] p-6 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {formData.title || "Título do Desafio"}
                    </h3>
                    <p className="text-gray-400 mb-2">{formData.category || "Categoria"}</p>
                    <p className="text-gray-300 text-sm">
                      {formData.description || "Descrição do desafio aparecerá aqui..."}
                    </p>
                  </div>
                  {formData.difficulty && (
                    <Badge variant="secondary" className={getDifficultyColor(formData.difficulty)}>
                      {formData.difficulty}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Duração: {formData.duration || "N/A"}</span>
                  <span>Prêmio: {formData.prize || "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/desafios">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit" className="bg-[#10b981] hover:bg-[#10b981]/90 text-white">
              Criar Desafio
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
