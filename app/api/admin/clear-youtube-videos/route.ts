import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video } from '@/models';

export async function POST() {
  try {
    await connectDB();

    // Find and delete all YouTube videos that we seeded (based on titles)
    const youtubeVideoTitles = [
      'Como Desenvolver Pensamento Analítico Para Empreendedores',
      'Metodologia Lean Startup: Validação de Ideias de Negócio',
      'Design Thinking Para Inovação Em Negócios',
      'Liderança Inspiradora: Como Motivar Sua Equipe',
      'Resiliência Empreendedora: Como Superar Fracassos',
      'Comunicação Persuasiva Para Empreendedores',
      'Ética Empresarial e Responsabilidade Social'
    ];

    const deleteResult = await Video.deleteMany({
      title: { $in: youtubeVideoTitles }
    });

    return NextResponse.json({
      message: 'YouTube videos cleared successfully',
      deletedCount: deleteResult.deletedCount,
      deletedTitles: youtubeVideoTitles
    });

  } catch (error) {
    console.error('Error clearing YouTube videos:', error);
    return NextResponse.json(
      { error: `Error: ${error}` },
      { status: 500 }
    );
  }
}
