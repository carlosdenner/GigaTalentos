import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Favorite from "@/models/Favorite";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    await connectDB();
    await Favorite.findOneAndDelete({
      user_id: session.user.id,
      video_id: videoId
    });

    return NextResponse.json({
      success: true,
      message: "Removed from favorites"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error removing from favorites" },
      { status: 500 }
    );
  }
}


