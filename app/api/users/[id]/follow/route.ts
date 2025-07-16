import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// POST /api/users/[id]/follow - Follow/unfollow a user
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();

    const targetUserId = new mongoose.Types.ObjectId(params.id);
    const currentUser = await User.findOne({ email: session.user.email });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 });
    }

    // Validate target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Can't follow yourself
    if (currentUser._id.toString() === targetUserId.toString()) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const currentUserId = currentUser._id;
    const isFollowing = currentUser.following?.includes(targetUserId);

    if (isFollowing) {
      // Unfollow: Remove from current user's following and target user's followers
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetUserId }
      });
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUserId }
      });
      
      return NextResponse.json({ 
        message: 'User unfollowed successfully',
        isFollowing: false 
      });
    } else {
      // Follow: Add to current user's following and target user's followers
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: targetUserId }
      });
      await User.findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: currentUserId }
      });
      
      return NextResponse.json({ 
        message: 'User followed successfully',
        isFollowing: true 
      });
    }
  } catch (error) {
    console.error('Follow/unfollow error:', error);
    return NextResponse.json(
      { error: 'Failed to follow/unfollow user' },
      { status: 500 }
    );
  }
}

// GET /api/users/[id]/follow - Check if current user follows target user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ isFollowing: false });
    }

    await connectDB();

    const targetUserId = new mongoose.Types.ObjectId(params.id);
    const currentUser = await User.findOne({ email: session.user.email });
    
    if (!currentUser) {
      return NextResponse.json({ isFollowing: false });
    }

    const isFollowing = currentUser.following?.includes(targetUserId) || false;
    
    return NextResponse.json({ isFollowing });
  } catch (error) {
    console.error('Get follow status error:', error);
    return NextResponse.json({ isFollowing: false });
  }
}
