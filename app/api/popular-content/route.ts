import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import { Video, Desafio, Projeto, User } from '@/models';
import { authOptions } from '../auth/[...nextauth]/route';
import { 
  calculatePopularityScore, 
  getUserTypeWeights, 
  intelligentShuffle,
  generateRecommendationReasons
} from '@/utils/recommendations';

export async function GET(request: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('userType') || 'other';
    const limit = parseInt(searchParams.get('limit') || '6');

    let popularContent: any[] = [];

    // Get user preferences if logged in
    let userCategories: string[] = [];
    if (session?.user) {
      try {
        const user = await User.findById(session.user.id);
        userCategories = user?.preferences?.categories || [];
      } catch (error) {
        console.log('User not found or preferences unavailable');
      }
    }

    switch (userType) {
      case 'talent':
        // For talents: Show desafios, successful projetos, and learning videos
        const talentDesafios = await Desafio.find({
          $or: [
            { featured: true },
            { participants: { $gte: 50 } },
            ...(userCategories.length > 0 ? [{ category: { $in: userCategories } }] : [])
          ]
        })
        .populate('category', 'name')
        .sort({ participants: -1, featured: -1 })
        .limit(2)
        .lean();

        const talentProjetos = await Projeto.find({
          $or: [
            { seguidores: { $gte: 100 } },
            { status: 'concluido' },
            ...(userCategories.length > 0 ? [{ categoria: { $in: userCategories } }] : [])
          ]
        })
        .populate('talento_lider_id', 'name avatar')
        .populate('portfolio_id', 'name')
        .sort({ seguidores: -1 })
        .limit(2)
        .lean();

        const talentVideos = await Video.find({
          $or: [
            { views: { $gte: 100 } },
            { category: { $in: ['Educação', 'Tutorial', 'Empreendedorismo'] } },
            ...(userCategories.length > 0 ? [{ category: { $in: userCategories } }] : [])
          ]
        })
        .populate('channel_id', 'name avatar category')
        .sort({ views: -1 })
        .limit(2)
        .lean();

        popularContent = [
          ...talentDesafios.map(item => ({ ...item, type: 'desafio' })),
          ...talentProjetos.map(item => ({ ...item, type: 'projeto' })),
          ...talentVideos.map(item => ({ ...item, type: 'video' }))
        ];
        break;

      case 'sponsor':
      case 'fan':
        // For sponsors/fans: Show high-performing projetos, videos, and popular desafios
        const sponsorProjetos = await Projeto.find({
          $or: [
            { seguidores: { $gte: 50 } },
            { sponsors: { $exists: true, $not: { $size: 0 } } },
            ...(userCategories.length > 0 ? [{ categoria: { $in: userCategories } }] : [])
          ]
        })
        .populate('talento_lider_id', 'name avatar')
        .populate('sponsors', 'name avatar')
        .populate('portfolio_id', 'name')
        .sort({ seguidores: -1 })
        .limit(3)
        .lean();

        const sponsorVideos = await Video.find({
          $or: [
            { views: { $gte: 200 } },
            { likes: { $gte: 10 } },
            ...(userCategories.length > 0 ? [{ category: { $in: userCategories } }] : [])
          ]
        })
        .populate('channel_id', 'name avatar category')
        .sort({ views: -1, likes: -1 })
        .limit(2)
        .lean();

        const sponsorDesafios = await Desafio.find({
          $or: [
            { participants: { $gte: 100 } },
            { featured: true },
            ...(userCategories.length > 0 ? [{ category: { $in: userCategories } }] : [])
          ]
        })
        .populate('category', 'name')
        .sort({ participants: -1 })
        .limit(1)
        .lean();

        popularContent = [
          ...sponsorProjetos.map(item => ({ ...item, type: 'projeto' })),
          ...sponsorVideos.map(item => ({ ...item, type: 'video' })),
          ...sponsorDesafios.map(item => ({ ...item, type: 'desafio' }))
        ];
        break;

      default:
        // For anonymous/other users: Show general popular content
        const generalVideos = await Video.find({
          views: { $gte: 100 }
        })
        .populate('channel_id', 'name avatar category')
        .sort({ views: -1 })
        .limit(3)
        .lean();

        const generalProjetos = await Projeto.find({
          seguidores: { $gte: 30 }
        })
        .populate('talento_lider_id', 'name avatar')
        .populate('portfolio_id', 'name')
        .sort({ seguidores: -1 })
        .limit(2)
        .lean();

        const generalDesafios = await Desafio.find({
          $or: [
            { featured: true },
            { participants: { $gte: 50 } }
          ]
        })
        .populate('category', 'name')
        .sort({ participants: -1, featured: -1 })
        .limit(1)
        .lean();

        popularContent = [
          ...generalVideos.map(item => ({ ...item, type: 'video' })),
          ...generalProjetos.map(item => ({ ...item, type: 'projeto' })),
          ...generalDesafios.map(item => ({ ...item, type: 'desafio' }))
        ];
        break;
    }

    // Shuffle and limit results using intelligent algorithm
    const allContentWithScores = popularContent.map(item => ({
      ...item,
      popularityScore: calculatePopularityScore(item),
      recommendationReasons: generateRecommendationReasons(item, userType, userCategories.length > 0)
    }));

    const shuffledContent = intelligentShuffle(
      allContentWithScores,
      (item) => item.popularityScore
    ).slice(0, limit);

    return NextResponse.json({
      data: shuffledContent,
      userType,
      total: shuffledContent.length,
      personalized: userCategories.length > 0 || !!session?.user
    });

  } catch (error) {
    console.error("Error fetching popular content:", error);
    return NextResponse.json(
      { error: "Erro ao buscar conteúdo popular" },
      { status: 500 }
    );
  }
}