import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video, Desafio, Projeto } from '@/models';
import { 
  calculatePopularityScore, 
  getUserTypeWeights, 
  intelligentShuffle 
} from '@/utils/recommendations';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('userType') || 'other';
    const contentType = searchParams.get('contentType') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10');

    let content: any[] = [];

    // Fetch content based on type
    if (contentType === 'all' || contentType === 'video') {
      const videos = await Video.find()
        .populate('channel_id', 'name')
        .lean();
      content.push(...videos.map(v => ({ ...v, type: 'video' })));
    }

    if (contentType === 'all' || contentType === 'projeto') {
      const projetos = await Projeto.find()
        .populate('talento_lider_id', 'name')
        .lean();
      content.push(...projetos.map(p => ({ ...p, type: 'projeto' })));
    }

    if (contentType === 'all' || contentType === 'desafio') {
      const desafios = await Desafio.find().lean();
      content.push(...desafios.map(d => ({ ...d, type: 'desafio' })));
    }

    // Calculate scores and apply recommendation logic
    const scoredContent = content.map(item => {
      const popularityScore = calculatePopularityScore(item);
      const userWeights = getUserTypeWeights(userType);
      
      let finalScore = popularityScore;
      
      // Apply user type weights
      if (userWeights[item.type as keyof typeof userWeights]) {
        finalScore *= userWeights[item.type as keyof typeof userWeights];
      }

      return {
        ...item,
        popularityScore,
        finalScore,
        recommendationFactors: {
          views: item.views || 0,
          likes: item.likes || 0,
          participants: item.participants || 0,
          seguidores: item.seguidores || 0,
          featured: !!item.featured,
          status: item.status,
          userTypeWeight: userWeights[item.type as keyof typeof userWeights] || 1,
          category: item.category || item.categoria
        }
      };
    });

    // Sort and apply intelligent shuffle
    const shuffledContent = intelligentShuffle(
      scoredContent,
      (item) => item.finalScore
    ).slice(0, limit);

    // Prepare statistics
    const stats = {
      totalContent: content.length,
      byType: {
        video: content.filter(c => c.type === 'video').length,
        projeto: content.filter(c => c.type === 'projeto').length,
        desafio: content.filter(c => c.type === 'desafio').length
      },
      averageScores: {
        popularity: scoredContent.reduce((sum, c) => sum + c.popularityScore, 0) / scoredContent.length,
        final: scoredContent.reduce((sum, c) => sum + c.finalScore, 0) / scoredContent.length
      },
      userTypeWeights: getUserTypeWeights(userType)
    };

    return NextResponse.json({
      userType,
      contentType,
      recommendations: shuffledContent,
      statistics: stats,
      algorithm: {
        description: "Intelligent recommendation algorithm combining popularity scores with user-type weights and smart shuffling",
        factors: [
          "Content engagement (views, likes, participants)",
          "Recency bonus for newer content",
          "Featured content boost",
          "User type specific weights",
          "Category matching (if user logged in)",
          "Intelligent shuffling maintaining quality order"
        ]
      }
    });

  } catch (error) {
    console.error("Error in recommendation testing:", error);
    return NextResponse.json(
      { error: "Erro ao testar sistema de recomendações" },
      { status: 500 }
    );
  }
}
