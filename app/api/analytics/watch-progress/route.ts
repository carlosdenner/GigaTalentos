import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/mongodb';
import { VideoWatch } from '@/models';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const {
      video_id,
      session_id,
      watch_duration,
      last_position,
      completion_percentage,
      paused_count,
      skipped_forward,
      skipped_backward,
      replay_count,
      speed_changes,
      source,
      previous_video_id,
      next_video_id
    } = body;

    // Validate required fields
    if (!video_id || !session_id) {
      return NextResponse.json(
        { error: 'video_id and session_id are required' },
        { status: 400 }
      );
    }

    const user_id = session.user.id;

    // Extract device info from request
    const userAgent = request.headers.get('user-agent') || '';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIP = forwardedFor ? forwardedFor.split(',')[0] : 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Determine device type from user agent
    const deviceType = userAgent.toLowerCase().includes('mobile') ? 'mobile' :
                      userAgent.toLowerCase().includes('tablet') ? 'tablet' : 'desktop';

    // Check if this watch session already exists
    let watchRecord = await VideoWatch.findOne({
      video_id,
      user_id,
      session_id
    });

    if (watchRecord) {
      // Update existing record
      watchRecord.watch_duration = watch_duration || watchRecord.watch_duration;
      watchRecord.last_position = last_position || watchRecord.last_position;
      watchRecord.completion_percentage = completion_percentage || watchRecord.completion_percentage;
      watchRecord.paused_count = paused_count || watchRecord.paused_count;
      watchRecord.skipped_forward = skipped_forward || watchRecord.skipped_forward;
      watchRecord.skipped_backward = skipped_backward || watchRecord.skipped_backward;
      watchRecord.replay_count = replay_count || watchRecord.replay_count;
      
      if (speed_changes) {
        watchRecord.speed_changes = [...(watchRecord.speed_changes || []), ...speed_changes];
      }
      
      watchRecord.updated_at = new Date();
      
      // Mark as completed if watch duration indicates completion
      if (completion_percentage && completion_percentage >= 80) {
        watchRecord.completed_at = new Date();
      }

      await watchRecord.save();
    } else {
      // Create new watch record
      watchRecord = await VideoWatch.create({
        video_id,
        user_id,
        session_id,
        watch_duration: watch_duration || 0,
        last_position: last_position || 0,
        completion_percentage: completion_percentage || 0,
        paused_count: paused_count || 0,
        skipped_forward: skipped_forward || 0,
        skipped_backward: skipped_backward || 0,
        replay_count: replay_count || 0,
        speed_changes: speed_changes || [],
        source,
        previous_video_id,
        next_video_id,
        device_type: deviceType,
        user_agent: userAgent,
        ip_address: clientIP,
        started_at: new Date(),
        completed_at: completion_percentage && completion_percentage >= 80 ? new Date() : undefined
      });
    }

    // Calculate watch quality based on engagement metrics
    let watchQuality = 'average';
    if (completion_percentage && completion_percentage >= 90) {
      watchQuality = 'excellent';
    } else if (completion_percentage && completion_percentage >= 70) {
      watchQuality = 'good';
    } else if (completion_percentage && completion_percentage < 30) {
      watchQuality = 'poor';
    }

    watchRecord.watch_quality = watchQuality;
    await watchRecord.save();

    console.log(`📹 Updated watch progress: ${watch_duration}s for video ${video_id} (${completion_percentage}%)`);

    return NextResponse.json({
      success: true,
      watch_id: watchRecord._id,
      session_id,
      watch_quality: watchQuality,
      message: 'Watch progress updated successfully'
    });

  } catch (error) {
    console.error('Error updating watch progress:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to update watch progress: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const video_id = searchParams.get('video_id');
    const session_id = searchParams.get('session_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    const query: any = {};
    if (user_id) query.user_id = user_id;
    if (video_id) query.video_id = video_id;
    if (session_id) query.session_id = session_id;

    // Get watch records with pagination
    const watchRecords = await VideoWatch
      .find(query)
      .sort({ started_at: -1 })
      .limit(limit)
      .skip(offset)
      .populate('video_id', 'title youtube_id duration')
      .populate('user_id', 'name email')
      .lean();

    const total = await VideoWatch.countDocuments(query);

    // Calculate analytics
    const analytics = {
      total_watches: total,
      average_completion: 0,
      total_watch_time: 0,
      quality_distribution: {
        excellent: 0,
        good: 0,
        average: 0,
        poor: 0
      }
    };

    if (watchRecords.length > 0) {
      analytics.average_completion = watchRecords.reduce((sum, record) => 
        sum + (record.completion_percentage || 0), 0) / watchRecords.length;
      
      analytics.total_watch_time = watchRecords.reduce((sum, record) => 
        sum + (record.watch_duration || 0), 0);
      
      watchRecords.forEach(record => {
        if (record.watch_quality) {
          analytics.quality_distribution[record.watch_quality as keyof typeof analytics.quality_distribution]++;
        }
      });
    }

    return NextResponse.json({
      success: true,
      watch_records: watchRecords,
      analytics,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching watch progress:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch watch progress: ${errorMessage}` },
      { status: 500 }
    );
  }
}
