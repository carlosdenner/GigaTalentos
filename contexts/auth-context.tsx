"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: any
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (
    name: string,
    email: string,
    password: string,
    accountType: string,
  ) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      setUser(session.user)
      setLoading(false)
    } else if (status !== 'loading') {
      setLoading(false)
    }
  }, [session, status])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        return { success: false, error: result.error }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  const signUp = async (name: string, email: string, password: string, accountType: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, accountType }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error }
      }

      return signIn(email, password)
    } catch (error) {
      return { success: false, error: 'Registration failed' }
    }
  }

  const signOut = async () => {
    await nextAuthSignOut({ redirect: false })
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      isAuthenticated: !!session
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

