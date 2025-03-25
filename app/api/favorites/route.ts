import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Favorite from "@/models/Favorite";
import Video from "@/models/Video";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const favorites = await Favorite.find({ user_id: session.user.id })
      .populate({
        path: 'video_id',
        populate: {
          path: 'channel_id',
          select: 'name avatar'
        }
      });

    const videos = favorites.map(fav => fav.video_id);
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

