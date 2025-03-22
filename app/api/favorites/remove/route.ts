import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const videoId = searchParams.get("videoId")

    if (!userId || !videoId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID and Video ID are required",
        },
        { status: 400 },
      )
    }

    const { error } = await supabase.from("favorites").delete().match({ user_id: userId, video_id: videoId })

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
      message: "Removed from favorites",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error removing from favorites",
      },
      { status: 500 },
    )
  }
}

