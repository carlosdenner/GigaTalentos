import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Favorite from "@/models/Favorite";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { videoId } = await request.json();
    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user_id: session.user.id,
      video_id: videoId
    });

    if (existingFavorite) {
      return NextResponse.json({
        success: true,
        message: "Already in favorites"
      });
    }

    // Add to favorites
    const favorite = await Favorite.create({
      user_id: session.user.id,
      video_id: videoId
    });

    return NextResponse.json({
      success: true,
      favorite
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error adding to favorites" },
      { status: 500 }
    );
  }
}

