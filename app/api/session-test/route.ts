import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      session: session,
      user: session?.user,
      hasUserId: !!session?.user?.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Session test error:", error);
    return NextResponse.json(
      { error: "Session test failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
