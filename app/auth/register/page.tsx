"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accountType, setAccountType] = useState("talent")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { success, error } = await signUp(name, email, password, accountType)

      if (success) {
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Sua conta foi criada. Por favor, faça login.",
        })

        router.push("/auth/login")
      } else {
        toast({
          title: "Falha no cadastro",
          description: error || "Por favor, verifique suas informações e tente novamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Falha no cadastro",
        description: "Ocorreu um erro. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0a192f] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center">
            <span className="text-4xl font-bold">
              <span className="text-[#10b981]">Giga</span>
              <span className="text-[#3b82f6]">Talentos</span>
            </span>
          </Link>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Zap className="h-5 w-5 text-[#10b981]" />
            <p className="text-white">Descubra Talentos Brasileiros</p>
          </div>
        </div>

        <Card className="bg-[#1a2942] border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Criar uma conta</CardTitle>
            <CardDescription className="text-gray-400">Junte-se à plataforma de descoberta de talentos brasileiros</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-[#0a192f] border-gray-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-type">Tipo de Conta</Label>
                <Select value={accountType} onValueChange={setAccountType} disabled={isLoading}>
                  <SelectTrigger className="bg-[#0a192f] border-gray-700">
                    <SelectValue placeholder="Selecione o tipo de conta" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2942] border-gray-700 text-white">
                    <SelectItem value="talent">Talento</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="fan">Admirador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  required
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-sm text-gray-400">
                  Eu concordo com os{" "}
                  <Link href="/terms" className="text-[#3b82f6] hover:underline">
                    Termos de Serviço
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacy" className="text-[#3b82f6] hover:underline">
                    Política de Privacidade
                  </Link>
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white"
                disabled={isLoading || !agreeTerms}
              >
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#1a2942] px-2 text-gray-400">Ou continue com</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-700" disabled={isLoading}>
                Google
              </Button>
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-700" disabled={isLoading}>
                Facebook
              </Button>
            </div>
            <p className="text-center text-sm text-gray-400">
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="text-[#3b82f6] hover:underline">
                Entrar
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

