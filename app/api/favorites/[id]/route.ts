import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
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


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const result = await Favorite.findOneAndDelete({
      user_id: session.user.id,
      video_id: params.id
    });

    if (!result) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Removed from favorites"
    });
  } catch (error: any) {
    console.error("Delete favorite error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}