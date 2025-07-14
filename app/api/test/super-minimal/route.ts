import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video } from '@/models';

export async function POST() {
  try {
    await connectDB();

    // Try to create the most minimal YouTube video possible
    const minimalVideo = {
      title: 'Test YouTube Video',
      video_url: 'https://www.youtube.com/watch?v=test123',
      category: 'Test Category',
      youtube_id: 'test123',
      youtube_views: 1000,
      youtube_likes: 50
    };

    console.log('Creating minimal video:', minimalVideo);

    // Check if it already exists
    const existingVideo = await Video.findOne({ youtube_id: 'test123' });
    if (existingVideo) {
      return NextResponse.json({
        message: 'Video already exists',
        existing: true,
        video: {
          id: existingVideo._id,
          youtube_id: existingVideo.youtube_id,
          title: existingVideo.title
        }
      });
    }

    const createdVideo = await Video.create(minimalVideo);
    console.log('✅ Created minimal video:', createdVideo._id);

    return NextResponse.json({
      success: true,
      message: 'Minimal YouTube video created',
      video: {
        id: createdVideo._id,
        title: createdVideo.title,
        youtube_id: createdVideo.youtube_id,
        youtube_views: createdVideo.youtube_views
      }
    });

  } catch (error: any) {
    console.error('Error creating minimal video:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Unknown error',
        stack: error.stack || 'No stack trace',
        name: error.name || 'Error'
      },
      { status: 500 }
    );
  }
}
