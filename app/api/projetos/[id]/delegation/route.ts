import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { Projeto, User } from "@/models";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

// Request leadership of a project (for talents)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { mensagem } = await request.json();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user to check if they're a talent
    const user = await User.findById(session.user.id);
    if (!user || user.account_type !== 'talent') {
      return NextResponse.json(
        { error: "Apenas talentos podem solicitar liderança de projetos" },
        { status: 403 }
      );
    }

    // Find the project
    const projeto = await Projeto.findById(params.id);
    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    // Check if project is looking for a leader
    if (projeto.lideranca_status !== 'buscando_lider') {
      return NextResponse.json(
        { error: "Este projeto não está procurando um líder" },
        { status: 400 }
      );
    }

    // Check if user already requested leadership
    if (projeto.solicitacao_lideranca?.candidato_id?.toString() === session.user.id) {
      return NextResponse.json(
        { error: "Você já solicitou a liderança deste projeto" },
        { status: 400 }
      );
    }

    // Add the user as a candidate
    projeto.solicitacao_lideranca = {
      candidato_id: new mongoose.Types.ObjectId(session.user.id),
      mensagem: mensagem || "",
      solicitado_em: new Date(),
      status: 'pendente'
    };

    await projeto.save();

    return NextResponse.json({ message: "Solicitação de liderança enviada com sucesso" });
  } catch (error: any) {
    console.error('Error requesting leadership:', error);
    return NextResponse.json(
      { error: error.message || "Falha ao solicitar liderança" },
      { status: 500 }
    );
  }
}

// Approve/reject leadership request (for project creator/mentor)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
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

    const { talento_id, action } = await request.json(); // action: 'approve' or 'reject'

    // Find the project
    const projeto = await Projeto.findById(params.id);
    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    // Check if user is the project creator
    if (projeto.criador_id?.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Apenas o criador do projeto pode gerenciar solicitações de liderança" },
        { status: 403 }
      );
    }

    // Find the candidate
    if (!projeto.solicitacao_lideranca?.candidato_id) {
      return NextResponse.json(
        { error: "Nenhuma solicitação de liderança encontrada" },
        { status: 404 }
      );
    }

    if (projeto.solicitacao_lideranca.candidato_id.toString() !== talento_id) {
      return NextResponse.json(
        { error: "Candidato não encontrado" },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Approve the candidate and make them the leader
      projeto.talento_lider_id = new mongoose.Types.ObjectId(talento_id);
      projeto.lideranca_status = 'ativo';
      projeto.status = 'ativo';
      
      // Update the request status
      projeto.solicitacao_lideranca.status = 'aprovado';

    } else if (action === 'reject') {
      // Reject the candidate
      projeto.solicitacao_lideranca.status = 'rejeitado';
    }

    await projeto.save();

    const populatedProjeto = await Projeto.findById(projeto._id)
      .populate('talento_lider_id', 'name avatar')
      .populate('criador_id', 'name avatar account_type')
      .populate('solicitacao_lideranca.candidato_id', 'name avatar');

    return NextResponse.json(populatedProjeto);
  } catch (error: any) {
    console.error('Error managing leadership request:', error);
    return NextResponse.json(
      { error: error.message || "Falha ao gerenciar solicitação de liderança" },
      { status: 500 }
    );
  }
}
