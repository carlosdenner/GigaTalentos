import { NextResponse } from "next/server"

const categories = [
  { id: "1", name: "Singing", description: "Vocal performances" },
  { id: "2", name: "Dancing", description: "Dance performances" },
  { id: "3", name: "Comedy", description: "Stand-up and sketches" },
  { id: "4", name: "Art", description: "Visual arts and crafts" },
]

export async function GET() {
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const category = await request.json()
  category.id = String(categories.length + 1)
  categories.push(category)
  return NextResponse.json(category, { status: 201 })
}

