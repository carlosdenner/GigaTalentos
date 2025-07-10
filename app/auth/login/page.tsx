"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { success, error } = await signIn(email, password)

      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })

        router.push("/")
      } else {
        toast({
          title: "Login failed",
          description: error || "Please check your credentials and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again later.",
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
            <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-gray-400">Faça login na sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link href="/auth/forgot-password" className="text-sm text-[#3b82f6] hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm text-gray-400">
                  Lembrar de mim
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Fazendo login..." : "Entrar"}
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
              Não tem uma conta?{" "}
              <Link href="/auth/register" className="text-[#3b82f6] hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

