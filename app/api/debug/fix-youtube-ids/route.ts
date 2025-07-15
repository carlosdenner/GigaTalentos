import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video } from '@/models';

export async function POST() {
  try {
    await connectDB();

    // Find videos that have YouTube URLs but missing youtube_id
    const videosWithYouTubeUrls = await Video.find({
      video_url: /youtube\.com\/watch\?v=/,
      $or: [
        { youtube_id: { $exists: false } },
        { youtube_id: null },
        { youtube_id: "" }
      ]
    });

    console.log(`Found ${videosWithYouTubeUrls.length} videos with YouTube URLs but missing youtube_id`);

    const fixedVideos = [];

    for (const video of videosWithYouTubeUrls) {
      try {
        // Extract YouTube ID from URL
        const match = video.video_url.match(/[?&]v=([^&]+)/);
        if (match) {
          const youtubeId = match[1];
          
          // Update the video with the youtube_id
          await Video.findByIdAndUpdate(video._id, {
            youtube_id: youtubeId
          });

          fixedVideos.push({
            id: video._id,
            title: video.title,
            video_url: video.video_url,
            extracted_youtube_id: youtubeId
          });

          console.log(`Fixed video "${video.title}" with YouTube ID: ${youtubeId}`);
        }
      } catch (error) {
        console.error(`Error fixing video ${video._id}:`, error);
      }
    }

    return NextResponse.json({
      message: 'YouTube IDs fixed successfully',
      fixed_count: fixedVideos.length,
      fixed_videos: fixedVideos
    });

  } catch (error) {
    console.error('Error fixing YouTube IDs:', error);
    return NextResponse.json(
      { error: `Error: ${error}` },
      { status: 500 }
    );
  }
}
