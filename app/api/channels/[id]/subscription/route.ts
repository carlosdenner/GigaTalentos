import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Subscription from "@/models/Subscription";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ isSubscribed: false });
    }
    
    const subscription = await Subscription.findOne({
      channel_id: params.id,
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