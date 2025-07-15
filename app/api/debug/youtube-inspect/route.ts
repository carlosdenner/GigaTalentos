import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video } from '@/models';

export async function GET() {
  try {
    await connectDB();

    // Find videos that should have YouTube IDs
    const youtubeVideos = await Video.find({
      title: { $regex: /Como Desenvolver Pensamento Analítico|Metodologia Lean Startup|Design Thinking/i }
    }).limit(3);

    return NextResponse.json({
      message: 'YouTube video inspection',
      count: youtubeVideos.length,
      videos: youtubeVideos.map(video => ({
        id: video._id,
        title: video.title,
        youtube_id: video.youtube_id,
        youtube_id_type: typeof video.youtube_id,
        youtube_id_exists: !!video.youtube_id,
        video_url: video.video_url,
        youtube_views: video.youtube_views,
        rawFields: {
          youtube_id: video.youtube_id,
          video_url: video.video_url,
          youtube_views: video.youtube_views,
          youtube_channel_title: video.youtube_channel_title
        }
      }))
    });

  } catch (error) {
    console.error('Error inspecting YouTube videos:', error);
    return NextResponse.json(
      { error: `Error: ${error}` },
      { status: 500 }
    );
  }
}
