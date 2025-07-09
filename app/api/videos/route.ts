import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Video, Channel } from "@/models"

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Ensure Channel model is registered
    const ChannelModel = Channel;
    
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get("channelId")
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    let query = {}

    if (channelId) {
      query = { channel_id: channelId }
    }

    if (category) {
      query = { category: category }
    }

    // Get videos with populated channel data
    const videos = await Video.find(query)
      .populate('channel_id', 'name avatar category')
      .sort({ views: -1 })
      .skip(skip)
      .limit(limit)

    const totalCount = await Video.countDocuments(query)

    return NextResponse.json({
      data: videos,
      page,
      limit,
      total: totalCount,
      hasMore: totalCount > skip + limit,
    })
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}

