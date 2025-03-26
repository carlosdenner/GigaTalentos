import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { receiverId, content } = await request.json();
    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Receiver ID and content are required" },
        { status: 400 }
      );
    }

    // Get user by email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify sender is a sponsor
    if (user.account_type !== 'sponsor') {
      return NextResponse.json(
        { error: "Only sponsors can send messages" },
        { status: 403 }
      );
    }

    // Create message
    const message = await Message.create({
      sender_id: user._id,
      receiver_id: receiverId,
      content,
      created_at: new Date()
    });

    // Populate the message with sender and receiver details
    const populatedMessage = await Message.findById(message._id)
      .populate('sender_id', 'name email avatar account_type')
      .populate('receiver_id', 'name avatar');

    if (!populatedMessage) {
      return NextResponse.json(
        { error: "Failed to create message" },
        { status: 500 }
      );
    }

    return NextResponse.json(populatedMessage);

  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}