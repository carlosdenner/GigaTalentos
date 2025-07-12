import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const video = await Video.findById(id)
      .populate('channel_id', 'name avatar');
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const { channel_id, ...videoData } = video.toObject();
    const channelData = video.channel_id.toObject();
    
    const formattedVideo = {
      ...videoData,
      id: video._id,
      channel_id: channelData,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    };
      
    return NextResponse.json(formattedVideo);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}