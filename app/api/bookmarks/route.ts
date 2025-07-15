import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/mongodb';
import { UserInteraction } from '@/models';

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

    // Check current bookmark status
    const lastInteraction = await UserInteraction
      .findOne({
        user_id,
        content_id: video_id,
        content_type: 'video',
        action: { $in: ['bookmark', 'unbookmark'] }
      })
      .sort({ timestamp: -1 });

    const currentlyBookmarked = lastInteraction?.action === 'bookmark';
    const newAction = currentlyBookmarked ? 'unbookmark' : 'bookmark';

    // Create interaction record
    await UserInteraction.create({
      user_id,
      content_id: video_id,
      content_type: 'video',
      action: newAction,
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      action: newAction,
      isBookmarked: newAction === 'bookmark',
      message: `Video ${newAction}ed successfully`
    });

  } catch (error) {
    console.error('Error toggling bookmark:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to toggle bookmark: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // This is an alias for the POST endpoint to handle unbookmark
  const body = await request.json();
  
  // Create a new request with unbookmark action
  const modifiedRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify(body)
  });

  return POST(modifiedRequest);
}
