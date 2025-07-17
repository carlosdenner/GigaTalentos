"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProjectFavoriteButtonProps {
  projectId: string;
  initialFavorited?: boolean;
  onFavoriteChange?: (favorited: boolean) => void;
}

export default function ProjectFavoriteButton({ 
  projectId, 
  initialFavorited = false,
  onFavoriteChange 
}: ProjectFavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  // Update state when initialFavorited changes
  useEffect(() => {
    setIsFavorited(initialFavorited);
  }, [initialFavorited]);

  const toggleFavorite = async () => {
    if (!session) {
      toast({
        title: "Login necessário",
        description: "Faça login para favoritar projetos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        // Remove favorite
        const response = await fetch(`/api/project-favorites?projeto_id=${projectId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to remove favorite");
        }

        setIsFavorited(false);
        onFavoriteChange?.(false);
        toast({
          title: "Removido dos favoritos",
          description: "Projeto removido dos seus favoritos",
        });
      } else {
        // Add favorite
        const response = await fetch("/api/project-favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projeto_id: projectId }),
        });

        if (!response.ok) {
          const error = await response.json();
          if (error.error === "Project already favorited") {
            // If already favorited, just update the state
            setIsFavorited(true);
            onFavoriteChange?.(true);
            toast({
              title: "Já favoritado",
              description: "Este projeto já está nos seus favoritos",
            });
            return;
          }
          throw new Error(error.error || "Failed to add favorite");
        }

        setIsFavorited(true);
        onFavoriteChange?.(true);
        toast({
          title: "Adicionado aos favoritos",
          description: "Projeto adicionado aos seus favoritos",
        });
      }
    } catch (error: any) {
      console.error("Error toggling favorite:", error);
      
      // Translate common error messages
      let errorMessage = error.message || "Falha ao atualizar favoritos";
      if (error.message === "Project already favorited") {
        errorMessage = "Projeto já está nos favoritos";
      } else if (error.message === "Failed to add favorite") {
        errorMessage = "Falha ao adicionar aos favoritos";
      } else if (error.message === "Failed to remove favorite") {
        errorMessage = "Falha ao remover dos favoritos";
      } else if (error.message === "Project not found") {
        errorMessage = "Projeto não encontrado";
      } else if (error.message === "Not authenticated") {
        errorMessage = "É necessário fazer login";
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return null; // Don't show favorite button if not logged in
  }

  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      size="sm"
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`flex items-center gap-2 ${
        isFavorited 
          ? "bg-red-500 hover:bg-red-600 text-white" 
          : "text-gray-400 hover:text-red-500 border-gray-600"
      }`}
    >
      {isFavorited ? (
        <Heart className="h-4 w-4 fill-current" />
      ) : (
        <HeartOff className="h-4 w-4" />
      )}
      {isFavorited ? "Favoritado" : "Favoritar"}
    </Button>
  );
}
