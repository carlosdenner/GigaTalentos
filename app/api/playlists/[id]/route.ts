import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Playlist from "@/models/Playlist";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const playlist = await Playlist.findById(params.id)
      .populate({
        path: "user_id",
        select: "name avatar account_type"
      })
      .populate({
        path: "videos",
        populate: {
          path: "channel_id",
          select: "name avatar"
        }
      });

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // Check if playlist is private
    const session = await getServerSession();
    if (!playlist.is_public && playlist.user_id._id.toString() !== session?.user?.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if current user is following this playlist
    let isFollowing = false;
    if (session?.user?.id) {
      isFollowing = playlist.followers.some(
        (followerId: any) => followerId.toString() === session.user.id
      );
    }

    const playlistData = {
      ...playlist.toObject(),
      isFollowing
    };

    return NextResponse.json(playlistData);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlist" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const updateData = await request.json();
    await connectDB();

    const playlist = await Playlist.findById(params.id);
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // Check ownership
    if (playlist.user_id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Update playlist
    Object.assign(playlist, updateData);
    playlist.updated_at = new Date();
    await playlist.save();

    const updatedPlaylist = await Playlist.findById(playlist._id)
      .populate({
        path: "user_id",
        select: "name avatar account_type"
      })
      .populate({
        path: "videos",
        populate: {
          path: "channel_id",
          select: "name avatar"
        }
      });

    return NextResponse.json(updatedPlaylist);
  } catch (error) {
    console.error("Error updating playlist:", error);
    return NextResponse.json(
      { error: "Failed to update playlist" },
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

    // Check ownership
    if (playlist.user_id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await Playlist.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return NextResponse.json(
      { error: "Failed to delete playlist" },
      { status: 500 }
    );
  }
}
