import { NextResponse } from "next/server";
import Video from "@/models/Video";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    
    const currentVideo = await Video.findById(params.id).select('channel_id');
    
    if (!currentVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const recommendedVideos = await Video.find({
      channel_id: currentVideo.channel_id,
      _id: { $ne: params.id }
    })
      .populate('channel_id', 'name avatar')
      .select('title video_url views likes thumbnail')
      .limit(5)
      .sort({ views: -1 });

    return NextResponse.json(recommendedVideos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch recommended videos" },
      { status: 500 }
    );
  }
}