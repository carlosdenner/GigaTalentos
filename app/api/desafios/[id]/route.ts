import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { Desafio } from "@/models";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const desafio = await Desafio.findById(id)
      .populate('category', 'name thumbnail')
      .populate('created_by', 'name avatar account_type');

    if (!desafio) {
      return NextResponse.json(
        { error: "Desafio não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(desafio);
  } catch (error) {
    console.error('Error fetching desafio:', error);
    return NextResponse.json(
      { error: "Falha ao buscar desafio" },
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
    const desafio = await Desafio.findById(id);

    if (!desafio) {
      return NextResponse.json(
        { error: "Desafio não encontrado" },
        { status: 404 }
      );
    }

    // Check if user is the creator of the desafio
    if (desafio.created_by.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Apenas o criador do desafio pode deletá-lo" },
        { status: 403 }
      );
    }

    await Desafio.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Desafio deletado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting desafio:', error);
    return NextResponse.json(
      { error: "Falha ao deletar desafio" },
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

    await connectDB();
    
    const { id } = await params;
    const desafio = await Desafio.findById(id);

    if (!desafio) {
      return NextResponse.json(
        { error: "Desafio não encontrado" },
        { status: 404 }
      );
    }

    // Check if user is the creator of the desafio
    if (desafio.created_by.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Apenas o criador do desafio pode editá-lo" },
        { status: 403 }
      );
    }

    const updateData = await request.json();
    updateData.updated_at = new Date();

    const updatedDesafio = await Desafio.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate('category', 'name thumbnail')
      .populate('created_by', 'name avatar account_type');

    return NextResponse.json(updatedDesafio);
  } catch (error) {
    console.error('Error updating desafio:', error);
    return NextResponse.json(
      { error: "Falha ao atualizar desafio" },
      { status: 500 }
    );
  }
}
