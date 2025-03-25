import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Channel from "@/models/Channel";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    await connectDB();
    
    if (userId) {
      const userChannel = await Channel.findOne({ user_id: userId })
        .populate('user_id', 'name avatar');
      return NextResponse.json(userChannel ? [userChannel] : []);
    }

    const channels = await Channel.find()
      .populate('user_id', 'name avatar')
      .sort({ subscribers: -1 });

    return NextResponse.json(channels);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch channels" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const channelData = await request.json();
    await connectDB();

    // Check if user already has a channel
    const existingChannel = await Channel.findOne({ user_id: session.user.id });
    if (existingChannel) {
      return NextResponse.json(
        { error: "User already has a channel" },
        { status: 400 }
      );
    }

    // Use the session user id instead of the one from the request
    const channel = await Channel.create({
      ...channelData,
      user_id: session.user.id,
      subscribers: 0
    });

    return NextResponse.json(channel, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create channel" },
      { status: 500 }
    );
  }
}

