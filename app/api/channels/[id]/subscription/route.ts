import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import Channel from "@/models/Channel";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    console.log('GET subscription - Session:', session?.user);
    
    if (!session?.user?.id) {
      return NextResponse.json({ isSubscribed: false });
    }
    
    await connectDB();
    
    const subscription = await Subscription.findOne({
      channel_id: id,
      user_id: session.user.id
    });

    return NextResponse.json({ isSubscribed: !!subscription });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check subscription status" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    console.log('Session in subscription API:', session);
    
    if (!session?.user?.id) {
      console.log('No session or user ID found');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log('User ID:', session.user.id, 'Channel ID:', id);

    await connectDB();

    // Check if channel exists
    const channel = await Channel.findById(id);
    if (!channel) {
      return NextResponse.json(
        { error: "Channel not found" },
        { status: 404 }
      );
    }

    // Prevent users from following their own channel
    if (channel.user_id.toString() === session.user.id) {
      return NextResponse.json(
        { error: "Cannot follow your own channel" },
        { status: 400 }
      );
    }

    const existingSubscription = await Subscription.findOne({
      channel_id: id,
      user_id: session.user.id
    });

    if (existingSubscription) {
      // Unfollow - remove subscription
      await Subscription.deleteOne({
        channel_id: id,
        user_id: session.user.id
      });

      // Update channel subscriber count
      await Channel.findByIdAndUpdate(id, {
        $inc: { subscribers: -1 }
      });

      return NextResponse.json({ 
        isSubscribed: false, 
        message: "Successfully unfollowed channel" 
      });
    } else {
      // Follow - create subscription
      await Subscription.create({
        channel_id: id,
        user_id: session.user.id,
        notifications_enabled: true,
        subscribed_at: new Date()
      });

      // Update channel subscriber count
      await Channel.findByIdAndUpdate(id, {
        $inc: { subscribers: 1 }
      });

      return NextResponse.json({ 
        isSubscribed: true, 
        message: "Successfully followed channel" 
      });
    }
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}