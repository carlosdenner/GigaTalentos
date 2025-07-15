import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { Projeto, Desafio } from "@/models";
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

    const { desafioId } = await request.json();

    if (!desafioId) {
      return NextResponse.json(
        { error: "ID do desafio é obrigatório" },
        { status: 400 }
      );
    }

    await connectDB();
    
    const { id } = await params;
    const projeto = await Projeto.findById(id);
    const desafio = await Desafio.findById(desafioId);

    if (!projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    if (!desafio) {
      return NextResponse.json(
        { error: "Desafio não encontrado" },
        { status: 404 }
      );
    }

    // Check if user is the project creator
    if (projeto.criador_id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Apenas o criador do projeto pode solicitar vinculação" },
        { status: 403 }
      );
    }

    // Check if project is already linked to this desafio
    if (projeto.desafio_id && projeto.desafio_id.toString() === desafioId) {
      return NextResponse.json(
        { error: "Projeto já está vinculado a este desafio" },
        { status: 400 }
      );
    }

    // Update project with desafio link request
    projeto.desafio_id = desafioId;
    projeto.desafio_vinculacao_status = 'pendente';
    projeto.desafio_solicitado_em = new Date();
    projeto.desafio_aprovado = false;
    await projeto.save();

    // Add project to desafio's pending links
    const existingLink = desafio.projetos_vinculados.find(
      (link: any) => link.projeto_id.toString() === id
    );

    if (!existingLink) {
      desafio.projetos_vinculados.push({
        projeto_id: id,
        status: 'pendente',
        solicitado_em: new Date()
      });
      await desafio.save();
    }

    return NextResponse.json({
      message: "Solicitação de vinculação enviada com sucesso",
      status: 'pendente'
    });
  } catch (error) {
    console.error('Error requesting project-desafio link:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
