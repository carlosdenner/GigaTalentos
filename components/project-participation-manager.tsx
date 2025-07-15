'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Users, UserPlus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ParticipationRequest {
  _id: string;
  usuario_id: {
    _id: string;
    name: string;
    avatar?: string;
    account_type: string;
    bio?: string;
    skills?: string[];
  };
  mensagem: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  solicitado_em: string;
  respondido_em?: string;
  resposta_mensagem?: string;
}

interface ProjectParticipationManagerProps {
  projectId: string;
  isProjectLeader: boolean;
  currentUserParticipationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  participationRequests?: ParticipationRequest[];
  onUpdate?: () => void;
}

export default function ProjectParticipationManager({ 
  projectId, 
  isProjectLeader, 
  currentUserParticipationStatus = 'none',
  participationRequests = [],
  onUpdate 
}: ProjectParticipationManagerProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRequestParticipation = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projetos/${projectId}/participacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: requestMessage })
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Solicitação de participação enviada!"
        });
        setRequestMessage('');
        setIsDialogOpen(false);
        onUpdate?.();
      } else {
        const error = await response.json();
        toast({
          title: "Erro",
          description: error.error || "Falha ao enviar solicitação",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error requesting participation:', error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespondToRequest = async (requestId: string, action: 'aprovar' | 'rejeitar') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projetos/${projectId}/participacao/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          acao: action,
          resposta_mensagem: responseMessage 
        })
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Solicitação ${action === 'aprovar' ? 'aprovada' : 'rejeitada'} com sucesso!`
        });
        setResponseMessage('');
        onUpdate?.();
      } else {
        const error = await response.json();
        toast({
          title: "Erro",
          description: error.error || `Falha ao ${action} solicitação`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error responding to request:', error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-500 text-white';
      case 'rejeitado': return 'bg-red-500 text-white';
      case 'pendente': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado': return <CheckCircle className="h-4 w-4" />;
      case 'rejeitado': return <XCircle className="h-4 w-4" />;
      case 'pendente': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* User Participation Actions */}
      {!isProjectLeader && session?.user && (
        <div className="flex items-center gap-2">
          {currentUserParticipationStatus === 'none' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Solicitar Participação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Solicitar Participação no Projeto</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="message">Mensagem (opcional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Conte um pouco sobre seu interesse e experiência..."
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleRequestParticipation} 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {currentUserParticipationStatus === 'pending' && (
            <Badge className="bg-yellow-500 text-black">
              <Clock className="h-4 w-4 mr-1" />
              Solicitação Pendente
            </Badge>
          )}
          
          {currentUserParticipationStatus === 'approved' && (
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="h-4 w-4 mr-1" />
              Participante Aprovado
            </Badge>
          )}
          
          {currentUserParticipationStatus === 'rejected' && (
            <Badge className="bg-red-500 text-white">
              <XCircle className="h-4 w-4 mr-1" />
              Solicitação Rejeitada
            </Badge>
          )}
        </div>
      )}

      {/* Project Leader - Manage Requests */}
      {isProjectLeader && participationRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Solicitações de Participação ({participationRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {participationRequests.map((request) => (
              <div key={request._id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      {request.usuario_id.avatar ? (
                        <img 
                          src={request.usuario_id.avatar} 
                          alt={request.usuario_id.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {request.usuario_id.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{request.usuario_id.name}</h4>
                      <p className="text-sm text-gray-600">{request.usuario_id.account_type}</p>
                      {request.usuario_id.skills && request.usuario_id.skills.length > 0 && (
                        <p className="text-xs text-gray-500">
                          Skills: {request.usuario_id.skills.slice(0, 3).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1 capitalize">{request.status}</span>
                  </Badge>
                </div>

                {request.mensagem && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm">{request.mensagem}</p>
                  </div>
                )}

                {request.status === 'pendente' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => handleRespondToRequest(request._id, 'aprovar')}
                      disabled={isLoading}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleRespondToRequest(request._id, 'rejeitar')}
                      disabled={isLoading}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                )}

                {request.resposta_mensagem && (
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm font-medium">Resposta:</p>
                    <p className="text-sm">{request.resposta_mensagem}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
