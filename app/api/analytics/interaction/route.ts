import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from '@/lib/mongodb';
import { UserInteraction } from '@/models';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const {
      content_id,
      content_type,
      action,
      context = {},
      metadata = {},
      device_info = {},
      experiment_variant,
      recommendation_source,
      recommendation_score
    } = body;

    // Validate required fields
    if (!content_id || !content_type || !action) {
      return NextResponse.json(
        { error: 'content_id, content_type, and action are required' },
        { status: 400 }
      );
    }

    const user_id = session.user.id;

    // Extract additional context from request
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIP = forwardedFor ? forwardedFor.split(',')[0] : 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Create interaction record
    const interaction = await UserInteraction.create({
      user_id,
      content_id,
      content_type,
      action,
      context: {
        ...context,
        referrer: referer,
        user_agent: userAgent,
        ip_address: clientIP
      },
      metadata,
      device_info: {
        ...device_info,
        user_agent: userAgent
      },
      experiment_variant,
      recommendation_source,
      recommendation_score,
      timestamp: new Date(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    console.log(`📊 Tracked interaction: ${action} on ${content_type} ${content_id}`);

    return NextResponse.json({
      success: true,
      interaction_id: interaction._id,
      message: 'Interaction tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking interaction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to track interaction: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const content_id = searchParams.get('content_id');
    const content_type = searchParams.get('content_type');
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    const query: any = {};
    if (user_id) query.user_id = user_id;
    if (content_id) query.content_id = content_id;
    if (content_type) query.content_type = content_type;
    if (action) query.action = action;

    // Get interactions with pagination
    const interactions = await UserInteraction
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(offset)
      .populate('user_id', 'name email avatar')
      .lean();

    const total = await UserInteraction.countDocuments(query);

    return NextResponse.json({
      success: true,
      interactions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching interactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch interactions: ${errorMessage}` },
      { status: 500 }
    );
  }
}
