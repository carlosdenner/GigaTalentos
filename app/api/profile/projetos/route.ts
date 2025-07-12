import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import { Projeto } from "@/models";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    
    // Buscar projetos onde o usuário é líder ou criador
    const projetos = await Projeto.find({
      $or: [
        { 'talento_lider_id.email': session.user.email },
        { 'criador_id.email': session.user.email }
      ]
    })
    .populate('talento_lider_id', 'name avatar email')
    .populate('criador_id', 'name avatar email account_type')
    .populate('sponsors', 'name avatar')
    .populate('portfolio_id', 'name')
    .populate('desafio_id', 'title')
    .sort({ criado_em: -1 });

    return NextResponse.json(projetos);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
