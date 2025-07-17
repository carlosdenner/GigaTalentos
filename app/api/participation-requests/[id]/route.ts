import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { ParticipationRequest, Projeto } from "@/models";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { status, resposta_lider } = await request.json();
    const { id } = await params;
    const requestId = id;

    if (!['aprovado', 'rejeitado'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();

    // Find the participation request
    const participationRequest = await ParticipationRequest.findById(requestId)
      .populate('projeto_id')
      .populate('solicitante_id');

    if (!participationRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Check if the current user is the project leader
    if (participationRequest.lider_id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if request is still pending
    if (participationRequest.status !== 'pendente') {
      return NextResponse.json({ error: "Request has already been processed" }, { status: 400 });
    }

    // Update participation request
    participationRequest.status = status;
    participationRequest.resposta_lider = resposta_lider;
    participationRequest.respondido_em = new Date();
    await participationRequest.save();

    // If approved, add user to project participants
    if (status === 'aprovado') {
      await Projeto.findByIdAndUpdate(
        participationRequest.projeto_id._id,
        {
          $addToSet: { 
            participantes_aprovados: participationRequest.solicitante_id._id 
          }
        }
      );
    }

    const updatedRequest = await ParticipationRequest.findById(requestId)
      .populate('projeto_id', 'nome descricao avatar')
      .populate('solicitante_id', 'name avatar skills account_type')
      .populate('lider_id', 'name avatar');

    return NextResponse.json({
      message: `Participation request ${status} successfully`,
      request: updatedRequest
    });
  } catch (error) {
    console.error('Error responding to participation request:', error);
    return NextResponse.json({ error: "Failed to respond to request" }, { status: 500 });
  }
}
