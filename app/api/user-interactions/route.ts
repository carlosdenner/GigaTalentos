import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/mongodb';
import { UserInteraction } from '@/models';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const video_id = searchParams.get('video_id');

    if (!video_id) {
      return NextResponse.json(
        { error: 'video_id is required' },
        { status: 400 }
      );
    }

    const user_id = session.user.id;

    // Check user interactions for this video
    const interactions = await UserInteraction.find({
      user_id,
      content_id: video_id,
      content_type: 'video'
    }).lean();

    // Determine user's current state for this video
    const isFavorited = interactions.some(i => i.action === 'favorite' && 
      !interactions.some(ui => ui.action === 'unfavorite' && ui.timestamp > i.timestamp));
    
    const isBookmarked = interactions.some(i => i.action === 'bookmark' && 
      !interactions.some(ui => ui.action === 'unbookmark' && ui.timestamp > i.timestamp));
    
    const hasLiked = interactions.some(i => i.action === 'like' && 
      !interactions.some(ui => ui.action === 'dislike' && ui.timestamp > i.timestamp));

    return NextResponse.json({
      success: true,
      isFavorited,
      isBookmarked,
      hasLiked,
      total_interactions: interactions.length
    });

  } catch (error) {
    console.error('Error checking user interactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to check user interactions: ${errorMessage}` },
      { status: 500 }
    );
  }
}
