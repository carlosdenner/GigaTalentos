import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Playlist from "@/models/Playlist";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const playlist = await Playlist.findById(params.id);
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // Check if already following
    const isFollowing = playlist.followers.includes(session.user.id);
    if (isFollowing) {
      return NextResponse.json({ error: "Already following this playlist" }, { status: 400 });
    }

    // Add follower
    playlist.followers.push(session.user.id);
    await playlist.save();

    return NextResponse.json({ message: "Playlist followed successfully" });
  } catch (error) {
    console.error("Error following playlist:", error);
    return NextResponse.json(
      { error: "Failed to follow playlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const playlist = await Playlist.findById(params.id);
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // Remove follower
    playlist.followers = playlist.followers.filter(
      (followerId: any) => followerId.toString() !== session.user.id
    );
    await playlist.save();

    return NextResponse.json({ message: "Playlist unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing playlist:", error);
    return NextResponse.json(
      { error: "Failed to unfollow playlist" },
      { status: 500 }
    );
  }
}
