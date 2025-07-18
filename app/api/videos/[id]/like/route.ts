import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";
import Like from "@/models/Like";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    
    const existingLike = await Like.findOne({
      video_id: params.id,
      user_id: session.user.id
    });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      await Video.findByIdAndUpdate(params.id, { $inc: { likes: -1 } });
      return NextResponse.json({ liked: false });
    }

    await Like.create({
      video_id: params.id,
      user_id: session.user.id
    });
    await Video.findByIdAndUpdate(params.id, { $inc: { likes: 1 } });

    return NextResponse.json({ liked: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process like" },
      { status: 500 }
    );
  }
}