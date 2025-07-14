import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video, Category, Channel, User, Desafio, Projeto } from '@/models';

export async function GET() {
  try {
    await connectDB();

    // Count all collections
    const videoCount = await Video.countDocuments();
    const youtubeVideoCount = await Video.countDocuments({ youtube_id: { $exists: true, $ne: null } });
    const categoryCount = await Category.countDocuments();
    const channelCount = await Channel.countDocuments();
    const userCount = await User.countDocuments();
    const desafioCount = await Desafio.countDocuments();
    const projetoCount = await Projeto.countDocuments();

    // Get sample videos to debug
    const sampleVideos = await Video.find({ youtube_id: { $exists: true, $ne: null } })
      .limit(3)
      .select('title youtube_id category youtube_views featured')
      .lean();

    // Get regular videos to see structure
    const regularVideos = await Video.find()
      .limit(3)
      .select('title youtube_id category views featured video_url')
      .lean();

    // Get categories
    const categories = await Category.find()
      .select('name')
      .lean();

    // Get unique categories from existing videos
    const videoCategories = await Video.distinct('category');

    return NextResponse.json({
      status: 'connected',
      counts: {
        videos: videoCount,
        youtubeVideos: youtubeVideoCount,
        categories: categoryCount,
        channels: channelCount,
        users: userCount,
        desafios: desafioCount,
        projetos: projetoCount
      },
      sampleVideos,
      regularVideos,
      categories: categories.map(c => c.name),
      videoCategories, // Categories actually used in videos
      categoryMismatch: {
        inCategoryCollection: categories.map(c => c.name),
        inVideoDocuments: videoCategories
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database status error:', error);
    return NextResponse.json(
      { error: 'Failed to get database status', details: error.message },
      { status: 500 }
    );
  }
}
