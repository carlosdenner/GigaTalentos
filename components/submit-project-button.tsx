"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useUserType } from "@/hooks/useUserType"
import { useEffect, useState } from "react"

export default function SubmitProjectButton() {
  const { data: session } = useSession()
  const { userType, isLoading: userTypeLoading } = useUserType()
  const router = useRouter()
  const [hasPortfolio, setHasPortfolio] = useState(false)
  const [checkingPortfolio, setCheckingPortfolio] = useState(false)

  useEffect(() => {
    if (session && userType && ['talent', 'mentor', 'admin'].includes(userType)) {
      checkUserPortfolio()
    }
  }, [session, userType])

  const checkUserPortfolio = async () => {
    setCheckingPortfolio(true)
    try {
      const response = await fetch('/api/channels')
      if (response.ok) {
        const portfolios = await response.json()
        setHasPortfolio(portfolios.length > 0)
      }
    } catch (error) {
      console.error('Error checking portfolio:', error)
    } finally {
      setCheckingPortfolio(false)
    }
  }

  const handleSubmitProject = async () => {
    if (!session) {
      // If not authenticated, redirect to registration
      router.push('/auth/register')
      return
    }

    // Wait for user type to load
    if (userTypeLoading) {
      return
    }

    // If authenticated, check if user can create projects
    if (userType && ['talent', 'mentor', 'admin'].includes(userType)) {
      // Check if user has a portfolio/channel
      if (!hasPortfolio && !checkingPortfolio) {
        // First, they need to create a portfolio/channel
        router.push('/channel/create?returnTo=project-create')
        return
      }
      
      router.push('/projetos/create')
    } else {
      // If user is authenticated but doesn't have the right account type
      router.push('/auth/register')
    }
  }

  return (
    <Button 
      onClick={handleSubmitProject}
      className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white text-lg px-8 py-4"
      disabled={checkingPortfolio || userTypeLoading}
    >
      {checkingPortfolio || userTypeLoading ? "Carregando..." : "Submeter Seu Projeto"}
    </Button>
  )
}
