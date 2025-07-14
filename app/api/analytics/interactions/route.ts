import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import { User } from '@/models';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { contentId, contentType, action, metadata } = await request.json();
    
    if (!contentId || !contentType || !action) {
      return NextResponse.json(
        { error: 'contentId, contentType e action são obrigatórios' },
        { status: 400 }
      );
    }

    await connectDB();

    // Track interaction for recommendation improvement
    const user = await User.findById(session.user.id);
    if (user) {
      // Initialize interaction history if it doesn't exist
      if (!user.interactionHistory) {
        user.interactionHistory = [] as any;
      }

      // Add new interaction
      (user.interactionHistory as any).push({
        contentId,
        contentType,
        action,
        metadata: metadata || {},
        timestamp: new Date()
      });

      // Keep only last 1000 interactions to avoid document size issues
      if (user.interactionHistory.length > 1000) {
        user.interactionHistory = (user.interactionHistory as any).slice(-1000);
      }

      await user.save();
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error tracking interaction:", error);
    return NextResponse.json(
      { error: "Erro ao registrar interação" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType');
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '100');

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user || !user.interactionHistory) {
      return NextResponse.json({ interactions: [] });
    }

    let interactions = Array.from(user.interactionHistory || []);

    // Filter by content type if specified
    if (contentType) {
      interactions = interactions.filter(
        (interaction: any) => interaction.contentType === contentType
      );
    }

    // Filter by action if specified  
    if (action) {
      interactions = interactions.filter(
        (interaction: any) => interaction.action === action
      );
    }

    // Sort by timestamp (most recent first) and limit
    interactions = interactions
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return NextResponse.json({ 
      interactions,
      total: interactions.length 
    });

  } catch (error) {
    console.error("Error fetching interactions:", error);
    return NextResponse.json(
      { error: "Erro ao buscar interações" },
      { status: 500 }
    );
  }
}
