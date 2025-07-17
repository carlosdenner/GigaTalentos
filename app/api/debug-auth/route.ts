import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Debug session check:', {
      hasSession: !!session,
      user: session?.user,
      userId: session?.user?.id
    });
    
    return NextResponse.json({
      authenticated: !!session,
      user: session?.user || null,
      debug: {
        hasSession: !!session,
        hasUser: !!session?.user,
        hasUserId: !!session?.user?.id,
        userIdType: typeof session?.user?.id
      }
    });
  } catch (error) {
    console.error('Debug auth error:', error);
    return NextResponse.json(
      { error: "Debug auth failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
