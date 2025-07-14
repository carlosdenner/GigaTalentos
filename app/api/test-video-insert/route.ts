import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video, Category, Channel } from '@/models';

export async function POST() {
  try {
    await connectDB();

    // Get first category
    const categories = await Category.find({}).limit(1);
    if (categories.length === 0) {
      return NextResponse.json({ error: 'No categories found' }, { status: 400 });
    }

    const category = categories[0];
    console.log('Using category:', category.name);

    // Create a simple channel first
    let channel = await Channel.findOne({ name: 'Test Channel' });
    if (!channel) {
      channel = await Channel.create({
        name: 'Test Channel',
        description: 'Test channel for debugging',
        avatar: '/placeholder.jpg',
        category: category.name,
        created_at: new Date()
      });
      console.log('Created test channel');
    }

    // Try to create a very simple video
    const testVideo = {
      title: 'Test YouTube Video',
      description: 'This is a test video for debugging',
      thumbnail: 'https://img.youtube.com/vi/test123/maxresdefault.jpg',
      channel_id: channel._id,
      views: 1000,
      likes: [],
      video_url: 'https://www.youtube.com/watch?v=test123',
      category: category.name,
      featured: false,
      demo: false,
      tags: ['test'],
      duration: '5:00',
      youtube_id: 'test123',
      youtube_views: 1000,
      youtube_likes: 50,
      youtube_comments: 5,
      youtube_published_at: new Date(),
      youtube_channel_title: 'Test Channel',
      youtube_last_updated: new Date(),
      created_at: new Date()
    };

    console.log('About to create video with data:', JSON.stringify(testVideo, null, 2));

    // Try to create the video
    const createdVideo = await Video.create(testVideo);
    console.log('Video created successfully:', createdVideo._id);

    return NextResponse.json({
      message: 'Test video created successfully',
      video: {
        id: createdVideo._id,
        title: createdVideo.title,
        youtube_id: createdVideo.youtube_id,
        category: createdVideo.category,
        channel: createdVideo.youtube_channel_title
      },
      category: category.name,
      channel: channel.name
    });

  } catch (error) {
    console.error('Error creating test video:', error);
    return NextResponse.json(
      { 
        error: `Failed to create test video: ${error.message}`,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}
