import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import { Desafio, User } from '@/models';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();

    // Get current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get desafios created by the current user
    const userDesafios = await Desafio.find({ created_by: currentUser._id })
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
      participantsCount: desafio.participants ? desafio.participants.length : 0
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
