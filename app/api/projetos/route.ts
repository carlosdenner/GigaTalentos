import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Projeto from "@/models/Projeto";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const portfolioId = searchParams.get("portfolioId");

    await connectDB();
    
    if (portfolioId) {
      // Buscar projetos de um portfólio específico
      const portfolioProjetos = await Projeto.find({ portfolio_id: portfolioId })
        .populate('talento_lider_id', 'name avatar')
        .populate('criador_id', 'name avatar account_type')
        .populate('sponsors', 'name avatar')
        .populate('portfolio_id', 'name')
        .populate('desafio_id', 'title')
        .sort({ criado_em: -1 });
      return NextResponse.json(portfolioProjetos);
    }
    
    if (userId) {
      const userProjetos = await Projeto.find({ talento_lider_id: userId })
        .populate('talento_lider_id', 'name avatar')
        .populate('criador_id', 'name avatar account_type')
        .populate('sponsors', 'name avatar')
        .populate('portfolio_id', 'name')
        .populate('desafio_id', 'title')
        .sort({ criado_em: -1 });
      return NextResponse.json(userProjetos);
    }

    const projetos = await Projeto.find()
      .populate('talento_lider_id', 'name avatar')
      .populate('criador_id', 'name avatar account_type')
      .populate('sponsors', 'name avatar')
      .populate('portfolio_id', 'name')
      .populate('desafio_id', 'title')
      .sort({ seguidores: -1 });

    return NextResponse.json(projetos);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao buscar projetos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const projetoData = await request.json();
    await connectDB();

    // Criar novo projeto
    const projeto = await Projeto.create({
      ...projetoData,
      talento_lider_id: session.user.id,
      seguidores: 0,
      status: 'ativo'
    });

    return NextResponse.json(projeto, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Falha ao criar projeto" },
      { status: 500 }
    );
  }
}
