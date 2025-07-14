import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Desafio, Category } from '@/models';

export async function GET() {
  try {
    await connectDB();

    // Get all categories that have desafios
    const categories = await Category.find({})
      .select('_id name')
      .lean()
      .exec();

    // Get unique difficulties from desafios
    const difficulties = await Desafio.distinct('difficulty');

    // Get unique statuses from desafios
    const statuses = await Desafio.distinct('status');

    // Get total counts for each filter
    const categoryCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await Desafio.countDocuments({ category: category._id });
        return {
          ...category,
          count
        };
      })
    );

    const difficultyCountsPromises = difficulties.map(async (difficulty) => {
      const count = await Desafio.countDocuments({ difficulty });
      return { value: difficulty, count };
    });
    const difficultyCounts = await Promise.all(difficultyCountsPromises);

    const statusCountsPromises = statuses.map(async (status) => {
      const count = await Desafio.countDocuments({ status });
      return { value: status, count };
    });
    const statusCounts = await Promise.all(statusCountsPromises);

    return NextResponse.json({
      categories: categoryCounts.filter(cat => cat.count > 0), // Only include categories with desafios
      difficulties: difficultyCounts,
      statuses: statusCounts,
      sortOptions: [
        { value: 'popularity', label: 'Mais Populares' },
        { value: 'newest', label: 'Mais Recentes' },
        { value: 'deadline', label: 'Prazo Final' },
        { value: 'prize', label: 'Maior Prêmio' }
      ]
    });
  } catch (error) {
    console.error("Error fetching desafio filters:", error);
    return NextResponse.json(
      { error: "Erro ao buscar filtros" },
      { status: 500 }
    );
  }
}
