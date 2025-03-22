"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface FavoriteButtonProps {
  videoId: string
  variant?: "ghost" | "outline" | "default"
  className?: string
}

export default function FavoriteButton({ videoId, variant = "ghost", className }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!user) return

      try {
        const { data } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", user.id)
          .eq("video_id", videoId)
          .single()

        setIsFavorite(!!data)
      } catch (error) {
        // Not found, not a favorite
        setIsFavorite(false)
      }
    }

    checkIfFavorite()
  }, [videoId, user])

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save favorites",
      })

      // Redirect to login page
      router.push("/auth/login")
      return
    }

    setIsLoading(true)

    try {
      if (isFavorite) {
        // Remove from favorites
        await fetch(`/api/favorites/remove?userId=${user.id}&videoId=${videoId}`, {
          method: "DELETE",
        })

        setIsFavorite(false)
        toast({
          title: "Removed from favorites",
          description: "Video removed from your favorites",
        })
      } else {
        // Add to favorites
        await fetch("/api/favorites/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            videoId: videoId,
          }),
        })

        setIsFavorite(true)
        toast({
          title: "Added to favorites",
          description: "Video added to your favorites",
        })
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} onClick={toggleFavorite} disabled={isLoading} className={className}>
      <Heart className={`h-6 w-6 mr-2 ${isFavorite ? "fill-[#ff1493] text-[#ff1493]" : ""}`} />
      <span>{user ? (isFavorite ? "Favorited" : "Add to Favorites") : "Save to Favorites"}</span>
    </Button>
  )
}

