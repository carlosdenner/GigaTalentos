import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Channel from "@/models/Channel"; // Portfolio usa o modelo Channel
import Projeto from "@/models/Projeto";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const portfolio = await Channel.findById(params.id)
      .populate('user_id', 'name avatar bio');

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfólio não encontrado" },
        { status: 404 }
      );
    }

    // Buscar projetos deste portfólio
    const projetos = await Projeto.find({ portfolio_id: params.id })
      .populate('desafio_id', 'title')
      .sort({ criado_em: -1 });

    const portfolioComProjetos = {
      ...portfolio.toObject(),
      projetos: projetos
    };

    return NextResponse.json(portfolioComProjetos);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao buscar portfólio" },
      { status: 500 }
    );
  }
}

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

    const updateData = await request.json();
    await connectDB();

    // Verificar se o usuário é o dono do portfólio
    const portfolio = await Channel.findById(params.id);
    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfólio não encontrado" },
        { status: 404 }
      );
    }

    if (portfolio.user_id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Apenas o dono pode editar o portfólio" },
        { status: 403 }
      );
    }

    const portfolioAtualizado = await Channel.findByIdAndUpdate(
      params.id,
      { ...updateData, updated_at: new Date() },
      { new: true }
    ).populate('user_id', 'name avatar bio');

    return NextResponse.json(portfolioAtualizado);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Falha ao atualizar portfólio" },
      { status: 500 }
    );
  }
}
