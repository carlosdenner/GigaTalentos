import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video, Category, Channel } from '@/models';

export async function GET() {
  try {
    await connectDB();

    const videoCount = await Video.countDocuments();
    const youtubeVideoCount = await Video.countDocuments({ youtube_id: { $exists: true, $ne: null } });
    const categoryCount = await Category.countDocuments();
    const channelCount = await Channel.countDocuments();

    const categories = await Category.find({}, 'name').limit(10);
    const videos = await Video.find({}, 'title youtube_id category youtube_views').limit(5);
    const youtubeVideos = await Video.find({ youtube_id: { $exists: true, $ne: null } }, 'title youtube_id category youtube_views').limit(5);

    return NextResponse.json({
      counts: {
        total_videos: videoCount,
        youtube_videos: youtubeVideoCount,
        categories: categoryCount,
        channels: channelCount
      },
      sample_data: {
        categories: categories.map(c => c.name),
        all_videos: videos,
        youtube_videos: youtubeVideos
      },
      database_status: 'connected'
    });

  } catch (error) {
    console.error('Database debug error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      database_status: 'error'
    }, { status: 500 });
  }
}
