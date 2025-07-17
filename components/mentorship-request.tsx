"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
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
import { Star, Users, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Mentor {
  _id: string;
  name: string;
  avatar: string;
  bio?: string;
  skills?: string[];
  experience?: string;
}

interface MentorshipRequestProps {
  projectId: string;
  projectName: string;
  isProjectLeader: boolean;
  currentSponsors: Mentor[];
  onMentorshipSuccess?: () => void;
}

export default function MentorshipRequest({
  projectId,
  projectName,
  isProjectLeader,
  currentSponsors,
  onMentorshipSuccess
}: MentorshipRequestProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableMentors, setAvailableMentors] = useState<Mentor[]>([]);
  const [selectedMentorId, setSelectedMentorId] = useState<string>("");
  const [requestMessage, setRequestMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchAvailableMentors();
    }
  }, [isOpen]);

  const fetchAvailableMentors = async () => {
    try {
      const response = await fetch("/api/users?account_type=mentor");
      if (response.ok) {
        const mentors = await response.json();
        // Filter out mentors who are already sponsors
        const currentSponsorIds = currentSponsors.map(s => s._id);
        const available = mentors.filter((m: Mentor) => !currentSponsorIds.includes(m._id));
        setAvailableMentors(available);
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  const handleMentorshipRequest = async () => {
    if (!selectedMentorId) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um mentor",
        variant: "destructive",
      });
      return;
    }

    if (!requestMessage.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, escreva uma mensagem para o mentor",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/mentorship-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projeto_id: projectId,
          mentor_id: selectedMentorId,
          mensagem: requestMessage
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao solicitar mentoria");
      }

      const selectedMentor = availableMentors.find(m => m._id === selectedMentorId);
      toast({
        title: "Solicitação enviada!",
        description: `Solicitação de mentoria enviada para ${selectedMentor?.name}`,
      });

      setIsOpen(false);
      setSelectedMentorId("");
      setRequestMessage("");
      onMentorshipSuccess?.();
    } catch (error: any) {
      console.error("Error requesting mentorship:", error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao solicitar mentoria",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only show for project leaders
  if (!isProjectLeader) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10">
          <Star className="h-4 w-4 mr-2" />
          Solicitar Mentoria
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Solicitar Mentoria</DialogTitle>
          <DialogDescription>
            Convide um mentor para apoiar o projeto "{projectName}" como sponsor.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Sponsors Display */}
          {currentSponsors.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Mentores Atuais ({currentSponsors.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {currentSponsors.map((sponsor) => (
                  <div key={sponsor._id} className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={sponsor.avatar} />
                      <AvatarFallback>
                        {sponsor.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{sponsor.name}</span>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mentor Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Selecionar Mentor
            </label>
            <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um mentor para convidar..." />
              </SelectTrigger>
              <SelectContent>
                {availableMentors.map((mentor) => (
                  <SelectItem key={mentor._id} value={mentor._id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={mentor.avatar} />
                        <AvatarFallback>
                          {mentor.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{mentor.name}</div>
                        <div className="text-xs text-gray-500">
                          {mentor.experience} • {mentor.skills?.slice(0, 2).join(", ")}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message to Mentor */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Mensagem para o Mentor
            </label>
            <Textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Explique por que você gostaria que este mentor apoiasse seu projeto..."
              rows={4}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>💡 Dica:</strong> Mentores como sponsors oferecem orientação, recursos e 
              suporte estratégico para o desenvolvimento do projeto.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleMentorshipRequest}
              disabled={isLoading || !selectedMentorId || !requestMessage.trim()}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isLoading ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
