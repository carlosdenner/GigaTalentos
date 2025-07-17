import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";
import Projeto from "@/models/Projeto";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { projeto_id, mentor_id, mensagem } = await req.json();

    if (!projeto_id || !mentor_id || !mensagem) {
      return NextResponse.json(
        { error: "Projeto, mentor e mensagem são obrigatórios" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify that the project exists and the user is the project leader
    const projeto = await Projeto.findById(projeto_id);
    if (!projeto) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
    }

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    if (projeto.talento_lider_id.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ 
        error: "Apenas o líder do projeto pode solicitar mentoria" 
      }, { status: 403 });
    }

    // Verify mentor exists
    const mentor = await User.findById(mentor_id);
    if (!mentor) {
      return NextResponse.json({ error: "Mentor não encontrado" }, { status: 404 });
    }

    // Check if mentor is already a sponsor
    const isAlreadySponsor = projeto.sponsors?.some(
      (sponsorId: any) => sponsorId.toString() === mentor_id
    );

    if (isAlreadySponsor) {
      return NextResponse.json({ 
        error: "Este mentor já é sponsor do projeto" 
      }, { status: 400 });
    }

    // Create a message for the mentorship request
    const mentorshipMessage = new Message({
      remetente: currentUser._id,
      destinatario: mentor._id,
      assunto: `Solicitação de Mentoria - Projeto: ${projeto.nome}`,
      mensagem: `Olá ${mentor.name},

${currentUser.name} está convidando você para ser mentor/sponsor do projeto "${projeto.nome}".

Mensagem do líder do projeto:
"${mensagem}"

Detalhes do projeto:
- Nome: ${projeto.nome}
- Categoria: ${projeto.categoria}
- Tecnologias: ${projeto.tecnologias?.join(", ") || "Não especificadas"}
- Participantes: ${projeto.participantes_aprovados?.length || 0}

Para aceitar ou recusar esta solicitação, acesse a plataforma e responda a esta mensagem.`,
      tipo: "mentorship_request",
      metadata: {
        projeto_id: projeto._id,
        tipo_solicitacao: "mentorship",
        status: "pending"
      },
      data_envio: new Date(),
      lida: false
    });

    await mentorshipMessage.save();

    return NextResponse.json({
      success: true,
      message: "Solicitação de mentoria enviada com sucesso",
      messageId: mentorshipMessage._id
    });

  } catch (error) {
    console.error("Error creating mentorship request:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
