import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get("receiverId");

    await connectDB();

    // Get user type
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const messages = await Message.find({
      $or: [
        { sender_id: session.user.id, receiver_id: receiverId },
        { sender_id: receiverId, receiver_id: session.user.id },
      ],
    })
    .sort({ created_at: 1 })
    .populate('sender_id', 'name avatar account_type')
    .populate('receiver_id', 'name avatar');

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { channelId, content } = await request.json();
    if (!channelId || !content) {
      return NextResponse.json(
        { error: "Channel ID and content are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify user is a mentor
    const user = await User.findById(session.user.id);
    if (!user || user.account_type !== 'mentor') {
      return NextResponse.json(
        { error: "Only mentors can send messages" },
        { status: 403 }
      );
    }

    const message = await Message.create({
      sender_id: session.user.id,
      receiver_id: channelId,
      content,
      created_at: new Date(),
      sender_type: user.account_type
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender_id', 'name avatar account_type')
      .populate('receiver_id', 'name avatar');

    return NextResponse.json(populatedMessage);
  } catch (error: any) {
    console.error('Message error:', error);
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
