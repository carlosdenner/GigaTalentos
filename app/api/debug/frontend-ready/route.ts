import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video } from '@/models';

export async function GET() {
  try {
    await connectDB();

    // Get YouTube videos with proper sorting
    const youtubeVideos = await Video.find({ 
      youtube_id: { $exists: true, $ne: null } 
    })
    .sort({ youtube_views: -1 })
    .limit(5)
    .lean();

    console.log(`Found ${youtubeVideos.length} YouTube videos`);

    const summary = youtubeVideos.map(video => ({
      id: video._id,
      title: video.title,
      category: video.category,
      youtube_id: video.youtube_id,
      youtube_views: video.youtube_views,
      featured: video.featured,
      thumbnail: video.thumbnail
    }));

    return NextResponse.json({
      message: 'YouTube videos ready for frontend',
      count: youtubeVideos.length,
      videos: summary,
      api_endpoint: '/api/videos?youtubeOnly=true',
      frontend_ready: true
    });

  } catch (error) {
    console.error('Error checking YouTube videos:', error);
    return NextResponse.json(
      { error: `Error: ${error}` },
      { status: 500 }
    );
  }
}
