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
        // For talents: Show desafios they can participate in, successful projetos, and learning videos
        const talentDesafios = await Desafio.find({
          status: 'Ativo', // Only active challenges
          $or: [
            { featured: true },
            { participants: { $gte: 10 } },
            ...(userCategories.length > 0 ? [{ category: { $in: userCategories } }] : [])
          ]
        })
        .populate('category', 'name')
        .populate('created_by', 'name account_type') // Show mentor info
        .sort({ participants: -1, featured: -1 })
        .limit(2)
        .lean();

        const talentProjetos = await Projeto.find({
          $or: [
            { likes: { $exists: true, $ne: [] } },
            { status: 'ativo' },
            ...(userCategories.length > 0 ? [{ categoria: { $in: userCategories } }] : [])
          ]
        })
        .populate('talento_lider_id', 'name avatar')
        .populate('portfolio_id', 'name')
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

      case 'mentor':
        // For mentors: Show their own desafios, high-potential projetos, and strategic content
        const mentorDesafios = await Desafio.find({
          $or: [
            { featured: true },
            { participants: { $gte: 20 } }
          ]
        })
        .populate('category', 'name')
        .populate('created_by', 'name account_type')
        .sort({ participants: -1, featured: -1 })
        .limit(3)
        .lean();

        const mentorProjetos = await Projeto.find({
          status: 'ativo'
        })
        .populate('talento_lider_id', 'name avatar')
        .populate('portfolio_id', 'name')
        .limit(2)
        .lean();

        const mentorVideos = await Video.find({
          views: { $gte: 200 }
        })
        .populate('channel_id', 'name avatar category')
        .sort({ views: -1, likes: -1 })
        .limit(1)
        .lean();

        popularContent = [
          ...mentorDesafios.map(item => ({ ...item, type: 'desafio' })),
          ...mentorProjetos.map(item => ({ ...item, type: 'projeto' })),
          ...mentorVideos.map(item => ({ ...item, type: 'video' }))
        ];
        break;

      case 'fan':
        // For fans: Show popular content they can follow and engage with
        const fanProjetos = await Projeto.find({
          status: { $in: ['ativo', 'concluido'] }
        })
        .populate('talento_lider_id', 'name avatar')
        .populate('portfolio_id', 'name')
        .limit(3)
        .lean();

        const fanVideos = await Video.find({
          views: { $gte: 100 }
        })
        .populate('channel_id', 'name avatar category')
        .sort({ views: -1, likes: -1 })
        .limit(2)
        .lean();

        const fanDesafios = await Desafio.find({
          $or: [
            { participants: { $gte: 20 } },
            { featured: true }
          ]
        })
        .populate('category', 'name')
        .populate('created_by', 'name account_type')
        .sort({ participants: -1 })
        .limit(1)
        .lean();

        popularContent = [
          ...fanProjetos.map(item => ({ ...item, type: 'projeto' })),
          ...fanVideos.map(item => ({ ...item, type: 'video' })),
          ...fanDesafios.map(item => ({ ...item, type: 'desafio' }))
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
          $or: [
            { likes: { $exists: true, $ne: [] } },
            { favoritos: { $exists: true, $ne: [] } }
          ]
        })
        .populate('talento_lider_id', 'name avatar')
        .populate('portfolio_id', 'name')
        .limit(2)
        .lean();

        const generalDesafios = await Desafio.find({
          $or: [
            { featured: true },
            { participants: { $gte: 20 } }
          ]
        })
        .populate('category', 'name')
        .populate('created_by', 'name account_type')
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