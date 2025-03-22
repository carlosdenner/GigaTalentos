import { NextResponse } from "next/server"

// This would typically fetch from a database
const getTalent = (id: string) => {
  return {
    id,
    title: `Talent ${id}`,
    description: "Amazing performance",
    category: "singing",
    views: 1000,
    likes: 500,
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const talent = getTalent(params.id)
  if (!talent) {
    return NextResponse.json({ error: "Talent not found" }, { status: 404 })
  }
  return NextResponse.json(talent)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const updatedTalent = await request.json()
  // Here you would update the talent in the database
  return NextResponse.json(updatedTalent)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // Here you would delete the talent from the database
  return NextResponse.json({ message: "Talent deleted successfully" })
}

