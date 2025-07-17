import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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
    console.error("Error fetching public playlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}
