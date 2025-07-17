import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Channel from "@/models/Channel"; // Mantém o modelo Channel, mas chama de Portfolio na API
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    await connectDB();
    
    if (userId) {
      const userPortfolio = await Channel.findOne({ user_id: userId })
        .populate('user_id', 'name avatar');
      return NextResponse.json(userPortfolio ? [userPortfolio] : []);
    }

    const portfolios = await Channel.find()
      .populate('user_id', 'name avatar')
      .sort({ subscribers: -1 });

    return NextResponse.json(portfolios);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao buscar portfólios" },
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

    const portfolioData = await request.json();
    await connectDB();

    // Check if user already has a portfolio
    const existingPortfolio = await Channel.findOne({ user_id: session.user.id });
    if (existingPortfolio) {
      return NextResponse.json(
        { error: "Usuário já possui um portfólio" },
        { status: 400 }
      );
    }

    // Create portfolio (using Channel model)
    const portfolio = await Channel.create({
      ...portfolioData,
      user_id: session.user.id,
      subscribers: 0
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Falha ao criar portfólio" },
      { status: 500 }
    );
  }
}
