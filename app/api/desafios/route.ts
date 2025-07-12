import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Desafio } from '@/models';

export async function GET() {
  try {
    await connectDB();

    // Get featured desafios or most popular ones
    const desafios = await Desafio.find({
      $or: [
        { featured: true },
        { participants: { $gte: 100 } }
      ]
    })
    .populate('category', 'name')
    .sort({ participants: -1, featured: -1 })
    .limit(6)
    .lean()
    .exec();

    return NextResponse.json(desafios);
  } catch (error) {
    console.error("Error fetching desafios:", error);
    return NextResponse.json(
      { error: "Erro ao buscar desafios" },
      { status: 500 }
    );
  }
}
