import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from '@/lib/mongodb';
import { Comment, UserInteraction } from '@/models';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { comment_id } = body;

    if (!comment_id) {
      return NextResponse.json(
        { error: 'comment_id is required' },
        { status: 400 }
      );
    }

    const user_id = session.user.id;

    // Find the comment
    const comment = await Comment.findById(comment_id);
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Check if user already liked this comment
    const hasLiked = comment.likes.some((id) => id.toString() === user_id);

    if (hasLiked) {
      // Remove like
      comment.likes = comment.likes.filter((id) => id.toString() !== user_id);
      await comment.save();

      // Track unlike interaction
      await UserInteraction.create({
        user_id,
        content_id: comment_id,
        content_type: 'comment',
        action: 'dislike',
        timestamp: new Date()
      });

      return NextResponse.json({
        success: true,
        action: 'unliked',
        likes_count: comment.likes.length,
        message: 'Comment unliked successfully'
      });
    } else {
      // Add like
      comment.likes.push(new mongoose.Types.ObjectId(user_id));
      await comment.save();

      // Track like interaction
      await UserInteraction.create({
        user_id,
        content_id: comment_id,
        content_type: 'comment',
        action: 'like',
        timestamp: new Date()
      });

      return NextResponse.json({
        success: true,
        action: 'liked',
        likes_count: comment.likes.length,
        message: 'Comment liked successfully'
      });
    }

  } catch (error) {
    console.error('Error liking comment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to like comment: ${errorMessage}` },
      { status: 500 }
    );
  }
}
