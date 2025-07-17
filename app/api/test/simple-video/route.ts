import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video, Category, Channel } from '@/models';

export async function POST() {
  try {
    await connectDB();

    // First, let's just check if we can connect and find a category
    const categories = await Category.find().lean();
    console.log('Found categories:', categories.map(c => c.name));

    if (categories.length === 0) {
      return NextResponse.json({ error: 'No categories found' }, { status: 400 });
    }

    const firstCategory = categories[0];
    console.log('Using category:', firstCategory.name);

    // Try to create a video with minimal required fields only
    const minimalVideo = {
      title: 'Teste YouTube Video Simples',
      video_url: 'https://www.youtube.com/watch?v=test456',
      category: firstCategory.name,
      // Only include fields that are absolutely required
      description: 'Teste de vídeo YouTube',
      views: 0,
      likes: [],
      featured: false,
      demo: false,
      tags: [],
      youtube_id: 'test456',
      created_at: new Date()
    };

    console.log('Creating video with data:', minimalVideo);
    
    // Use create instead of insertMany to get better error messages
    const createdVideo = await Video.create(minimalVideo);
    console.log('Video created successfully:', createdVideo._id);

    return NextResponse.json({
      success: true,
      message: 'Vídeo criado com sucesso',
      video: {
        id: createdVideo._id,
        title: createdVideo.title,
        youtube_id: createdVideo.youtube_id,
        category: createdVideo.category
      }
    });

  } catch (error) {
    console.error('Detailed error creating video:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao criar vídeo',
        details: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
