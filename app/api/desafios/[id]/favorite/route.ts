import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { Desafio } from "@/models";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
    
    const { id } = await params;
    const desafio = await Desafio.findById(id);

    if (!desafio) {
      return NextResponse.json(
        { error: "Desafio não encontrado" },
        { status: 404 }
      );
    }

    const userId = session.user.id;
    const hasFavorited = desafio.favoritos.includes(userId);

    if (hasFavorited) {
      // Remove favorite
      desafio.favoritos = desafio.favoritos.filter((favId: string) => favId.toString() !== userId);
    } else {
      // Add favorite
      desafio.favoritos.push(userId);
    }

    await desafio.save();

    return NextResponse.json({
      message: hasFavorited ? "Favorito removido" : "Adicionado aos favoritos",
      favorited: !hasFavorited,
      favoritesCount: desafio.favoritos.length
    });
  } catch (error) {
    console.error('Error toggling desafio favorite:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
    
    const { id } = await params;
    const desafio = await Desafio.findById(id);

    if (!desafio) {
      return NextResponse.json(
        { error: "Desafio não encontrado" },
        { status: 404 }
      );
    }

    const userId = session.user.id;
    const hasFavorited = desafio.favoritos.includes(userId);

    return NextResponse.json({
      favorited: hasFavorited,
      favoritesCount: desafio.favoritos.length
    });
  } catch (error) {
    console.error('Error checking desafio favorite:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
