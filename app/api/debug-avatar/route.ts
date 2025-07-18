import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    
    const user = await User.findOne({ email: "carlosdenner@gmail.com" }).select("email name avatar");
    
    return NextResponse.json({
      user: user,
      avatarPath: user?.avatar,
      avatarType: typeof user?.avatar
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: "Debug failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
