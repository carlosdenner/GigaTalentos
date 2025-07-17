import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";

export async function GET() {
  try {
    console.log('Testing database connection...');
    await connectDB();
    console.log('Connected! Testing simple query...');
    
    // Try a simple count operation with a timeout
    const userCount = await User.countDocuments().maxTimeMS(5000);
    console.log('User count:', userCount);
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      userCount
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message,
      error: error.toString()
    }, { status: 500 });
  }
}
