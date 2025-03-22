import { NextResponse } from "next/server"
import { getChannel, getChannelVideos } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const channel = await getChannel(params.id)

  if (!channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 })
  }

  const videos = await getChannelVideos(params.id)

  return NextResponse.json({
    ...channel,
    videos,
  })
}

