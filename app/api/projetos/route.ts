import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { Projeto } from "@/models";
import { authOptions } from "@/lib/auth";

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
        .populate('categoria', 'name')
        .populate('sponsors', 'name avatar')
        .populate('participantes_aprovados', 'name avatar account_type')
        .populate('portfolio_id', 'name')
        .populate('desafio_id', 'title')
        .sort({ criado_em: -1 });
      return NextResponse.json(portfolioProjetos);
    }
    
    if (userId) {
      const userProjetos = await Projeto.find({ talento_lider_id: userId })
        .populate('talento_lider_id', 'name avatar')
        .populate('criador_id', 'name avatar account_type')
        .populate('categoria', 'name')
        .populate('sponsors', 'name avatar')
        .populate('participantes_aprovados', 'name avatar account_type')
        .populate('portfolio_id', 'name')
        .populate('desafio_id', 'title')
        .sort({ criado_em: -1 });
      return NextResponse.json(userProjetos);
    }

    const projetos = await Projeto.find()
      .populate('talento_lider_id', 'name avatar')
      .populate('criador_id', 'name avatar account_type')
      .populate('categoria', 'name')
      .populate('sponsors', 'name avatar')
      .populate('participantes_aprovados', 'name avatar account_type')
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

    await connectDB();

    // Get user to check account type
    const { User } = require('@/models');
    const user = await User.findById(session.user.id);
    
    if (!user || !['talent', 'mentor'].includes(user.account_type)) {
      return NextResponse.json(
        { error: "Apenas talentos e mentores podem criar projetos" },
        { status: 403 }
      );
    }

    const projetoData = await request.json();

    // Validate required fields
    if (!projetoData.nome || !projetoData.portfolio_id) {
      return NextResponse.json(
        { error: "Nome e Portfolio são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar novo projeto com lógica de liderança
    let projetoCreateData: any = {
      ...projetoData,
      criador_id: session.user.id,
      seguidores: 0,
      favoritos: [],
      participantes_solicitados: [],
      participantes_aprovados: []
    };

    // Definir liderança baseado no tipo de conta
    if (user.account_type === 'talent') {
      // Talents can directly lead projects
      projetoCreateData.talento_lider_id = session.user.id;
      projetoCreateData.lideranca_status = 'ativo';
      projetoCreateData.status = 'ativo';
    } else if (user.account_type === 'mentor') {
      // Mentors create projects but need to delegate leadership
      projetoCreateData.talento_lider_id = null;
      projetoCreateData.lideranca_status = 'procurando_lider';
      projetoCreateData.status = 'pendente_lideranca';
      projetoCreateData.solicitacao_lideranca = {
        status: 'aberta',
        criado_em: new Date()
      };
    }

    const projeto = await Projeto.create(projetoCreateData);

    const populatedProjeto = await Projeto.findById(projeto._id)
      .populate('talento_lider_id', 'name avatar')
      .populate('criador_id', 'name avatar account_type')
      .populate('portfolio_id', 'name')
      .populate('desafio_id', 'title');

    return NextResponse.json(populatedProjeto, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: error.message || "Falha ao criar projeto" },
      { status: 500 }
    );
  }
}
