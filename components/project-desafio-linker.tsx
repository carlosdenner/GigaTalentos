'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Link, Trophy, Clock, CheckCircle, XCircle, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Desafio {
  _id: string;
  title: string;
  description: string;
  status: string;
  difficulty: string;
  end_date: string;
}

interface ProjectLinking {
  projeto_id: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  solicitado_em: string;
  aprovado_em?: string;
  mensagem?: string;
  resposta_mensagem?: string;
}

interface ProjectDesafioLinkerProps {
  projectId: string;
  isProjectOwner: boolean;
  isDesafioOwner?: boolean;
  currentDesafioId?: string;
  currentLinkingStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  availableDesafios?: Desafio[];
  projectLinkings?: ProjectLinking[];
  onUpdate?: () => void;
}

export default function ProjectDesafioLinker({ 
  projectId, 
  isProjectOwner,
  isDesafioOwner = false,
  currentDesafioId,
  currentLinkingStatus = 'none',
  availableDesafios = [],
  projectLinkings = [],
  onUpdate 
}: ProjectDesafioLinkerProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDesafioId, setSelectedDesafioId] = useState('');
  const [linkingMessage, setLinkingMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRequestLinking = async () => {
    if (!selectedDesafioId) {
      toast({
        title: "Erro",
        description: "Selecione um desafio",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projetos/${projectId}/link-desafio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          desafio_id: selectedDesafioId,
          mensagem: linkingMessage 
        })
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Solicitação de vinculação enviada!"
        });
        setSelectedDesafioId('');
        setLinkingMessage('');
        setIsDialogOpen(false);
        onUpdate?.();
      } else {
        const error = await response.json();
        toast({
          title: "Erro",
          description: error.error || "Falha ao solicitar vinculação",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error requesting linking:', error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespondToLinking = async (desafioId: string, action: 'aprovar' | 'rejeitar') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/desafios/${desafioId}/approve-project/${projectId}`, {
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
          description: `Vinculação ${action === 'aprovar' ? 'aprovada' : 'rejeitada'} com sucesso!`
        });
        setResponseMessage('');
        onUpdate?.();
      } else {
        const error = await response.json();
        toast({
          title: "Erro",
          description: error.error || `Falha ao ${action} vinculação`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error responding to linking:', error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      {/* Project Owner - Request Linking */}
      {isProjectOwner && session?.user && (
        <div className="space-y-3">
          {currentLinkingStatus === 'none' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                  <Target className="h-4 w-4 mr-2" />
                  Vincular a Desafio
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Vincular Projeto a Desafio</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="desafio">Selecionar Desafio</Label>
                    <Select value={selectedDesafioId} onValueChange={setSelectedDesafioId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um desafio..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDesafios.map((desafio) => (
                          <SelectItem key={desafio._id} value={desafio._id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{desafio.title}</span>
                              <span className="text-xs text-gray-500">
                                {desafio.difficulty} • Termina em {formatDate(desafio.end_date)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Mensagem (opcional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Explique como seu projeto se relaciona com o desafio..."
                      value={linkingMessage}
                      onChange={(e) => setLinkingMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleRequestLinking} 
                      disabled={isLoading || !selectedDesafioId}
                    >
                      {isLoading ? 'Enviando...' : 'Solicitar Vinculação'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {currentLinkingStatus === 'pending' && (
            <Badge className="bg-yellow-500 text-black">
              <Clock className="h-4 w-4 mr-1" />
              Vinculação Pendente
            </Badge>
          )}
          
          {currentLinkingStatus === 'approved' && currentDesafioId && (
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white">
                <Trophy className="h-4 w-4 mr-1" />
                Vinculado ao Desafio
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a href={`/desafios/${currentDesafioId}`} target="_blank" rel="noopener noreferrer">
                  <Link className="h-4 w-4 mr-1" />
                  Ver Desafio
                </a>
              </Button>
            </div>
          )}
          
          {currentLinkingStatus === 'rejected' && (
            <Badge className="bg-red-500 text-white">
              <XCircle className="h-4 w-4 mr-1" />
              Vinculação Rejeitada
            </Badge>
          )}
        </div>
      )}

      {/* Desafio Owner - Manage Linking Requests */}
      {isDesafioOwner && projectLinkings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Solicitações de Vinculação ({projectLinkings.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectLinkings.map((linking, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">Projeto #{linking.projeto_id.slice(-6)}</h4>
                    <p className="text-sm text-gray-600">
                      Solicitado em {formatDate(linking.solicitado_em)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(linking.status)}>
                    {getStatusIcon(linking.status)}
                    <span className="ml-1 capitalize">{linking.status}</span>
                  </Badge>
                </div>

                {linking.mensagem && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm">{linking.mensagem}</p>
                  </div>
                )}

                {linking.status === 'pendente' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => handleRespondToLinking(currentDesafioId!, 'aprovar')}
                      disabled={isLoading}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleRespondToLinking(currentDesafioId!, 'rejeitar')}
                      disabled={isLoading}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                )}

                {linking.resposta_mensagem && (
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm font-medium">Resposta:</p>
                    <p className="text-sm">{linking.resposta_mensagem}</p>
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
