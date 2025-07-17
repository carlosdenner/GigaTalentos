import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// POST /api/upload/avatar - Upload user avatar image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    // For now, we'll use a placeholder URL since we don't have cloud storage configured
    // In production, you would upload to Cloudinary, AWS S3, etc.
    const timestamp = Date.now();
    const fileName = `avatar_${timestamp}_${file.name}`;
    
    // Simulated upload - return a placeholder URL
    // In production, replace this with actual cloud storage upload
    const avatarUrl = `/placeholder-user.jpg`; // For demo purposes
    
    await connectDB();
    
    // Update user's avatar in database
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { avatar: avatarUrl },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Avatar uploaded successfully',
      avatarUrl: avatarUrl 
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}

// GET /api/upload/avatar - Get current user's avatar
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email }).select('avatar');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      avatarUrl: user.avatar || '/placeholder-user.jpg'
    });

  } catch (error) {
    console.error('Get avatar error:', error);
    return NextResponse.json(
      { error: 'Failed to get avatar' },
      { status: 500 }
    );
  }
}
