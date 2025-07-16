import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Channel from "@/models/Channel";
import Video from "@/models/Video";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    await connectDB();

    // For testing - check if userId is provided in URL
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');
    
    let userEmail: string | undefined;
    
    if (userIdParam) {
      // Testing mode - use the provided user identifier
      userEmail = userIdParam.includes('@') ? userIdParam : `${userIdParam}@gmail.com`;
    } else {
      // Normal mode - get from session
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
      userEmail = session.user.email;
    }

    // Find the user by email to get their _id
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Then get all channels owned by the user
    const channels = await Channel.find({ user_id: user._id });
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