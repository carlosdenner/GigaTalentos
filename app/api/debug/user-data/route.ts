import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/mongodb';
import { UserInteraction, Comment, VideoWatch, Favorite } from '@/models';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const user_id = session.user.id;
    const { searchParams } = new URL(request.url);
    const video_id = searchParams.get('video_id');

    // Get all data for the user (and specific video if provided)
    const data: any = {
      user_id,
      authenticated: true,
    };

    if (video_id) {
      data.video_id = video_id;
      
      // Get all interactions for this video
      data.interactions = await UserInteraction.find({
        user_id,
        content_id: video_id,
        content_type: 'video'
      }).sort({ timestamp: -1 }).lean();

      // Get comments by user for this video
      data.comments = await Comment.find({
        user_id,
        video_id
      }).populate('user_id', 'name avatar').sort({ created_at: -1 }).lean();

      // Get watch sessions for this video
      data.watch_sessions = await VideoWatch.find({
        user_id,
        video_id
      }).sort({ last_updated: -1 }).lean();

      // Get favorite status
      data.favorites = await Favorite.find({
        user_id,
        video_id
      }).lean();

    } else {
      // Get overall user data
      data.total_interactions = await UserInteraction.countDocuments({ user_id });
      data.total_comments = await Comment.countDocuments({ user_id });
      data.total_watch_sessions = await VideoWatch.countDocuments({ user_id });
      data.total_favorites = await Favorite.countDocuments({ user_id });

      // Get recent activity
      data.recent_interactions = await UserInteraction.find({ user_id })
        .sort({ timestamp: -1 })
        .limit(10)
        .lean();

      data.recent_comments = await Comment.find({ user_id })
        .populate('user_id', 'name avatar')
        .sort({ created_at: -1 })
        .limit(5)
        .lean();

      data.recent_favorites = await Favorite.find({ user_id })
        .populate('video_id', 'title youtube_id')
        .sort({ created_at: -1 })
        .limit(5)
        .lean();
    }

    return NextResponse.json({
      success: true,
      message: 'User data retrieved successfully',
      data
    });

  } catch (error) {
    console.error('Error checking user data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to check user data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
