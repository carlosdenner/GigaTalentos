import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Channel from "../../../../../models/Channel";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const channel = await Channel.findOne({ user_id: params.id })
      .populate('user_id', 'name avatar');

    if (!channel) {
      return NextResponse.json(null);
    }

    return NextResponse.json(channel);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user's channel" },
      { status: 500 }
    );
  }
}
