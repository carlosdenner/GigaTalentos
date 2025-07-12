import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from '@/lib/mongodb';
import Like from "@/models/Like";
import Video from "@/models/Video";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ isLiked: false });
    }
    
    const like = await Like.findOne({
      video_id: params.id,
      user_id: session.user.id
    });

    return NextResponse.json({ isLiked: !!like });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check like status" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

  
    const existingLike = await Like.findOne({
      video_id: params.id,
      user_id: session.user.id
    });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      await Video.findByIdAndUpdate(params.id, { $inc: { likes: -1 } });
      return NextResponse.json({ isLiked: false, likes: (await Video.findById(params.id)).likes });
    }

    await Like.create({
      video_id: params.id,
      user_id: session.user.id
    });
    await Video.findByIdAndUpdate(params.id, { $inc: { likes: 1 } });
    
    const updatedVideo = await Video.findById(params.id);
    return NextResponse.json({ isLiked: true, likes: updatedVideo.likes });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process like" },
      { status: 500 }
    );
  }
}