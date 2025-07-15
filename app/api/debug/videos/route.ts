import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video } from '@/models';

export async function GET() {
  try {
    await connectDB();

    // Get all videos without any filters
    const allVideos = await Video.find({}).lean();
    console.log('Total videos in DB:', allVideos.length);

    // Check YouTube videos specifically
    const youtubeVideos = await Video.find({ 
      youtube_id: { $exists: true, $ne: null } 
    }).lean();
    console.log('YouTube videos found:', youtubeVideos.length);

    // Show a sample video structure
    const sampleVideo = allVideos[0];
    
    return NextResponse.json({
      totalVideos: allVideos.length,
      youtubeVideos: youtubeVideos.length,
      sampleVideo: sampleVideo,
      youtubeVideoIds: youtubeVideos.map(v => v.youtube_id),
      allVideoTitles: allVideos.map(v => v.title),
      debug: {
        hasYoutubeIdField: allVideos.map(v => ({ 
          title: v.title, 
          hasYoutubeId: !!v.youtube_id,
          youtubeIdValue: v.youtube_id 
        }))
      }
    });

  } catch (error) {
    console.error('Error debugging videos:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Erro: ${errorMessage}` },
      { status: 500 }
    );
  }
}
