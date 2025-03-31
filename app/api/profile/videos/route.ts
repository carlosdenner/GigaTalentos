import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Channel from "@/models/Channel";
import Video from "@/models/Video";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    // First get all channels owned by the user
    const channels = await Channel.find({ user_id: session.user.id });
    const channelIds = channels.map(channel => channel._id);

    // Then get all videos from these channels
    const videos = await Video.find({ channel_id: { $in: channelIds } })
      .populate('channel_id', 'name')
      .sort({ created_at: -1 })
      .lean();

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching profile videos:', error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}