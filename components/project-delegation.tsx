"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Crown, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface User {
  _id: string;
  name: string;
  avatar: string;
  account_type: string;
  bio?: string;
}

interface ProjectDelegationProps {
  projectId: string;
  currentUserId: string;
  isProjectCreator: boolean;
  hasLeader: boolean;
  liderancaStatus: 'ativo' | 'buscando_lider' | 'delegacao_pendente';
  onDelegationSuccess?: () => void;
}

export default function ProjectDelegation({
  projectId,
  currentUserId,
  isProjectCreator,
  hasLeader,
  liderancaStatus,
  onDelegationSuccess
}: ProjectDelegationProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Show button to set project as "looking for leader" if mentor created it but no talent leader yet
  const canSetLookingForLeader = isProjectCreator && !hasLeader && liderancaStatus !== 'buscando_lider';
  const isAlreadyLookingForLeader = liderancaStatus === 'buscando_lider';

  const handleSetLookingForLeader = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projetos/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lideranca_status: 'buscando_lider'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao atualizar status do projeto");
      }

      toast({
        title: "Projeto em busca de líder!",
        description: "O projeto agora está aberto para candidaturas de liderança de talentos",
      });

      setIsOpen(false);
      onDelegationSuccess?.();
    } catch (error: any) {
      console.error("Error setting project status:", error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao atualizar status do projeto",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only show for project creators who don't have a leader yet
  if (!canSetLookingForLeader && !isAlreadyLookingForLeader) {
    return null;
  }

  // If already looking for leader, show status badge
  if (isAlreadyLookingForLeader) {
    return (
      <Badge variant="outline" className="text-orange-600 border-orange-600">
        <Crown className="h-3 w-3 mr-1" />
        Buscando Líder
      </Badge>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-blue-400 border-blue-400 hover:bg-blue-400/10">
          <Crown className="h-4 w-4 mr-2" />
          Buscar Líder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buscar Líder para o Projeto</DialogTitle>
          <DialogDescription>
            Definir o projeto como "em busca de líder" permite que talentos se candidatem
            para liderar este projeto. Apenas talentos podem liderar projetos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Como funciona:</strong> Após definir como "buscando líder", talentos 
              poderão se candidatar para liderar o projeto. Você poderá revisar e aprovar 
              as candidaturas.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSetLookingForLeader}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Atualizando..." : "Buscar Líder"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
