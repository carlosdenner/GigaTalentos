import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";
import Channel from "@/models/Channel";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "all";

    if (!query) {
      return NextResponse.json({ error: "Query parameter required" }, { status: 400 });
    }

    await connectDB();
    const searchRegex = new RegExp(query, "i");

    let results = [];
    if (type === "videos" || type === "all") {
      const videos = await Video.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex }
        ]
      }).populate('channel_id', 'name avatar');
      results = [...results, ...videos];
    }

    if (type === "channels" || type === "all") {
      const channels = await Channel.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      });
      results = [...results, ...channels];
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}