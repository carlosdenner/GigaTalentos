import { NextResponse } from "next/server"
import { getUserPlaylists, getPlaylist, getPlaylistVideos, createPlaylist } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const playlistId = searchParams.get("playlistId")

  if (playlistId) {
    const playlist = await getPlaylist(playlistId)

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 })
    }

    const videos = await getPlaylistVideos(playlistId)

    return NextResponse.json({
      ...playlist,
      videos,
    })
  }

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const playlists = await getUserPlaylists(userId)
  return NextResponse.json(playlists)
}

export async function POST(request: Request) {
  try {
    const { userId, name } = await request.json()

    if (!userId || !name) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID and playlist name are required",
        },
        { status: 400 },
      )
    }

    const playlist = await createPlaylist(userId, name)

    return NextResponse.json({
      success: true,
      playlist,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create playlist",
      },
      { status: 500 },
    )
  }
}

