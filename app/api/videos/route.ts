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
    const youtubeOnly = searchParams.get("youtubeOnly")
    const sortBy = searchParams.get("sortBy") || "youtube_views"
    const order = searchParams.get("order") || "desc"
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    let query: any = {}

    if (channelId) {
      query.channel_id = channelId
    }

    if (category && category !== "all") {
      query.category = category
    }

    if (featured === "true") {
      query.featured = true
    }

    // Filter for YouTube videos only if requested
    if (youtubeOnly === "true") {
      query.youtube_id = { $exists: true, $ne: null }
    }

    // Build sort object
    const sortObj: any = {}
    if (sortBy === "youtube_views" || sortBy === "youtube_likes") {
      sortObj[sortBy] = order === "desc" ? -1 : 1
    } else if (sortBy === "youtube_last_updated") {
      sortObj.youtube_last_updated = order === "desc" ? -1 : 1
    } else if (sortBy === "title") {
      sortObj.title = order === "desc" ? -1 : 1
    } else if (sortBy === "views") {
      sortObj.views = order === "desc" ? -1 : 1
    } else {
      // Default: sort by YouTube views if available, otherwise regular views
      sortObj.youtube_views = -1
    }

    // If requesting YouTube videos only, return simplified format
    if (youtubeOnly === "true") {
      const videos = await Video.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean()

      return NextResponse.json(videos)
    }

    // Original functionality for regular videos
    const videos = await Video.find(query)
      .populate('channel_id', 'name avatar category')
      .sort(sortObj)
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

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      title,
      description,
      thumbnail,
      youtube_id,
      category,
      featured = false,
      tags = []
    } = body;

    // Validate required fields
    if (!title || !youtube_id) {
      return NextResponse.json(
        { error: 'Title and YouTube ID are required' },
        { status: 400 }
      );
    }

    const video = new Video({
      title,
      description,
      thumbnail,
      youtube_id,
      category,
      featured,
      tags,
      youtube_views: 0,
      youtube_likes: 0,
      youtube_channel_title: '',
      duration: '',
      youtube_last_updated: new Date()
    });

    await video.save();

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}

