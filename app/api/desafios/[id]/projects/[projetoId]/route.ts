import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { Projeto, Desafio } from "@/models";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; projetoId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { action } = await request.json(); // 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: "Ação inválida. Use 'approve' ou 'reject'" },
        { status: 400 }
      );
    }

    await connectDB();
    
    const { id: desafioId, projetoId } = await params;
    const desafio = await Desafio.findById(desafioId);
    const projeto = await Projeto.findById(projetoId);

    if (!desafio) {
      return NextResponse.json(
        { error: "Desafio não encontrado" },
        { status: 404 }
      );
    }

    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
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

    const status = action === 'approve' ? 'aprovado' : 'rejeitado';

    // Update project status
    projeto.desafio_vinculacao_status = status;
    projeto.desafio_aprovado = action === 'approve';
    if (action === 'approve') {
      projeto.mentor_aprovador_id = new mongoose.Types.ObjectId(session.user.id);
    } else {
      // If rejected, remove the desafio link
      projeto.desafio_id = null;
      projeto.mentor_aprovador_id = null;
    }
    await projeto.save();

    // Update desafio's project links
    const linkIndex = desafio.projetos_vinculados.findIndex(
      (link: any) => link.projeto_id.toString() === projetoId
    );

    if (linkIndex !== -1) {
      desafio.projetos_vinculados[linkIndex].status = status;
      if (action === 'approve') {
        desafio.projetos_vinculados[linkIndex].aprovado_em = new Date();
      }
      await desafio.save();
    }

    return NextResponse.json({
      message: action === 'approve' ? "Vinculação aprovada com sucesso" : "Vinculação rejeitada",
      status: status
    });
  } catch (error) {
    console.error('Error approving/rejecting project link:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
    
    const { id: desafioId } = await params;
    const desafio = await Desafio.findById(desafioId)
      .populate({
        path: 'projetos_vinculados.projeto_id',
        populate: {
          path: 'criador_id',
          select: 'name avatar'
        }
      });

    if (!desafio) {
      return NextResponse.json(
        { error: "Desafio não encontrado" },
        { status: 404 }
      );
    }

    // Check if user is the desafio creator
    if (desafio.created_by.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Apenas o criador do desafio pode ver as solicitações de vinculação" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      projetos_vinculados: desafio.projetos_vinculados
    });
  } catch (error) {
    console.error('Error fetching project links:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
