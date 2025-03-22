import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const channelId = searchParams.get("channelId")
  const category = searchParams.get("category")
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const offset = (page - 1) * limit

  let query = supabase.from("videos").select("*, channels(*)")

  if (channelId) {
    query = query.eq("channel_id", channelId)
  }

  if (category) {
    // First get channels in this category
    const { data: channels } = await supabase.from("channels").select("id").eq("category", category)

    if (channels && channels.length > 0) {
      const channelIds = channels.map((c) => c.id)
      query = query.in("channel_id", channelIds)
    }
  }

  const { data, error, count } = await query
    .order("views", { ascending: false })
    .range(offset, offset + limit - 1)
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    page,
    limit,
    total: count || 0,
    hasMore: (count || 0) > offset + limit,
  })
}

