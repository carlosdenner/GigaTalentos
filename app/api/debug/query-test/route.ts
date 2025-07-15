import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video } from '@/models';

export async function GET() {
  try {
    await connectDB();

    // Test the exact query that the videos API uses
    const query = { youtube_id: { $exists: true, $ne: null } };
    
    console.log('Testing query:', query);
    
    const videos = await Video.find(query).limit(3);
    console.log('Query result count:', videos.length);
    
    // Also check what youtube_id values exist
    const allVideos = await Video.find({}).select('title youtube_id video_url').limit(10);
    
    const youtubeIdCheck = allVideos.map(video => ({
      title: video.title,
      youtube_id: video.youtube_id,
      youtube_id_type: typeof video.youtube_id,
      has_youtube_id: !!video.youtube_id,
      video_url: video.video_url
    }));

    return NextResponse.json({
      message: 'Query debug test',
      query,
      found_videos: videos.length,
      videos: videos.map(v => ({
        title: v.title,
        youtube_id: v.youtube_id,
        category: v.category,
        video_url: v.video_url
      })),
      youtube_id_check: youtubeIdCheck
    });

  } catch (error) {
    console.error('Error in query debug:', error);
    return NextResponse.json(
      { error: `Error: ${error}` },
      { status: 500 }
    );
  }
}
