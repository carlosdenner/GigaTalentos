import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { writeFile } from 'fs/promises';
import path from 'path';

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

    // Create a safe filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const safeFileName = `avatar_${session.user.email.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}${fileExtension}`;
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save to public/uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, safeFileName);
    
    // Create directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Write file
    await writeFile(filePath, buffer);
    
    // Create public URL
    const avatarUrl = `/uploads/${safeFileName}`;
    
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
