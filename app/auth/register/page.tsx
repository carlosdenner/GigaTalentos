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
          title: "Registration successful",
          description: "Your account has been created. Please log in.",
        })

        router.push("/auth/login")
      } else {
        toast({
          title: "Registration failed",
          description: error || "Please check your information and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration failed",
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
            <p className="text-white">Discover African Talent</p>
          </div>
        </div>

        <Card className="bg-[#1a2942] border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription className="text-gray-400">Join the African talent discovery platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="bg-[#0a192f] border-gray-700"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="bg-[#0a192f] border-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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
                <Label htmlFor="account-type">Account Type</Label>
                <Select value={accountType} onValueChange={setAccountType} disabled={isLoading}>
                  <SelectTrigger className="bg-[#0a192f] border-gray-700">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2942] border-gray-700 text-white">
                    <SelectItem value="talent">Talent</SelectItem>
                    <SelectItem value="sponsor">Sponsor</SelectItem>
                    <SelectItem value="fan">Fan</SelectItem>
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
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#3b82f6] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#3b82f6] hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white"
                disabled={isLoading || !agreeTerms}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#1a2942] px-2 text-gray-400">Or continue with</span>
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
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#9d4edd] hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

