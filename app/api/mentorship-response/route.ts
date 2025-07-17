import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

    const { messageId, action } = await req.json(); // action: 'accept' or 'reject'

    if (!messageId || !action) {
      return NextResponse.json(
        { error: "ID da mensagem e ação são obrigatórios" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the mentorship request message
    const message = await Message.findById(messageId);
    if (!message) {
      return NextResponse.json({ error: "Mensagem não encontrada" }, { status: 404 });
    }

    // Verify the current user is the intended recipient
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || message.destinatario.toString() !== currentUser._id.toString()) {
      return NextResponse.json({ 
        error: "Não autorizado a responder esta solicitação" 
      }, { status: 403 });
    }

    // Verify message has metadata
    if (!message.metadata || !message.metadata.projeto_id) {
      return NextResponse.json({ 
        error: "Dados da solicitação inválidos" 
      }, { status: 400 });
    }

    // Get the project
    const projeto = await Projeto.findById(message.metadata.projeto_id);
    if (!projeto) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
    }

    if (action === 'accept') {
      // Add mentor as sponsor to the project
      if (!projeto.sponsors) {
        projeto.sponsors = [];
      }
      
      // Check if already a sponsor
      const isAlreadySponsor = projeto.sponsors.some(
        (sponsorId: any) => sponsorId.toString() === currentUser._id.toString()
      );

      if (!isAlreadySponsor) {
        projeto.sponsors.push(currentUser._id);
        await projeto.save();
      }

      // Update message status
      if (message.metadata) {
        message.metadata.status = 'accepted';
        await message.save();
      }

      // Send confirmation message back to project leader
      const confirmationMessage = new Message({
        remetente: currentUser._id,
        destinatario: message.remetente,
        assunto: `Mentoria Aceita - Projeto: ${projeto.nome}`,
        mensagem: `Ótimas notícias! ${currentUser.name} aceitou ser mentor/sponsor do projeto "${projeto.nome}".

Agora você pode contar com orientação e suporte especializado para o desenvolvimento do seu projeto.`,
        tipo: "mentorship_response",
        data_envio: new Date(),
        lida: false
      });

      await confirmationMessage.save();

      return NextResponse.json({
        success: true,
        message: "Mentoria aceita com sucesso!",
        project: projeto.nome
      });

    } else if (action === 'reject') {
      // Update message status
      if (message.metadata) {
        message.metadata.status = 'rejected';
        await message.save();
      }

      // Send rejection message back to project leader
      const rejectionMessage = new Message({
        remetente: currentUser._id,
        destinatario: message.remetente,
        assunto: `Solicitação de Mentoria - Projeto: ${projeto.nome}`,
        mensagem: `${currentUser.name} não pode ser mentor do projeto "${projeto.nome}" no momento.

Obrigado pelo convite e sucesso com o projeto!`,
        tipo: "mentorship_response",
        data_envio: new Date(),
        lida: false
      });

      await rejectionMessage.save();

      return NextResponse.json({
        success: true,
        message: "Solicitação rejeitada."
      });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });

  } catch (error) {
    console.error("Error responding to mentorship request:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
