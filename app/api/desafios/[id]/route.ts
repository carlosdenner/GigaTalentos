import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { Desafio } from "@/models";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const desafio = await Desafio.findById(id)
      .populate('category', 'name thumbnail')
      .populate('created_by', 'name avatar account_type')
      .lean();

    if (!desafio) {
      return NextResponse.json(
        { error: "Desafio não encontrado" },
        { status: 404 }
      );
    }

    // Type assertion for the desafio object
    const typedDesafio = desafio as any;

    // Calculate days remaining
    const now = new Date()
    const endDate = new Date(typedDesafio.end_date)
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

    // Format prizes for display
    const formattedPrizes = typedDesafio.prizes && typedDesafio.prizes.length > 0 
      ? typedDesafio.prizes[0].value 
      : 'A definir'

    // Count favorites
    const favoritesCount = typedDesafio.favoritos ? typedDesafio.favoritos.length : 0

    const desafioWithStats = {
      ...typedDesafio,
      daysRemaining,
      formattedPrizes,
      favoritesCount
    }

    return NextResponse.json(desafioWithStats);
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
      .populate('created_by', 'name avatar account_type')
      .lean();

    if (!updatedDesafio) {
      return NextResponse.json(
        { error: "Desafio não encontrado após atualização" },
        { status: 404 }
      );
    }

    // Type assertion for the updated desafio object
    const typedUpdatedDesafio = updatedDesafio as any;

    // Calculate stats for the response
    const now = new Date()
    const endDate = new Date(typedUpdatedDesafio.end_date)
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

    const formattedPrizes = typedUpdatedDesafio.prizes && typedUpdatedDesafio.prizes.length > 0 
      ? typedUpdatedDesafio.prizes[0].value 
      : 'A definir'

    const favoritesCount = typedUpdatedDesafio.favoritos ? typedUpdatedDesafio.favoritos.length : 0

    const desafioWithStats = {
      ...typedUpdatedDesafio,
      daysRemaining,
      formattedPrizes,
      favoritesCount
    }

    return NextResponse.json(desafioWithStats);
  } catch (error) {
    console.error('Error updating desafio:', error);
    return NextResponse.json(
      { error: "Falha ao atualizar desafio" },
      { status: 500 }
    );
  }
}
