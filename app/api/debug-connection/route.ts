import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🔍 Debug: Checking MongoDB connection...');
    
    // Check if environment variable exists
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return NextResponse.json({
        success: false,
        error: 'MONGODB_URI environment variable is not set',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Check URI format (without exposing credentials)
    const uriInfo = {
      hasProtocol: mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://'),
      hasCredentials: mongoUri.includes('@'),
      hasDatabase: mongoUri.includes('?') || mongoUri.split('/').length > 3
    };

    console.log('📊 URI Analysis:', uriInfo);

    // Attempt connection
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      uriInfo,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Connection debug failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      errorType: error.constructor.name,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
