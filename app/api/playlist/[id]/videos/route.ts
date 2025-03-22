import { NextResponse } from "next/server"
import { addVideoToPlaylist, removeVideoFromPlaylist } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { videoId } = await request.json()

    if (!videoId) {
      return NextResponse.json(
        {
          success: false,
          error: "Video ID is required",
        },
        { status: 400 },
      )
    }

    const playlistVideo = await addVideoToPlaylist(params.id, videoId)

    return NextResponse.json({
      success: true,
      playlistVideo,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add video to playlist",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get("videoId")

    if (!videoId) {
      return NextResponse.json(
        {
          success: false,
          error: "Video ID is required",
        },
        { status: 400 },
      )
    }

    const success = await removeVideoFromPlaylist(params.id, videoId)

    return NextResponse.json({ success })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to remove video from playlist",
      },
      { status: 500 },
    )
  }
}

