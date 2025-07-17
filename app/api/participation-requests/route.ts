import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { ParticipationRequest, Projeto, User } from "@/models";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'sent' | 'received'
    const projeto_id = searchParams.get('projeto_id');

    await connectDB();

    let query: any = {};

    if (type === 'sent') {
      // Requests sent by the user
      query.solicitante_id = session.user.id;
    } else if (type === 'received') {
      // Requests received for projects owned by the user
      query.lider_id = session.user.id;
    } else if (projeto_id) {
      // Requests for a specific project (only if user is the leader)
      const projeto = await Projeto.findById(projeto_id);
      if (!projeto || projeto.talento_lider_id.toString() !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
      query.projeto_id = projeto_id;
    }

    const requests = await ParticipationRequest.find(query)
      .populate('projeto_id', 'nome descricao avatar')
      .populate('solicitante_id', 'name avatar skills account_type')
      .populate('lider_id', 'name avatar')
      .sort({ criado_em: -1 });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching participation requests:', error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const {
      projeto_id,
      mensagem,
      habilidades_oferecidas,
      area_interesse,
      experiencia_relevante
    } = await request.json();

    if (!projeto_id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    await connectDB();

    // Check if project exists
    const projeto = await Projeto.findById(projeto_id).populate('talento_lider_id');
    if (!projeto) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user is trying to request participation in their own project
    if (projeto.talento_lider_id._id.toString() === session.user.id) {
      return NextResponse.json({ error: "Cannot request participation in your own project" }, { status: 400 });
    }

    // Check if user is talent (only talents can request participation)
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.account_type !== 'talent') {
      return NextResponse.json({ error: "Only talents can request project participation" }, { status: 403 });
    }

    // Check if already requested
    const existingRequest = await ParticipationRequest.findOne({
      projeto_id,
      solicitante_id: session.user.id
    });

    if (existingRequest) {
      return NextResponse.json({ error: "You have already requested participation in this project" }, { status: 400 });
    }

    // Create participation request
    const participationRequest = await ParticipationRequest.create({
      projeto_id,
      solicitante_id: session.user.id,
      lider_id: projeto.talento_lider_id._id,
      mensagem,
      habilidades_oferecidas: habilidades_oferecidas || [],
      area_interesse,
      experiencia_relevante
    });

    const populatedRequest = await ParticipationRequest.findById(participationRequest._id)
      .populate('projeto_id', 'nome descricao avatar')
      .populate('solicitante_id', 'name avatar skills account_type')
      .populate('lider_id', 'name avatar');

    return NextResponse.json({
      message: "Participation request sent successfully",
      request: populatedRequest
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating participation request:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "You have already requested participation in this project" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create participation request" }, { status: 500 });
  }
}
