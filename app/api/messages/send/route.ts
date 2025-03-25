import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { receiverId, content } = await request.json();
    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Receiver ID and content are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify sender is a sponsor
    const sender = await User.findById(session.user.id);
    if (sender?.account_type !== 'sponsor') {
      return NextResponse.json(
        { error: "Only sponsors can send messages" },
        { status: 403 }
      );
    }

    const message = await Message.create({
      sender_id: session.user.id,
      receiver_id: receiverId,
      content
    });

    return NextResponse.json({
      message: "Message sent successfully",
      data: message
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}