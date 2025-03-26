import { NextResponse } from 'next/server';
import Video from '@/models/Video';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
   const video = await Video.findById(params.id);
   const { channel_id, ...videoData } = video.toObject();
    const channel = await video.populate('channel_id', 'name avatar');
    const channelData = channel.channel_id.toObject();
    const videoWithChannel = {
      ...videoData,
      channel: {
        ...channelData,
        id: channelData._id,
      },
    };
    const formattedVideo = {
      ...videoWithChannel,
      id: video._id,
      channel_id: channel._id,
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