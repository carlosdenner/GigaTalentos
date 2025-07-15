import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST() {
  try {
    await connectDB();

    // Use raw MongoDB operations to update documents
    const db = mongoose.connection.db;
    const videosCollection = db.collection('videos');

    // Find videos with YouTube URLs but missing youtube_id
    const videosToUpdate = await videosCollection.find({
      video_url: /youtube\.com\/watch\?v=/,
      youtube_id: { $exists: false }
    }).toArray();

    console.log(`Found ${videosToUpdate.length} videos to update`);

    const updateResults = [];

    for (const video of videosToUpdate) {
      try {
        // Extract YouTube ID from URL
        const match = video.video_url.match(/[?&]v=([^&]+)/);
        if (match) {
          const youtubeId = match[1];
          
          // Update using raw MongoDB operation
          const result = await videosCollection.updateOne(
            { _id: video._id },
            { 
              $set: { 
                youtube_id: youtubeId,
                updated_at: new Date()
              } 
            }
          );

          updateResults.push({
            id: video._id.toString(),
            title: video.title,
            video_url: video.video_url,
            youtube_id: youtubeId,
            updated: result.modifiedCount > 0
          });

          console.log(`Updated video "${video.title}" with YouTube ID: ${youtubeId}`);
        }
      } catch (error) {
        console.error(`Error updating video ${video._id}:`, error);
      }
    }

    // Verify the updates worked
    const verifyVideos = await videosCollection.find({
      youtube_id: { $exists: true, $ne: null }
    }).limit(5).toArray();

    return NextResponse.json({
      message: 'Raw MongoDB update completed',
      updated_count: updateResults.length,
      updated_videos: updateResults,
      verification: {
        videos_with_youtube_id: verifyVideos.length,
        sample_videos: verifyVideos.map(v => ({
          title: v.title,
          youtube_id: v.youtube_id,
          video_url: v.video_url
        }))
      }
    });

  } catch (error) {
    console.error('Error in raw MongoDB update:', error);
    return NextResponse.json(
      { error: `Error: ${error}` },
      { status: 500 }
    );
  }
}
