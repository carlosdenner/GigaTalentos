import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video, Category, Channel } from '@/models';

export async function POST() {
  try {
    await connectDB();

    // Get the first category
    const category = await Category.findOne();
    if (!category) {
      return NextResponse.json({ error: 'No categories found' }, { status: 400 });
    }

    // Create a simple channel
    let channel = await Channel.findOne({ name: 'Test YouTube Channel' });
    if (!channel) {
      channel = await Channel.create({
        name: 'Test YouTube Channel',
        description: 'Canal de teste',
        avatar: 'https://example.com/avatar.jpg',
        category: category.name,
        created_at: new Date()
      });
    }

    // Try to insert a single YouTube video manually
    const testVideo = {
      title: 'Teste de Vídeo do YouTube',
      description: 'Vídeo de teste para verificar inserção no banco',
      thumbnail: 'https://img.youtube.com/vi/test123/maxresdefault.jpg',
      channel_id: channel._id,
      views: 1000,
      likes: [],
      video_url: 'https://www.youtube.com/watch?v=test123',
      category: category.name,
      featured: true,
      demo: false,
      tags: ['teste'],
      duration: '10:00',
      youtube_id: 'test123',
      youtube_views: 1000,
      youtube_likes: 50,
      youtube_comments: 10,
      youtube_published_at: new Date(),
      youtube_channel_title: 'Test YouTube Channel',
      youtube_last_updated: new Date(),
      created_at: new Date()
    };

    console.log('About to insert test video:', testVideo);
    const insertedVideo = await Video.create(testVideo);
    console.log('Successfully inserted video:', insertedVideo._id);

    return NextResponse.json({
      message: 'Vídeo de teste criado com sucesso',
      video: {
        id: insertedVideo._id,
        title: insertedVideo.title,
        youtube_id: insertedVideo.youtube_id,
        category: insertedVideo.category,
        channel: channel.name
      },
      debug: {
        categoryUsed: category.name,
        channelCreated: channel._id
      }
    });

  } catch (error) {
    console.error('Error creating test video:', error);
    return NextResponse.json(
      { error: `Erro ao criar vídeo de teste: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
