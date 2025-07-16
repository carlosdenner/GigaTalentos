import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { Projeto, User } from "@/models";
import { authOptions } from "../../../auth/[...nextauth]/route";

// POST: Request participation in a project
export async function POST(
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
    
    const { id } = await params;
    const { mensagem } = await request.json();

    // Get user to check account type
    const user = await User.findById(session.user.id);
    if (!user || !['talent', 'mentor'].includes(user.account_type)) {
      return NextResponse.json(
        { error: "Apenas talentos e mentores podem solicitar participação em projetos" },
        { status: 403 }
      );
    }

    const projeto = await Projeto.findById(id);
    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    // Check if user is the leader
    if (projeto.talento_lider_id.toString() === session.user.id) {
      return NextResponse.json(
        { error: "Você não pode solicitar participação no seu próprio projeto" },
        { status: 400 }
      );
    }

    // Check if already requested or approved
    const existingRequest = projeto.solicitacoes_participacao.find(
      (sol: any) => sol.usuario_id.toString() === session.user.id
    );

    if (existingRequest) {
      return NextResponse.json(
        { error: "Você já solicitou participação neste projeto" },
        { status: 400 }
      );
    }

    // Add participation request
    projeto.solicitacoes_participacao.push({
      usuario_id: new mongoose.Types.ObjectId(session.user.id),
      mensagem: mensagem || '',
      status: 'pendente',
      solicitado_em: new Date()
    });

    // Update simplified array for compatibility
    if (!projeto.participantes_solicitados.includes(new mongoose.Types.ObjectId(session.user.id))) {
      projeto.participantes_solicitados.push(new mongoose.Types.ObjectId(session.user.id));
    }

    await projeto.save();

    const populatedProjeto = await Projeto.findById(id)
      .populate('solicitacoes_participacao.usuario_id', 'name avatar account_type')
      .populate('talento_lider_id', 'name avatar');

    return NextResponse.json({
      message: "Solicitação de participação enviada com sucesso",
      projeto: populatedProjeto
    });

  } catch (error) {
    console.error('Error requesting participation:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET: Get participation requests for a project (only for project leader)
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
    
    const { id } = await params;

    const projeto = await Projeto.findById(id)
      .populate('solicitacoes_participacao.usuario_id', 'name avatar account_type bio skills')
      .populate('talento_lider_id', 'name avatar');

    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    // Check if user is the project leader
    if (projeto.talento_lider_id._id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Apenas o líder do projeto pode ver as solicitações de participação" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      projeto: {
        _id: projeto._id,
        nome: projeto.nome,
        solicitacoes_participacao: projeto.solicitacoes_participacao
      }
    });

  } catch (error) {
    console.error('Error fetching participation requests:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
