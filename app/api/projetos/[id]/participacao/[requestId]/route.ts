import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { Projeto } from "@/models";
import { authOptions } from "../../../../auth/[...nextauth]/route";

// PUT: Approve or reject a participation request
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; requestId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { id, requestId } = await params;
    const { acao, resposta_mensagem } = await request.json(); // acao: 'aprovar' | 'rejeitar'

    const projeto = await Projeto.findById(id);
    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    // Check if user is the project leader
    if (projeto.talento_lider_id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Apenas o líder do projeto pode aprovar/rejeitar solicitações" },
        { status: 403 }
      );
    }

    // Find the participation request
    const solicitacaoIndex = projeto.solicitacoes_participacao.findIndex(
      (sol: any) => sol._id.toString() === requestId
    );

    if (solicitacaoIndex === -1) {
      return NextResponse.json(
        { error: "Solicitação não encontrada" },
        { status: 404 }
      );
    }

    const solicitacao = projeto.solicitacoes_participacao[solicitacaoIndex];
    
    if (solicitacao.status !== 'pendente') {
      return NextResponse.json(
        { error: "Esta solicitação já foi processada" },
        { status: 400 }
      );
    }

    // Update the request status
    projeto.solicitacoes_participacao[solicitacaoIndex].status = acao === 'aprovar' ? 'aprovado' : 'rejeitado';
    projeto.solicitacoes_participacao[solicitacaoIndex].respondido_em = new Date();
    projeto.solicitacoes_participacao[solicitacaoIndex].resposta_mensagem = resposta_mensagem || '';

    // Update simplified arrays for compatibility
    if (acao === 'aprovar') {
      // Add to approved participants
      if (!projeto.participantes_aprovados.includes(solicitacao.usuario_id)) {
        projeto.participantes_aprovados.push(solicitacao.usuario_id);
      }
    }

    // Remove from pending requests array
    projeto.participantes_solicitados = projeto.participantes_solicitados.filter(
      (userId: any) => userId.toString() !== solicitacao.usuario_id.toString()
    );

    await projeto.save();

    const populatedProjeto = await Projeto.findById(id)
      .populate('solicitacoes_participacao.usuario_id', 'name avatar account_type')
      .populate('participantes_aprovados', 'name avatar account_type')
      .populate('talento_lider_id', 'name avatar');

    return NextResponse.json({
      message: `Solicitação ${acao === 'aprovar' ? 'aprovada' : 'rejeitada'} com sucesso`,
      projeto: populatedProjeto
    });

  } catch (error) {
    console.error('Error processing participation request:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE: Cancel a participation request (by the requester)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; requestId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { id, requestId } = await params;

    const projeto = await Projeto.findById(id);
    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    // Find the participation request
    const solicitacaoIndex = projeto.solicitacoes_participacao.findIndex(
      (sol: any) => sol._id.toString() === requestId
    );

    if (solicitacaoIndex === -1) {
      return NextResponse.json(
        { error: "Solicitação não encontrada" },
        { status: 404 }
      );
    }

    const solicitacao = projeto.solicitacoes_participacao[solicitacaoIndex];

    // Check if user owns this request
    if (solicitacao.usuario_id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Você só pode cancelar suas próprias solicitações" },
        { status: 403 }
      );
    }

    // Remove the request
    projeto.solicitacoes_participacao.splice(solicitacaoIndex, 1);

    // Update simplified array
    projeto.participantes_solicitados = projeto.participantes_solicitados.filter(
      (userId: any) => userId.toString() !== session.user.id
    );

    await projeto.save();

    return NextResponse.json({
      message: "Solicitação cancelada com sucesso"
    });

  } catch (error) {
    console.error('Error canceling participation request:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
