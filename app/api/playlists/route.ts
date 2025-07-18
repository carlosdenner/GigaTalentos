import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Playlist from "@/models/Playlist";

export async function GET() {
  try {
    await connectDB();
    
    const playlists = await Playlist.find({ is_public: true })
      .populate({
        path: "user_id",
        select: "name avatar account_type"
      })
      .populate({
        path: "videos",
        select: "title duration thumbnail"
      })
      .sort({ created_at: -1 });

    return NextResponse.json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, is_public = true } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await connectDB();

    const playlist = new Playlist({
      title,
      description,
      user_id: session.user.id,
      is_public,
      videos: [],
      followers: [],
      created_at: new Date(),
      updated_at: new Date()
    });

    await playlist.save();

    return NextResponse.json(playlist);
  } catch (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json(
      { error: "Failed to create playlist" },
      { status: 500 }
    );
  }
}
