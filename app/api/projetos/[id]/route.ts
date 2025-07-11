import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Projeto from "@/models/Projeto";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const projeto = await Projeto.findById(params.id)
      .populate('talento_lider_id', 'name avatar bio')
      .populate('desafio_id', 'title description');

    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(projeto);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao buscar projeto" },
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

    // Verificar se o usuário é o líder do projeto
    const projeto = await Projeto.findById(params.id);
    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    if (projeto.talento_lider_id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Apenas o líder pode editar o projeto" },
        { status: 403 }
      );
    }

    const projetoAtualizado = await Projeto.findByIdAndUpdate(
      params.id,
      { ...updateData, atualizado_em: new Date() },
      { new: true }
    ).populate('talento_lider_id', 'name avatar bio');

    return NextResponse.json(projetoAtualizado);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Falha ao atualizar projeto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await connectDB();

    // Verificar se o usuário é o líder do projeto
    const projeto = await Projeto.findById(params.id);
    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    if (projeto.talento_lider_id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Apenas o líder pode excluir o projeto" },
        { status: 403 }
      );
    }

    await Projeto.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Projeto excluído com sucesso" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Falha ao excluir projeto" },
      { status: 500 }
    );
  }
}
