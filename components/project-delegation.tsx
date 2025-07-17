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
  currentLeaderId: string;
  isProjectCreator: boolean;
  participants: User[];
  onDelegationSuccess?: () => void;
}

export default function ProjectDelegation({
  projectId,
  currentLeaderId,
  isProjectCreator,
  participants,
  onDelegationSuccess
}: ProjectDelegationProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTalentId, setSelectedTalentId] = useState<string>("");

  // Filter only talents from participants (excluding current leader)
  const availableTalents = participants.filter(
    p => p.account_type === 'talent' && p._id !== currentLeaderId
  );

  const handleDelegation = async () => {
    if (!selectedTalentId) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um talento para delegar a liderança",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projetos/${projectId}/delegate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          new_leader_id: selectedTalentId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao delegar liderança");
      }

      const selectedTalent = availableTalents.find(t => t._id === selectedTalentId);
      toast({
        title: "Liderança delegada!",
        description: `${selectedTalent?.name} agora é o líder do projeto`,
      });

      setIsOpen(false);
      setSelectedTalentId("");
      onDelegationSuccess?.();
    } catch (error: any) {
      console.error("Error delegating project:", error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao delegar liderança",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only show for project creators and if there are available talents
  if (!isProjectCreator || availableTalents.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-blue-400 border-blue-400 hover:bg-blue-400/10">
          <Crown className="h-4 w-4 mr-2" />
          Delegar Liderança
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delegar Liderança do Projeto</DialogTitle>
          <DialogDescription>
            Selecione um talento participante para se tornar o novo líder do projeto.
            Apenas talentos podem ser líderes de projetos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Selecionar Novo Líder
            </label>
            <Select value={selectedTalentId} onValueChange={setSelectedTalentId}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um talento..." />
              </SelectTrigger>
              <SelectContent>
                {availableTalents.map((talent) => (
                  <SelectItem key={talent._id} value={talent._id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={talent.avatar} />
                        <AvatarFallback>
                          {talent.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{talent.name}</div>
                        <div className="text-xs text-gray-500">{talent.bio || 'Talento'}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Atenção:</strong> Ao delegar a liderança, você transferirá o controle total 
              do projeto para o talento selecionado. Esta ação não pode ser desfeita.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleDelegation}
              disabled={isLoading || !selectedTalentId}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Delegando..." : "Confirmar Delegação"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
