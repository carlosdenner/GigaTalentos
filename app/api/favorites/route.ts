import { NextResponse } from "next/server"
import { getUserFavorites, addFavorite, removeFavorite } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const favorites = await getUserFavorites(userId)
  return NextResponse.json(favorites)
}

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

    const favorite = await addFavorite(userId, videoId)

    return NextResponse.json({
      success: true,
      favorite,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add favorite",
      },
      { status: 500 },
    )
  }
}

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

    const success = await removeFavorite(userId, videoId)

    return NextResponse.json({ success })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to remove favorite",
      },
      { status: 500 },
    )
  }
}

