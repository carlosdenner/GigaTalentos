import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, CheckCircle, XCircle, User } from 'lucide-react';

interface SolicitacaoLideranca {
  status: 'pendente' | 'aprovado' | 'rejeitado';
  candidato_id?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  mensagem?: string;
  solicitado_em?: string;
}

interface ProjectDelegationManagerProps {
  projeto: {
    _id: string;
    nome: string;
    lideranca_status: 'ativo' | 'buscando_lider' | 'delegacao_pendente';
    status: string;
    criador_id: {
      _id: string;
      name: string;
    };
    talento_lider_id?: {
      _id: string;
      name: string;
      avatar?: string;
    };
    solicitacao_lideranca?: SolicitacaoLideranca;
  };
  currentUserId: string;
  currentUserType: 'talent' | 'mentor' | 'sponsor';
  onUpdate: (updatedProjeto: any) => void;
}

export default function ProjectDelegationManager({
  projeto,
  currentUserId,
  currentUserType,
  onUpdate
}: ProjectDelegationManagerProps) {
  const [loading, setLoading] = useState(false);

  const isCreator = projeto.criador_id._id === currentUserId;
  const isLookingForLeader = projeto.lideranca_status === 'buscando_lider';
  const hasLeadershipRequest = projeto.solicitacao_lideranca?.candidato_id;
  const hasPendingRequest = projeto.solicitacao_lideranca?.status === 'pendente';
  const hasRequestedLeadership = projeto.solicitacao_lideranca?.candidato_id?._id === currentUserId && hasPendingRequest;

  const handleRequestLeadership = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/projetos/${projeto._id}/delegation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh the project data
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao solicitar liderança');
      }
    } catch (error) {
      console.error('Error requesting leadership:', error);
      alert('Erro ao solicitar liderança');
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateAction = async (talentoId: string, action: 'approve' | 'reject') => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/projetos/${projeto._id}/delegation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          talento_id: talentoId,
          action
        })
      });

      if (response.ok) {
        const updatedProjeto = await response.json();
        onUpdate(updatedProjeto);
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao processar solicitação');
      }
    } catch (error) {
      console.error('Error processing candidate:', error);
      alert('Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  if (!isLookingForLeader && projeto.talento_lider_id) {
    // Project has an active leader
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Líder do Projeto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={projeto.talento_lider_id.avatar} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{projeto.talento_lider_id.name}</p>
              <Badge variant="outline" className="text-green-600">
                Líder Ativo
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLookingForLeader) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          Procurando Líder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800">
            Este projeto foi criado por um mentor e precisa de um talento para liderar. 
            Apenas talentos podem se candidatar à liderança.
          </p>
        </div>

        {/* Request Leadership Button for Talents */}
        {currentUserType === 'talent' && !hasRequestedLeadership && (
          <Button 
            onClick={handleRequestLeadership}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Enviando...' : 'Solicitar Liderança do Projeto'}
          </Button>
        )}

        {/* Show if talent already requested */}
        {currentUserType === 'talent' && hasRequestedLeadership && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Você já solicitou a liderança deste projeto. Aguarde a resposta do criador.
            </p>
          </div>
        )}

        {/* Management interface for project creator */}
        {isCreator && hasLeadershipRequest && hasPendingRequest && (
          <div className="space-y-3">
            <h4 className="font-medium">Candidato à Liderança:</h4>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={projeto.solicitacao_lideranca?.candidato_id?.avatar} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{projeto.solicitacao_lideranca?.candidato_id?.name}</p>
                  <p className="text-sm text-gray-500">
                    Solicitado em {projeto.solicitacao_lideranca?.solicitado_em ? 
                      new Date(projeto.solicitacao_lideranca.solicitado_em).toLocaleDateString('pt-BR') : 
                      'Data não disponível'
                    }
                  </p>
                  {projeto.solicitacao_lideranca?.mensagem && (
                    <p className="text-sm text-gray-600 mt-1">
                      "{projeto.solicitacao_lideranca.mensagem}"
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCandidateAction(projeto.solicitacao_lideranca?.candidato_id?._id || '', 'approve')}
                  disabled={loading}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Aprovar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCandidateAction(projeto.solicitacao_lideranca?.candidato_id?._id || '', 'reject')}
                  disabled={loading}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Rejeitar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Show if no candidates yet */}
        {isCreator && !hasLeadershipRequest && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Nenhum talento se candidatou à liderança ainda. 
              Compartilhe o projeto para atrair candidatos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
