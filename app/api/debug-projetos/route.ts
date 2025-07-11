import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Projeto from "@/models/Projeto";

export async function GET() {
  try {
    await connectDB();
    
    const projetos = await Projeto.find()
      .populate('talento_lider_id', 'name avatar')
      .populate('criador_id', 'name avatar account_type')
      .populate('sponsors', 'name avatar')
      .populate('portfolio_id', 'name')
      .populate('desafio_id', 'title')
      .sort({ criado_em: -1 })
      .limit(3);

    // Contar projetos por tipo de criador
    const totalProjetos = await Projeto.countDocuments();
    const projetosPorMentores = await Projeto.countDocuments()
      .populate('criador_id')
      .where('criador_id.account_type').equals('mentor');

    return NextResponse.json({
      total: totalProjetos,
      amostra: projetos,
      estatisticas: {
        total: totalProjetos,
        // projetosPorMentores: projetosPorMentores
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: "Erro no debug", details: error },
      { status: 500 }
    );
  }
}
