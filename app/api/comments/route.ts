import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/mongodb';
import { Comment } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const video_id = searchParams.get('video_id');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!video_id) {
      return NextResponse.json(
        { error: 'video_id is required' },
        { status: 400 }
      );
    }

    // Get top-level comments (no parent_comment_id)
    const comments = await Comment
      .find({ 
        video_id, 
        parent_comment_id: { $exists: false },
        moderated: { $ne: true }
      })
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(offset)
      .populate('user_id', 'name avatar')
      .lean();

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment
          .find({ parent_comment_id: comment._id })
          .sort({ created_at: 1 })
          .populate('user_id', 'name avatar')
          .lean();
        
        return {
          ...comment,
          replies
        };
      })
    );

    const total = await Comment.countDocuments({ 
      video_id, 
      parent_comment_id: { $exists: false },
      moderated: { $ne: true }
    });

    return NextResponse.json({
      success: true,
      comments: commentsWithReplies,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch comments: ${errorMessage}` },
      { status: 500 }
    );
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
    const { video_id, content, parent_comment_id } = body;

    // Validate required fields
    if (!video_id || !content) {
      return NextResponse.json(
        { error: 'video_id and content are required' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment too long (max 2000 characters)' },
        { status: 400 }
      );
    }

    const user_id = session.user.id;

    // Create comment
    const comment = await Comment.create({
      video_id,
      user_id,
      content: content.trim(),
      parent_comment_id: parent_comment_id || undefined
    });

    // Populate user info for response
    const populatedComment = await Comment
      .findById(comment._id)
      .populate('user_id', 'name avatar')
      .lean();

    console.log(`💬 New comment added to video ${video_id}`);

    return NextResponse.json({
      success: true,
      comment: populatedComment,
      message: 'Comment added successfully'
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to add comment: ${errorMessage}` },
      { status: 500 }
    );
  }
}
