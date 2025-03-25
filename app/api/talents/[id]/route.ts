
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  
  try {
    await connectDB();
    const video = await Video.findById(resolvedParams.id).populate({
      path: "channel_id",
      select: "name avatar category user_id",
    });

    if (!video) {
      return NextResponse.json({ error: "Talent not found" }, { status: 404 });
    }

    // Get related videos from the same category
    const relatedVideos = await Video.find({
      _id: { $ne: video._id },
      channel_id: {
        $in: await Channel.find({ category: video.channel_id.category }).select('_id')
      }
    })
      .populate("channel_id", "name avatar")
      .sort({ views: -1 })
      .limit(3);

    return NextResponse.json({ 
      ...video.toJSON(), 
      user_id: video.channel_id.user_id,
      relatedVideos 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch talent" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  try {
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const updates = await request.json();
    await connectDB();

    const video = await Video.findByIdAndUpdate(
      resolvedParams.id,
      { $set: updates },
      { new: true }
    ).populate("channel_id", "name avatar");

    if (!video) {
      return NextResponse.json({ error: "Talent not found" }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update talent" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  try {
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const video = await Video.findByIdAndDelete(resolvedParams.id);

    if (!video) {
      return NextResponse.json({ error: "Talent not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Talent deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete talent" },
      { status: 500 }
    );
  }
}
