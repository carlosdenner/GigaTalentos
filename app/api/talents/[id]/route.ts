import { NextResponse } from 'next/server';
import Video from '@/models/Video';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
   const video = await Video.findById(params.id);
      
    return NextResponse.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}