import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Playlist from "@/models/Playlist";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const playlists = await Playlist.find({
      user_id: session.user.id,
    }).populate({
      path: "videos",
      populate: {
        path: "channel_id",
        select: "name avatar",
      },
    });

    return NextResponse.json(playlists);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const playlistData = await request.json();
    await connectDB();

    const playlist = await Playlist.create({
      ...playlistData,
      user_id: session.user.id,
    });

    return NextResponse.json(playlist, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create playlist" },
      { status: 500 }
    );
  }
}
