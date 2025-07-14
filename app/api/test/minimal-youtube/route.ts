import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video, Category, Channel, User } from '@/models';

export async function POST() {
  try {
    await connectDB();

    // Get all categories to see what we have
    const categories = await Category.find({});
    console.log('Available categories:', categories.map(c => c.name));

    // Use the first category
    if (categories.length === 0) {
      return NextResponse.json({ error: 'No categories found' }, { status: 400 });
    }

    const firstCategory = categories[0];
    console.log('Using category:', firstCategory.name);

    // Create or find a test user for the channel
    let testUser = await User.findOne({ email: 'test@youtube.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'YouTube Test User',
        email: 'test@youtube.com',
        password: 'hashed_password',
        account_type: 'talent', // Use valid enum value
        user_type: 'talent', // Use valid enum value
        created_at: new Date()
      });
      console.log('Created test user:', testUser.name);
    }

    // Create or find a channel
    let channel = await Channel.findOne({ name: 'Test YouTube Channel' });
    if (!channel) {
      channel = await Channel.create({
        name: 'Test YouTube Channel',
        description: 'Canal de teste para YouTube',
        avatar: 'https://img.youtube.com/vi/test/1.jpg',
        category: firstCategory.name,
        user_id: testUser._id, // Add the required user_id
        created_at: new Date()
      });
      console.log('Created channel:', channel.name);
    }

    // Try to create one simple YouTube video
    const testYouTubeVideo = {
      title: 'Como Desenvolver Pensamento Analítico Para Empreendedores',
      description: 'Aprenda as técnicas essenciais para desenvolver pensamento crítico e analítico no empreendedorismo.',
      thumbnail: 'https://img.youtube.com/vi/8aGhZQkoFbQ/maxresdefault.jpg',
      channel_id: channel._id,
      views: 15000,
      likes: [],
      video_url: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ',
      category: firstCategory.name,
      category_code: firstCategory.code || 'COGTECH', // Use the category code or fallback
      featured: true,
      demo: false,
      tags: ['pensamento crítico', 'análise', 'empreendedorismo'],
      duration: '15:32',
      youtube_id: '8aGhZQkoFbQ',
      youtube_views: 15000,
      youtube_likes: 750,
      youtube_comments: 45,
      youtube_published_at: new Date('2023-01-15'),
      youtube_channel_title: 'Sebrae',
      youtube_last_updated: new Date(),
      created_at: new Date('2023-01-15')
    };

    console.log('About to create YouTube video:', testYouTubeVideo.title);
    console.log('YouTube ID:', testYouTubeVideo.youtube_id);
    console.log('Category:', testYouTubeVideo.category);
    console.log('Category Code:', testYouTubeVideo.category_code);
    console.log('First category details:', { name: firstCategory.name, code: firstCategory.code });

    // Check if it already exists
    const existingVideo = await Video.findOne({ youtube_id: testYouTubeVideo.youtube_id });
    if (existingVideo) {
      return NextResponse.json({
        message: 'Vídeo já existe',
        video: existingVideo,
        youtube_id: existingVideo.youtube_id
      });
    }

    const createdVideo = await Video.create(testYouTubeVideo);
    console.log('✅ Created video:', createdVideo._id);

    return NextResponse.json({
      message: 'Vídeo do YouTube criado com sucesso',
      video: {
        id: createdVideo._id,
        title: createdVideo.title,
        youtube_id: createdVideo.youtube_id,
        category: createdVideo.category,
        youtube_views: createdVideo.youtube_views,
        channel: createdVideo.youtube_channel_title
      },
      debug: {
        categoryUsed: firstCategory.name,
        categoryCode: firstCategory.code,
        channelUsed: channel.name,
        availableCategories: categories.map(c => ({ name: c.name, code: c.code }))
      }
    });

  } catch (error) {
    console.error('Error creating minimal YouTube video:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Erro: ${errorMessage}` },
      { status: 500 }
    );
  }
}
