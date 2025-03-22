import { NextResponse } from "next/server"
import { getVideo } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const video = await getVideo(params.id)

  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 })
  }

  return NextResponse.json(video)
}

