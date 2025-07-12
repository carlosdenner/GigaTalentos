"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProjectParticipationRequestProps {
  projectId: string;
  projectName: string;
  isLeader: boolean;
  hasRequested?: boolean;
  onRequestSent?: () => void;
}

export default function ProjectParticipationRequest({
  projectId,
  projectName,
  isLeader,
  hasRequested = false,
  onRequestSent
}: ProjectParticipationRequestProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    mensagem: "",
    area_interesse: "",
    experiencia_relevante: "",
    habilidades_oferecidas: [] as string[]
  });
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !formData.habilidades_oferecidas.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        habilidades_oferecidas: [...prev.habilidades_oferecidas, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      habilidades_oferecidas: prev.habilidades_oferecidas.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mensagem.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, escreva uma mensagem explicando seu interesse",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/participation-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projeto_id: projectId,
          ...formData
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send request");
      }

      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação de participação foi enviada ao líder do projeto",
      });

      setIsOpen(false);
      setFormData({
        mensagem: "",
        area_interesse: "",
        experiencia_relevante: "",
        habilidades_oferecidas: []
      });
      onRequestSent?.();
    } catch (error: any) {
      console.error("Error sending participation request:", error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao enviar solicitação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show if not logged in, if user is the leader, or if user is not a talent
  if (!session || isLeader || session.user?.accountType !== 'talent') {
    return null;
  }

  if (hasRequested) {
    return (
      <Button variant="outline" disabled className="text-gray-500 border-gray-600">
        <Users className="h-4 w-4 mr-2" />
        Solicitação Enviada
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-green-400 border-green-400 hover:bg-green-400/10">
          <Users className="h-4 w-4 mr-2" />
          Solicitar Participação
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a2942] border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Solicitar Participação</DialogTitle>
          <DialogDescription className="text-gray-400">
            Envie uma solicitação para participar do projeto "{projectName}"
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-white mb-2 block font-medium">
              Mensagem para o líder do projeto *
            </label>
            <Textarea
              value={formData.mensagem}
              onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
              className="bg-[#0a192f] border-gray-700 text-white"
              rows={4}
              placeholder="Explique por que você gostaria de participar deste projeto e como pode contribuir..."
              required
            />
          </div>

          <div>
            <label className="text-white mb-2 block font-medium">
              Área de interesse no projeto
            </label>
            <Input
              value={formData.area_interesse}
              onChange={(e) => setFormData({ ...formData, area_interesse: e.target.value })}
              className="bg-[#0a192f] border-gray-700 text-white"
              placeholder="Ex: Frontend, Backend, Design, Marketing..."
            />
          </div>

          <div>
            <label className="text-white mb-2 block font-medium">
              Experiência relevante
            </label>
            <Textarea
              value={formData.experiencia_relevante}
              onChange={(e) => setFormData({ ...formData, experiencia_relevante: e.target.value })}
              className="bg-[#0a192f] border-gray-700 text-white"
              rows={3}
              placeholder="Descreva experiências relevantes para este projeto..."
            />
          </div>

          <div>
            <label className="text-white mb-2 block font-medium">
              Habilidades que você oferece
            </label>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="bg-[#0a192f] border-gray-700 text-white flex-1"
                  placeholder="Digite uma habilidade"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button
                  type="button"
                  onClick={addSkill}
                  size="sm"
                  className="bg-[#10b981] hover:bg-[#10b981]/90"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.habilidades_oferecidas.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-[#0a192f] text-white border border-[#10b981]/20 px-3 py-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="text-white border-gray-600"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#10b981] hover:bg-[#10b981]/90 text-white"
            >
              {isLoading ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
