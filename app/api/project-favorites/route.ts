import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import { ProjectFavorite, Projeto } from "@/models";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();
    const favorites = await ProjectFavorite.find({ user_id: session.user.id })
      .populate({
        path: 'projeto_id',
        populate: [
          {
            path: 'talento_lider_id',
            select: 'name avatar'
          },
          {
            path: 'criador_id',
            select: 'name avatar account_type'
          },
          {
            path: 'portfolio_id',
            select: 'name'
          }
        ]
      })
      .sort({ created_at: -1 });

    const projetos = favorites.map(fav => fav.projeto_id).filter(p => p !== null);
    return NextResponse.json(projetos);
  } catch (error) {
    console.error('Error fetching project favorites:', error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { projeto_id } = await request.json();

    if (!projeto_id) {
      return NextResponse.json({ error: "ID do projeto é obrigatório" }, { status: 400 });
    }

    await connectDB();

    // Check if project exists
    const projeto = await Projeto.findById(projeto_id);
    if (!projeto) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
    }

    // Check if already favorited
    const existingFavorite = await ProjectFavorite.findOne({
      user_id: session.user.id,
      projeto_id
    });

    if (existingFavorite) {
      return NextResponse.json({ error: "Projeto já está nos favoritos" }, { status: 400 });
    }

    // Create favorite
    const favorite = await ProjectFavorite.create({
      user_id: session.user.id,
      projeto_id
    });

    return NextResponse.json({ 
      message: "Projeto favoritado com sucesso",
      favorite 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error favoriting project:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "Projeto já está nos favoritos" }, { status: 400 });
    }
    return NextResponse.json({ error: "Falha ao favoritar projeto" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projeto_id = searchParams.get('projeto_id');

    if (!projeto_id) {
      return NextResponse.json({ error: "ID do projeto é obrigatório" }, { status: 400 });
    }

    await connectDB();

    const deleted = await ProjectFavorite.findOneAndDelete({
      user_id: session.user.id,
      projeto_id
    });

    if (!deleted) {
      return NextResponse.json({ error: "Favorito não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Projeto removido dos favoritos com sucesso" });
  } catch (error) {
    console.error('Error unfavoriting project:', error);
    return NextResponse.json({ error: "Falha ao remover favorito" }, { status: 500 });
  }
}
