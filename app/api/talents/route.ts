import { NextResponse } from "next/server"

// Mock database
const talents = [
  { id: "1", title: "Amazing Singer", description: "Beautiful voice", category: "singing", views: 1000, likes: 500 },
  { id: "2", title: "Incredible Dancer", description: "Smooth moves", category: "dancing", views: 800, likes: 400 },
]

export async function GET() {
  return NextResponse.json(talents)
}

export async function POST(request: Request) {
  const talent = await request.json()
  talent.id = String(talents.length + 1)
  talent.views = 0
  talent.likes = 0
  talents.push(talent)
  return NextResponse.json(talent, { status: 201 })
}

