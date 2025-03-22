import { NextResponse } from "next/server"
import { getChannels } from "@/lib/supabase"

export async function GET() {
  const channels = await getChannels()
  return NextResponse.json(channels)
}

