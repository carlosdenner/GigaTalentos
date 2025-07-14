import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video, Desafio, Projeto, User, Channel, Category } from '@/models';

export async function GET() {
  try {
    await connectDB();

    // Get overall statistics
    const stats = await Promise.all([
      User.countDocuments(),
      Video.countDocuments(),
      Projeto.countDocuments(),
      Desafio.countDocuments(),
      Channel.countDocuments(),
      Category.countDocuments()
    ]);

    // Get content engagement stats
    const videoStats = await Video.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' },
          avgViews: { $avg: '$views' },
          avgLikes: { $avg: '$likes' },
          maxViews: { $max: '$views' },
          minViews: { $min: '$views' }
        }
      }
    ]);

    const projetoStats = await Projeto.aggregate([
      {
        $group: {
          _id: null,
          totalFollowers: { $sum: '$seguidores' },
          avgFollowers: { $avg: '$seguidores' },
          maxFollowers: { $max: '$seguidores' },
          totalActive: { $sum: { $cond: [{ $eq: ['$status', 'ativo'] }, 1, 0] } },
          totalCompleted: { $sum: { $cond: [{ $eq: ['$status', 'concluido'] }, 1, 0] } }
        }
      }
    ]);

    const desafioStats = await Desafio.aggregate([
      {
        $group: {
          _id: null,
          totalParticipants: { $sum: '$participants' },
          avgParticipants: { $avg: '$participants' },
          maxParticipants: { $max: '$participants' },
          totalActive: { $sum: { $cond: [{ $eq: ['$status', 'Ativo'] }, 1, 0] } },
          totalFeatured: { $sum: { $cond: ['$featured', 1, 0] } }
        }
      }
    ]);

    // Get user distribution
    const userDistribution = await User.aggregate([
      {
        $group: {
          _id: '$account_type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get content by category
    const videosByCategory = await Video.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          avgViews: { $avg: '$views' }
        }
      },
      { $sort: { totalViews: -1 } }
    ]);

    const projetosByCategory = await Projeto.aggregate([
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 },
          totalFollowers: { $sum: '$seguidores' },
          avgFollowers: { $avg: '$seguidores' }
        }
      },
      { $sort: { totalFollowers: -1 } }
    ]);

    const desafiosByCategory = await Desafio.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalParticipants: { $sum: '$participants' },
          avgParticipants: { $avg: '$participants' }
        }
      },
      { $sort: { totalParticipants: -1 } }
    ]);

    // Get recent content
    const recentVideos = await Video.find()
      .populate('channel_id', 'name')
      .sort({ created_at: -1 })
      .limit(10)
      .select('title views likes category created_at channel_id');

    const recentProjetos = await Projeto.find()
      .populate('talento_lider_id', 'name')
      .sort({ criado_em: -1 })
      .limit(10)
      .select('nome seguidores categoria status criado_em talento_lider_id');

    const recentDesafios = await Desafio.find()
      .sort({ created_at: -1 })
      .limit(10)
      .select('title participants category status featured created_at');

    // Get top performing content
    const topVideos = await Video.find()
      .populate('channel_id', 'name')
      .sort({ views: -1 })
      .limit(10)
      .select('title views likes category channel_id');

    const topProjetos = await Projeto.find()
      .populate('talento_lider_id', 'name')
      .sort({ seguidores: -1 })
      .limit(10)
      .select('nome seguidores categoria status talento_lider_id');

    const topDesafios = await Desafio.find()
      .sort({ participants: -1 })
      .limit(10)
      .select('title participants category status featured');

    // Get users with interactions
    const usersWithInteractions = await User.find({
      'interactionHistory.0': { $exists: true }
    }).select('name account_type interactionHistory').limit(20);

    const interactionStats = usersWithInteractions.reduce((acc, user) => {
      const interactions = user.interactionHistory || [];
      acc.totalInteractions += interactions.length;
      
      interactions.forEach((interaction: any) => {
        acc.byAction[interaction.action] = (acc.byAction[interaction.action] || 0) + 1;
        acc.byContentType[interaction.contentType] = (acc.byContentType[interaction.contentType] || 0) + 1;
      });
      
      return acc;
    }, {
      totalInteractions: 0,
      byAction: {} as Record<string, number>,
      byContentType: {} as Record<string, number>
    });

    return NextResponse.json({
      overview: {
        totalUsers: stats[0],
        totalVideos: stats[1],
        totalProjetos: stats[2],
        totalDesafios: stats[3],
        totalChannels: stats[4],
        totalCategories: stats[5]
      },
      engagement: {
        videos: videoStats[0] || {},
        projetos: projetoStats[0] || {},
        desafios: desafioStats[0] || {}
      },
      distribution: {
        users: userDistribution,
        videosByCategory,
        projetosByCategory,
        desafiosByCategory
      },
      recent: {
        videos: recentVideos,
        projetos: recentProjetos,
        desafios: recentDesafios
      },
      topPerforming: {
        videos: topVideos,
        projetos: topProjetos,
        desafios: topDesafios
      },
      interactions: {
        stats: interactionStats,
        usersWithInteractions: usersWithInteractions.length,
        totalUsers: stats[0]
      }
    });

  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    return NextResponse.json(
      { error: "Erro ao buscar analytics" },
      { status: 500 }
    );
  }
}
