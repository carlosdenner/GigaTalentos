import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import { Favorite, UserInteraction } from "@/models";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const favorites = await Favorite.find({ user_id: session.user.id })
      .populate({
        path: 'video_id',
        populate: {
          path: 'channel_id',
          select: 'name avatar'
        }
      });

    const videos = favorites.map(fav => fav.video_id);
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
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

