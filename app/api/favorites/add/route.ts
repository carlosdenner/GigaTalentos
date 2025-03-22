import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { userId, videoId } = await request.json()

    if (!userId || !videoId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID and Video ID are required",
        },
        { status: 400 },
      )
    }

    // Check if already favorited
    const { data: existingFavorite } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .eq("video_id", videoId)
      .single()

    if (existingFavorite) {
      return NextResponse.json({
        success: true,
        message: "Already in favorites",
      })
    }

    // Add to favorites
    const { data, error } = await supabase.from("favorites").insert({ user_id: userId, video_id: videoId }).select()

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      favorite: data[0],
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error adding to favorites",
      },
      { status: 500 },
    )
  }
}

