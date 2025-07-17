import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { Projeto } from "@/models";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const projeto = await Projeto.findById(id)
      .populate('talento_lider_id', 'name avatar account_type verified bio')
      .populate('criador_id', 'name avatar account_type')
      .populate('sponsors', 'name avatar account_type')
      .populate('participantes_aprovados', 'name avatar account_type skills')
      .populate('portfolio_id', 'name')
      .populate('desafio_id', 'title descricao');

    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(projeto);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: "Falha ao buscar projeto" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const updateData = await request.json();
    await connectDB();

    const { id } = await params;
    // Find the project
    const projeto = await Projeto.findById(id);
    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    // Check if user is the creator or leader of the project
    const isCreator = projeto.criador_id && projeto.criador_id.toString() === session.user.id;
    const isLeader = projeto.talento_lider_id.toString() === session.user.id;

    if (!isCreator && !isLeader) {
      return NextResponse.json(
        { error: "Apenas o criador ou líder do projeto pode editá-lo" },
        { status: 403 }
      );
    }

    // Update the project
    const projetoAtualizado = await Projeto.findByIdAndUpdate(
      id,
      { ...updateData, atualizado_em: new Date() },
      { new: true, runValidators: true }
    )
      .populate('talento_lider_id', 'name avatar account_type verified bio')
      .populate('criador_id', 'name avatar account_type')
      .populate('sponsors', 'name avatar account_type')
      .populate('participantes_aprovados', 'name avatar account_type skills')
      .populate('portfolio_id', 'name')
      .populate('desafio_id', 'title descricao');

    return NextResponse.json(projetoAtualizado);
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: error.message || "Falha ao atualizar projeto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if user is the creator of the project
    if (projeto.criador_id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Apenas o criador do projeto pode deletá-lo" },
        { status: 403 }
      );
    }

    await Projeto.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Projeto deletado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: "Falha ao deletar projeto" },
      { status: 500 }
    );
  }
}
