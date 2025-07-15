"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface DesafioFavoriteButtonProps {
  desafioId: string;
  variant?: "ghost" | "outline" | "default";
  className?: string;
  showCount?: boolean;
}

export default function DesafioFavoriteButton({
  desafioId,
  variant = "ghost",
  className,
  showCount = false,
}: DesafioFavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch(`/api/desafios/${desafioId}/favorite`, {
          method: 'GET'
        });

        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.favorited);
          setFavoritesCount(data.favoritesCount || 0);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkIfFavorite();
  }, [desafioId, session]);

  const handleFavorite = async () => {
    if (!session?.user) {
      toast({
        title: "Login necessário",
        description: "Faça login para favoritar desafios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/desafios/${desafioId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.favorited);
        setFavoritesCount(data.favoritesCount);
        
        toast({
          title: data.favorited ? "Adicionado aos favoritos!" : "Removido dos favoritos",
          description: data.message,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao favoritar desafio');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status de favorito",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleFavorite}
      disabled={isLoading}
      className={`${className} transition-colors duration-200`}
    >
      <Heart 
        className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} ${
          isLoading ? 'animate-pulse' : ''
        }`} 
      />
      {showCount && favoritesCount > 0 && (
        <span className="ml-1 text-sm">{favoritesCount}</span>
      )}
    </Button>
  );
}
