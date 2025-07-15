import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { Projeto } from "@/models";
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
    const projeto = await Projeto.findById(id);

    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    const userId = session.user.id;
    const hasLiked = projeto.likes.includes(userId);

    if (hasLiked) {
      // Remove like
      projeto.likes = projeto.likes.filter((likeId: string) => likeId.toString() !== userId);
    } else {
      // Add like
      projeto.likes.push(userId);
    }

    await projeto.save();

    return NextResponse.json({
      message: hasLiked ? "Like removido" : "Like adicionado",
      liked: !hasLiked,
      likesCount: projeto.likes.length
    });
  } catch (error) {
    console.error('Error toggling projeto like:', error);
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
    const projeto = await Projeto.findById(id);

    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    const userId = session.user.id;
    const hasLiked = projeto.likes.includes(userId);

    return NextResponse.json({
      liked: hasLiked,
      likesCount: projeto.likes.length
    });
  } catch (error) {
    console.error('Error checking projeto like:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
