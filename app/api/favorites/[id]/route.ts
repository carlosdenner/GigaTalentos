import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Favorite from "@/models/Favorite";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ isFavorite: false });
    }
    
    const favorite = await Favorite.findOne({
      video_id: params.id,
      user_id: session.user.id
    });

    return NextResponse.json({ isFavorite: !!favorite });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check favorite status" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    
    const existingFavorite = await Favorite.findOne({
      video_id: params.id,
      user_id: session.user.id
    });

    if (existingFavorite) {
      await Favorite.deleteOne({ _id: existingFavorite._id });
      return NextResponse.json({ isFavorite: false });
    }

    await Favorite.create({
      video_id: params.id,
      user_id: session.user.id
    });

    return NextResponse.json({ isFavorite: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process favorite" },
      { status: 500 }
    );
  }
}