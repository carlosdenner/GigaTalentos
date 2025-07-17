import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Favorite, ProjectFavorite, Subscription, UserInteraction, Video, Projeto, Channel, Desafio, User } from "@/models";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    
    const userId = session.user.id;
    const feedItems: any[] = [];

    // 1. Get favorited videos
    const videoFavorites = await Favorite.find({ user_id: userId })
      .populate({
        path: 'video_id',
        populate: {
          path: 'channel_id',
          select: 'name avatar'
        }
      })
      .sort({ created_at: -1 });

    videoFavorites.forEach(fav => {
      if (fav.video_id) {
        const video = fav.video_id as any; // Type assertion for populated document
        feedItems.push({
          type: 'video',
          id: video._id,
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail,
          youtube_id: video.youtube_id,
          video_url: video.video_url,
          views: video.views || video.youtube_views,
          likes: video.likes?.length || video.youtube_likes,
          channel: video.channel_id,
          created_at: fav.created_at,
          action: 'favoritou'
        });
      }
    });

    // 2. Get favorited projects
    const projectFavorites = await ProjectFavorite.find({ user_id: userId })
      .populate({
        path: 'projeto_id',
        populate: [
          {
            path: 'categoria',
            select: 'name'
          },
          {
            path: 'criador_id',
            select: 'name avatar'
          },
          {
            path: 'portfolio_id',
            select: 'name avatar'
          }
        ]
      })
      .sort({ created_at: -1 });

    projectFavorites.forEach(fav => {
      if (fav.projeto_id) {
        const projeto = fav.projeto_id as any; // Type assertion for populated document
        feedItems.push({
          type: 'project',
          id: projeto._id,
          title: projeto.nome,
          description: projeto.descricao,
          thumbnail: projeto.imagem_capa,
          technologies: projeto.tecnologias,
          status: projeto.status,
          likes: projeto.likes?.length || 0,
          category: projeto.categoria,
          creator: projeto.criador_id,
          channel: projeto.portfolio_id,
          demo_url: projeto.demo_url,
          repository_url: projeto.repositorio_url,
          created_at: fav.created_at,
          action: 'favoritou'
        });
      }
    });

    // 3. Get subscribed channels
    const subscriptions = await Subscription.find({ user_id: userId })
      .populate('channel_id')
      .sort({ created_at: -1 });

    subscriptions.forEach(sub => {
      if (sub.channel_id) {
        const channel = sub.channel_id as any; // Type assertion for populated document
        feedItems.push({
          type: 'channel',
          id: channel._id,
          title: channel.name,
          description: channel.description,
          thumbnail: channel.avatar,
          cover_image: channel.cover_image,
          subscribers: channel.subscribers,
          verified: channel.verified,
          category: channel.category,
          created_at: sub.created_at,
          action: 'se inscreveu'
        });
      }
    });

    // 4. Get favorited desafios
    const favoritedDesafios = await Desafio.find({ 
      favoritos: { $in: [userId] } 
    })
      .populate('category', 'name')
      .populate('created_by', 'name avatar')
      .sort({ created_at: -1 });

    favoritedDesafios.forEach(desafio => {
      feedItems.push({
        type: 'desafio',
        id: desafio._id,
        title: desafio.title,
        description: desafio.description,
        difficulty: desafio.difficulty,
        duration: desafio.duration,
        status: desafio.status,
        prizes: desafio.prizes,
        category: desafio.category,
        creator: desafio.created_by,
        start_date: desafio.start_date,
        end_date: desafio.end_date,
        featured: desafio.featured,
        created_at: desafio.created_at,
        action: 'favoritou'
      });
    });

    // 5. Get recent activity from subscribed channels (videos, projects)
    const subscribedChannelIds = subscriptions.map(sub => {
      const channel = sub.channel_id as any;
      return channel._id;
    });
    
    // Recent videos from subscribed channels
    const recentVideos = await Video.find({ 
      channel_id: { $in: subscribedChannelIds },
      created_at: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    })
      .populate('channel_id', 'name avatar')
      .sort({ created_at: -1 })
      .limit(10);

    recentVideos.forEach(video => {
      const videoDoc = video as any;
      feedItems.push({
        type: 'video',
        id: videoDoc._id,
        title: videoDoc.title,
        description: videoDoc.description,
        thumbnail: videoDoc.thumbnail,
        youtube_id: videoDoc.youtube_id,
        video_url: videoDoc.video_url,
        views: videoDoc.views || videoDoc.youtube_views,
        likes: videoDoc.likes?.length || videoDoc.youtube_likes,
        channel: videoDoc.channel_id,
        created_at: videoDoc.created_at,
        action: 'publicou',
        fromSubscription: true
      });
    });

    // Recent projects from subscribed channels
    const recentProjects = await Projeto.find({ 
      portfolio_id: { $in: subscribedChannelIds },
      created_at: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    })
      .populate([
        {
          path: 'categoria',
          select: 'name'
        },
        {
          path: 'criador_id',
          select: 'name avatar'
        },
        {
          path: 'portfolio_id',
          select: 'name avatar'
        }
      ])
      .sort({ created_at: -1 })
      .limit(10);

    recentProjects.forEach(project => {
      const projectDoc = project as any;
      feedItems.push({
        type: 'project',
        id: projectDoc._id,
        title: projectDoc.nome,
        description: projectDoc.descricao,
        thumbnail: projectDoc.imagem_capa,
        technologies: projectDoc.tecnologias,
        status: projectDoc.status,
        likes: projectDoc.likes?.length || 0,
        category: projectDoc.categoria,
        creator: projectDoc.criador_id,
        channel: projectDoc.portfolio_id,
        demo_url: projectDoc.demo_url,
        repository_url: projectDoc.repositorio_url,
        created_at: projectDoc.created_at,
        action: 'publicou',
        fromSubscription: true
      });
    });

    // Sort all feed items by created_at (newest first)
    feedItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Limit to most recent 50 items to prevent overwhelming the feed
    const limitedFeedItems = feedItems.slice(0, 50);

    return NextResponse.json({
      success: true,
      count: limitedFeedItems.length,
      feed: limitedFeedItems
    });

  } catch (error) {
    console.error('Error fetching favorites feed:', error);
    return NextResponse.json({ error: "Failed to fetch favorites feed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { video_id } = body;

    if (!video_id) {
      return NextResponse.json(
        { error: 'video_id is required' },
        { status: 400 }
      );
    }

    const user_id = session.user.id;

    // Check current favorite status
    const existingFavorite = await Favorite.findOne({ user_id, video_id });
    
    if (existingFavorite) {
      return NextResponse.json({
        success: true,
        action: 'already_favorited',
        isFavorited: true,
        message: 'Video already in favorites'
      });
    }

    // Create favorite record
    await Favorite.create({
      user_id,
      video_id,
      created_at: new Date()
    });

    // Track interaction
    await UserInteraction.create({
      user_id,
      content_id: video_id,
      content_type: 'video',
      action: 'favorite',
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      action: 'favorite',
      isFavorited: true,
      message: 'Video favorited successfully'
    });

  } catch (error) {
    console.error('Error favoriting video:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to favorite video: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { video_id } = body;

    if (!video_id) {
      return NextResponse.json(
        { error: 'video_id is required' },
        { status: 400 }
      );
    }

    const user_id = session.user.id;

    // Remove favorite record
    const deleted = await Favorite.deleteOne({ user_id, video_id });
    
    if (deleted.deletedCount === 0) {
      return NextResponse.json({
        success: true,
        action: 'not_favorited',
        isFavorited: false,
        message: 'Video was not in favorites'
      });
    }

    // Track interaction
    await UserInteraction.create({
      user_id,
      content_id: video_id,
      content_type: 'video',
      action: 'unfavorite',
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      action: 'unfavorite',
      isFavorited: false,
      message: 'Video removed from favorites'
    });

  } catch (error) {
    console.error('Error unfavoriting video:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to unfavorite video: ${errorMessage}` },
      { status: 500 }
    );
  }
}

