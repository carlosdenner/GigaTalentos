import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Channel from "@/models/Channel";

export async function GET() {
  try {
    await connectDB();
    const channels = await Channel.find()
      .sort({ subscribers: -1 })
      .limit(3)
      .select("name avatar subscribers");

    return NextResponse.json(channels);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch featured channels" },
      { status: 500 }
    );
  }
}
