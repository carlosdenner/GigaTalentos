import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { Desafio, Projeto } from "@/models";
import { authOptions } from "@/lib/auth";

// PUT: Approve or reject a project linking request
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; projectId: string }> }
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
    
    const { id, projectId } = await params;
    const { acao, resposta_mensagem } = await request.json(); // acao: 'aprovar' | 'rejeitar'

    const desafio = await Desafio.findById(id);
    if (!desafio) {
      return NextResponse.json(
        { error: "Desafio não encontrado" },
        { status: 404 }
      );
    }

    // Check if user is the desafio creator
    if (desafio.created_by.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Apenas o criador do desafio pode aprovar/rejeitar vinculações" },
        { status: 403 }
      );
    }

    // Find the project linking request
    const vinculacaoIndex = desafio.projetos_vinculados.findIndex(
      (pv: any) => pv.projeto_id.toString() === projectId
    );

    if (vinculacaoIndex === -1) {
      return NextResponse.json(
        { error: "Solicitação de vinculação não encontrada" },
        { status: 404 }
      );
    }

    const vinculacao = desafio.projetos_vinculados[vinculacaoIndex];
    
    if (vinculacao.status !== 'pendente') {
      return NextResponse.json(
        { error: "Esta solicitação já foi processada" },
        { status: 400 }
      );
    }

    // Update the linking request status
    desafio.projetos_vinculados[vinculacaoIndex].status = acao === 'aprovar' ? 'aprovado' : 'rejeitado';
    desafio.projetos_vinculados[vinculacaoIndex].aprovado_em = new Date();
    desafio.projetos_vinculados[vinculacaoIndex].resposta_mensagem = resposta_mensagem || '';

    // Update the project
    const projeto = await Projeto.findById(projectId);
    if (projeto) {
      projeto.desafio_vinculacao_status = acao === 'aprovar' ? 'aprovado' : 'rejeitado';
      projeto.desafio_aprovado = acao === 'aprovar';
      if (acao === 'aprovar') {
        projeto.mentor_aprovador_id = new mongoose.Types.ObjectId(session.user.id);
      } else {
        // If rejected, remove the desafio reference
        projeto.desafio_id = null;
        projeto.mentor_aprovador_id = null;
      }
      await projeto.save();
    }

    await desafio.save();

    const populatedDesafio = await Desafio.findById(id)
      .populate('projetos_vinculados.projeto_id', 'nome descricao criador_id')
      .populate('created_by', 'name avatar');

    return NextResponse.json({
      message: `Vinculação ${acao === 'aprovar' ? 'aprovada' : 'rejeitada'} com sucesso`,
      desafio: populatedDesafio
    });

  } catch (error) {
    console.error('Error processing project link request:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET: Get project linking requests for a desafio (only for desafio creator)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; projectId: string }> }
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
    
    const { id } = await params;

    const desafio = await Desafio.findById(id)
      .populate('projetos_vinculados.projeto_id', 'nome descricao objetivo criador_id talento_lider_id')
      .populate('created_by', 'name avatar');

    if (!desafio) {
      return NextResponse.json(
        { error: "Desafio não encontrado" },
        { status: 404 }
      );
    }

    // Check if user is the desafio creator
    if (desafio.created_by._id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Apenas o criador do desafio pode ver as solicitações de vinculação" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      desafio: {
        _id: desafio._id,
        title: desafio.title,
        projetos_vinculados: desafio.projetos_vinculados
      }
    });

  } catch (error) {
    console.error('Error fetching project link requests:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
