import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDB();
    const videos = await Video.find()
      .populate('channel_id', 'name avatar category')
      .sort({ views: -1 });

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch talents" },
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

    const videoData = await request.json();
    await connectDB();

    const video = await Video.create({
      ...videoData,
      views: 0,
      likes: 0,
      user_id: session.user.id
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create talent" },
      { status: 500 }
    );
  }
}

