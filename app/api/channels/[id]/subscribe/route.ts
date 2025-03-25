import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Channel from "@/models/Channel";
import Subscription from "@/models/Subscription";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    
    const existingSub = await Subscription.findOne({
      channel_id: params.id,
      user_id: session.user.id
    });

    if (existingSub) {
      await Subscription.deleteOne({ _id: existingSub._id });
      await Channel.findByIdAndUpdate(params.id, { $inc: { subscribers: -1 } });
      return NextResponse.json({ subscribed: false });
    }

    await Subscription.create({
      channel_id: params.id,
      user_id: session.user.id
    });
    await Channel.findByIdAndUpdate(params.id, { $inc: { subscribers: 1 } });

    return NextResponse.json({ subscribed: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}