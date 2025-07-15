import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Video } from "@/models"
import mongoose from "mongoose"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Validate that id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid video ID format" },
        { status: 400 }
      );
    }

    const video = await Video.findById(id)
      .populate('channel_id', 'name avatar category')
      .lean();

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

