import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    await connectDB();

    // For testing - check if userId is provided in URL
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');
    
    let userEmail: string | undefined;
    
    if (userIdParam) {
      // Testing mode - use the provided user identifier
      userEmail = userIdParam.includes('@') ? userIdParam : `${userIdParam}@gmail.com`;
    } else {
      // Normal mode - get from session
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
      userEmail = session.user.email;
    }

    const user = await User.findOne({ email: userEmail }).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add some computed fields for the profile
    const profileData = {
      ...user.toObject(),
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      videosCount: 0, // Will be populated by separate API call
      projects_count: 0 // Will be populated by separate API call
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const updates = await request.json();
    await connectDB();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
