import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Playlist from "@/models/Playlist";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    
    const playlists = await Playlist.find({ 
      followers: session.user.id,
      is_public: true
    })
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
    console.error("Error fetching followed playlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch followed playlists" },
      { status: 500 }
    );
  }
}
