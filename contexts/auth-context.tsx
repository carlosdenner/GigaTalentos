"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
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
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        setIsAuthenticated(true)
        // Get user profile data
        const { data: userData } = await supabase.from("users").select("*").eq("id", data.session.user.id).single()

        if (userData) {
          setUser(userData)
        }
      } else {
        setIsAuthenticated(false)
      }

      setLoading(false)
    }

    checkSession()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setIsAuthenticated(true)
        // Get user profile data
        const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (userData) {
          setUser(userData)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setIsAuthenticated(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      setIsAuthenticated(true)

      // Get user profile data
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (userError) {
        return { success: false, error: "Failed to fetch user data" }
      }

      setUser(userData)
      return { success: true }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  }

  const signUp = async (name: string, email: string, password: string, accountType: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: "User creation failed" }
      }

      // Create user profile
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email,
          name,
          account_type: accountType,
          avatar: `/placeholder.svg?height=100&width=100&text=${name.substring(0, 2).toUpperCase()}`,
        },
      ])

      if (profileError) {
        return { success: false, error: profileError.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Registration failed" }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAuthenticated(false)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isAuthenticated }}>
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

