"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface FavoriteButtonProps {
  videoId: string;
  variant?: "ghost" | "outline" | "default";
  className?: string;
}

export default function FavoriteButton({
  videoId,
  variant = "ghost",
  className,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch(`/api/favorites?videoId=${videoId}`);
        const data = await response.json();
        setIsFavorite(data.some((fav: any) => fav._id === videoId));
      } catch (error) {
        setIsFavorite(false);
      }
    };

    checkIfFavorite();
  }, [videoId, session]);

  const toggleFavorite = async () => {
    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "Please log in to save favorites",
      });
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        await fetch(`/api/favorites/remove?videoId=${videoId}`, {
          method: "DELETE",
        });
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Video removed from your favorites",
        });
      } else {
        await fetch("/api/favorites/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId }),
        });
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Video added to your favorites",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={toggleFavorite}
      disabled={isLoading}
      className={className}
    >
      <Heart
        className={`h-6 w-6 mr-2 ${
          isFavorite ? "fill-[#10b981] text-[#10b981]" : ""
        }`}
      />
      <span>
        {session?.user
          ? isFavorite
            ? "Favorited"
            : "Add to Favorites"
          : "Save to Favorites"}
      </span>
    </Button>
  );
}
