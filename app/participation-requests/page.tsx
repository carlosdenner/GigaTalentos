"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MessageSquare, 
  Calendar,
  Briefcase,
  Target
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ParticipationRequest {
  _id: string;
  projeto_id: {
    _id: string;
    nome: string;
    descricao: string;
    avatar: string;
  };
  solicitante_id: {
    _id: string;
    name: string;
    avatar: string;
    skills: string[];
    account_type: string;
  };
  lider_id: {
    _id: string;
    name: string;
    avatar: string;
  };
  mensagem: string;
  area_interesse: string;
  experiencia_relevante: string;
  habilidades_oferecidas: string[];
  status: 'pendente' | 'aprovado' | 'rejeitado';
  criado_em: string;
  respondido_em?: string;
  resposta_lider?: string;
}

export default function ParticipationRequestsPage() {
  const { data: session, status } = useSession();
  const [receivedRequests, setReceivedRequests] = useState<ParticipationRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ParticipationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ParticipationRequest | null>(null);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    if (session) {
      fetchRequests();
    }
  }, [session]);

  const fetchRequests = async () => {
    try {
      const [receivedRes, sentRes] = await Promise.all([
        fetch('/api/participation-requests?type=received'),
        fetch('/api/participation-requests?type=sent')
      ]);

      const receivedData = await receivedRes.json();
      const sentData = await sentRes.json();

      setReceivedRequests(receivedData);
      setSentRequests(sentData);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar solicitações",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = async (requestId: string, status: 'aprovado' | 'rejeitado') => {
    try {
      const response = await fetch(`/api/participation-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          resposta_lider: responseText
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to respond to request');
      }

      toast({
        title: "Sucesso",
        description: `Solicitação ${status === 'aprovado' ? 'aprovada' : 'rejeitada'} com sucesso`,
      });

      await fetchRequests();
      setSelectedRequest(null);
      setResponseText("");
    } catch (error) {
      console.error('Error responding to request:', error);
      toast({
        title: "Erro",
        description: "Falha ao responder solicitação",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejeitado': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado': return <CheckCircle className="h-4 w-4" />;
      case 'rejeitado': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
        <div className="text-white">Faça login para acessar esta página</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a192f] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">📋 Solicitações de Participação</h1>
        
        <Tabs defaultValue="received" className="space-y-6">
          <TabsList className="bg-[#1a2942] border-gray-800">
            <TabsTrigger value="received" className="text-white data-[state=active]:bg-[#10b981]">
              Recebidas ({receivedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="text-white data-[state=active]:bg-[#10b981]">
              Enviadas ({sentRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4">
            {receivedRequests.length === 0 ? (
              <Card className="bg-[#1a2942] border-gray-800">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Nenhuma solicitação recebida ainda</p>
                </CardContent>
              </Card>
            ) : (
              receivedRequests.map((request) => (
                <Card key={request._id} className="bg-[#1a2942] border-gray-800 text-white">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={request.solicitante_id.avatar} />
                          <AvatarFallback>
                            {request.solicitante_id.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{request.solicitante_id.name}</CardTitle>
                          <p className="text-gray-400 text-sm">
                            Projeto: {request.projeto_id.nome}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                          <MessageSquare className="h-4 w-4" />
                          Mensagem
                        </div>
                        <p className="text-gray-200">{request.mensagem}</p>
                      </div>

                      {request.area_interesse && (
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <Target className="h-4 w-4" />
                            Área de Interesse
                          </div>
                          <p className="text-gray-200">{request.area_interesse}</p>
                        </div>
                      )}

                      {request.habilidades_oferecidas.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <Briefcase className="h-4 w-4" />
                            Habilidades Oferecidas
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {request.habilidades_oferecidas.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4" />
                        Enviado em: {new Date(request.criado_em).toLocaleDateString('pt-BR')}
                      </div>

                      {request.status === 'pendente' && (
                        <div className="flex gap-2 pt-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Aprovar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#1a2942] border-gray-800 text-white">
                              <DialogHeader>
                                <DialogTitle>Aprovar Solicitação</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Você está aprovando {request.solicitante_id.name} para participar do projeto {request.projeto_id.nome}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  placeholder="Mensagem de boas-vindas (opcional)"
                                  value={responseText}
                                  onChange={(e) => setResponseText(e.target.value)}
                                  className="bg-[#0a192f] border-gray-700 text-white"
                                />
                                <div className="flex gap-2 justify-end">
                                  <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                                    Cancelar
                                  </Button>
                                  <Button 
                                    className="bg-green-500 hover:bg-green-600"
                                    onClick={() => handleResponse(request._id, 'aprovado')}
                                  >
                                    Confirmar Aprovação
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="border-red-500 text-red-400 hover:bg-red-500/10"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Rejeitar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#1a2942] border-gray-800 text-white">
                              <DialogHeader>
                                <DialogTitle>Rejeitar Solicitação</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Você está rejeitando a solicitação de {request.solicitante_id.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  placeholder="Motivo da rejeição (opcional)"
                                  value={responseText}
                                  onChange={(e) => setResponseText(e.target.value)}
                                  className="bg-[#0a192f] border-gray-700 text-white"
                                />
                                <div className="flex gap-2 justify-end">
                                  <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                                    Cancelar
                                  </Button>
                                  <Button 
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={() => handleResponse(request._id, 'rejeitado')}
                                  >
                                    Confirmar Rejeição
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}

                      {request.resposta_lider && (
                        <div className="bg-[#0a192f] p-4 rounded-lg mt-4">
                          <p className="text-sm text-gray-400 mb-2">Sua resposta:</p>
                          <p className="text-gray-200">{request.resposta_lider}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            {sentRequests.length === 0 ? (
              <Card className="bg-[#1a2942] border-gray-800">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Nenhuma solicitação enviada ainda</p>
                </CardContent>
              </Card>
            ) : (
              sentRequests.map((request) => (
                <Card key={request._id} className="bg-[#1a2942] border-gray-800 text-white">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={request.projeto_id.avatar} />
                          <AvatarFallback>
                            {request.projeto_id.nome.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{request.projeto_id.nome}</CardTitle>
                          <p className="text-gray-400 text-sm">
                            Líder: {request.lider_id.name}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                          <MessageSquare className="h-4 w-4" />
                          Sua Mensagem
                        </div>
                        <p className="text-gray-200">{request.mensagem}</p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4" />
                        Enviado em: {new Date(request.criado_em).toLocaleDateString('pt-BR')}
                        {request.respondido_em && (
                          <span> • Respondido em: {new Date(request.respondido_em).toLocaleDateString('pt-BR')}</span>
                        )}
                      </div>

                      {request.resposta_lider && (
                        <div className="bg-[#0a192f] p-4 rounded-lg">
                          <p className="text-sm text-gray-400 mb-2">Resposta do líder:</p>
                          <p className="text-gray-200">{request.resposta_lider}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
