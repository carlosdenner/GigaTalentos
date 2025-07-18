"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MapPin, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("general")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Mensagem enviada com sucesso!",
          description: "Entraremos em contato o mais breve possível.",
        })

        // Reset form
        setName("")
        setEmail("")
        setSubject("general")
        setMessage("")
      } else {
        toast({
          title: "Erro ao enviar mensagem",
          description: data.error || "Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      toast({
        title: "Erro ao enviar mensagem",
        description: "Verifique sua conexão e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Entre em Contato</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#10b981]/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-[#10b981]" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Email</h3>
                  <p className="text-gray-400">contatos@gigacandanga.net.br</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#3b82f6]/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-[#3b82f6]" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Telefone</h3>
                  <p className="text-gray-400">+55 61 3340-6543</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-[#1e90ff]/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-[#1e90ff]" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Endereço</h3>
                  <p className="text-gray-400">Edifício CEFTRU, Bloco B, Sala BT 07/20<br />
                    Campus Darcy Ribeiro – UnB<br />
                    Asa Norte, Brasília – DF<br />
                    CEP: 70910-900</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Horário de Funcionamento</CardTitle>
              <CardDescription className="text-gray-400">Quando você pode nos encontrar</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Segunda - Sexta</span>
                  <span className="text-white">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sábado</span>
                  <span className="text-white">10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Domingo</span>
                  <span className="text-white">Fechado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Envie-nos uma mensagem</CardTitle>
              <CardDescription className="text-gray-400">
                Preencha o formulário abaixo e entraremos em contato o mais breve possível.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      placeholder="João Silva"
                      className="bg-[#0a192f] border-gray-700"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nome@exemplo.com"
                      className="bg-[#0a192f] border-gray-700"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Select value={subject} onValueChange={setSubject} disabled={isLoading}>
                    <SelectTrigger className="bg-[#0a192f] border-gray-700">
                      <SelectValue placeholder="Selecione um assunto" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2942] border-gray-700 text-white">
                      <SelectItem value="general">Consulta Geral</SelectItem>
                      <SelectItem value="support">Suporte Técnico</SelectItem>
                      <SelectItem value="partnership">Oportunidades de Parceria</SelectItem>
                      <SelectItem value="sponsorship">Patrocínio</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    placeholder="Como podemos ajudá-lo?"
                    className="bg-[#0a192f] border-gray-700 min-h-[150px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

