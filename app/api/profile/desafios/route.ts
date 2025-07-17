import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import { Desafio, User } from '@/models';
import { authOptions } from '@/lib/auth';

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

    // Find the user by email to get their _id
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get desafios created by the user
    const userDesafios = await Desafio.find({ created_by: user._id })
      .populate('category', 'name thumbnail')
      .populate('created_by', 'name avatar account_type')
      .sort({ created_at: -1 })
      .limit(10)
      .lean()
      .exec();

    // Add extra calculated fields
    const desafiosWithExtras = userDesafios.map(desafio => ({
      ...desafio,
      daysRemaining: calculateDaysRemaining(desafio.end_date),
      favoritesCount: desafio.favoritos ? desafio.favoritos.length : 0,
      participantsCount: desafio.participants || 0
    }));

    return NextResponse.json(desafiosWithExtras);
  } catch (error) {
    console.error('Error fetching user desafios:', error);
    return NextResponse.json({ error: 'Failed to fetch desafios' }, { status: 500 });
  }
}

// Helper function to calculate days remaining
function calculateDaysRemaining(endDate: Date): number {
  if (!endDate) return 0;
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
