import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import { Desafio, User } from '@/models';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'popularity'; // popularity, newest, deadline
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build filter object
    const filter: any = {};
    
    if (category && category !== 'Todos') {
      filter.category = category;
    }
    
    if (difficulty && difficulty !== 'Todos') {
      filter.difficulty = difficulty;
    }
    
    if (status && status !== 'Todos') {
      filter.status = status;
    }

    // Build sort object
    let sortObject: any = {};
    switch (sortBy) {
      case 'popularity':
        // Sort by featured status first, then creation date (will be re-sorted after calculating approved projects)
        sortObject = { featured: -1, created_at: -1 };
        break;
      case 'newest':
        sortObject = { created_at: -1 };
        break;
      case 'deadline':
        sortObject = { end_date: 1 }; // Earliest deadline first
        break;
      case 'prize':
        // Sort by featured first, then creation date
        sortObject = { featured: -1, created_at: -1 };
        break;
      default:
        sortObject = { featured: -1, created_at: -1 };
    }

    const desafios = await Desafio.find(filter)
      .populate('category', 'name thumbnail')
      .populate('created_by', 'name avatar account_type')
      .sort(sortObject)
      .limit(limit)
      .lean()
      .exec();

    // Add popularity scoring for consistent ranking
    const desafiosWithScores = desafios.map(desafio => {
      // Type assertion for the desafio object
      const typedDesafio = desafio as any;
      
      // Calculate actual projects linked and approved for this challenge
      const approvedProjects = (typedDesafio.projetos_vinculados || []).filter((p: any) => p.status === 'aprovado').length;
      
      return {
        ...typedDesafio,
        approvedProjects, // New field for approved projects count
        popularityScore: calculateDesafioPopularity({...typedDesafio, participants: approvedProjects}),
        daysRemaining: calculateDaysRemaining(typedDesafio.end_date),
        formattedPrizes: formatPrizes(typedDesafio.prizes),
        favoritesCount: typedDesafio.favoritos ? typedDesafio.favoritos.length : 0
      };
    });

    // Apply final sorting based on calculated values
    if (sortBy === 'popularity') {
      desafiosWithScores.sort((a, b) => {
        // Sort by approved projects count (popularity), then featured status, then creation date
        if (b.approvedProjects !== a.approvedProjects) return b.approvedProjects - a.approvedProjects;
        if ((b as any).featured !== (a as any).featured) return (b as any).featured ? 1 : -1;
        return new Date((b as any).created_at).getTime() - new Date((a as any).created_at).getTime();
      });
    } else if (sortBy === 'prize') {
      desafiosWithScores.sort((a, b) => {
        // Sort by featured first, then approved projects
        if ((b as any).featured !== (a as any).featured) return (b as any).featured ? 1 : -1;
        return b.approvedProjects - a.approvedProjects;
      });
    }

    return NextResponse.json({
      data: desafiosWithScores,
      total: desafiosWithScores.length,
      filters: {
        category,
        difficulty,
        status,
        sortBy
      }
    });
  } catch (error) {
    console.error("Error fetching desafios:", error);
    return NextResponse.json(
      { error: "Erro ao buscar desafios" },
      { status: 500 }
    );
  }
}

// Helper function to calculate popularity score
function calculateDesafioPopularity(desafio: any): number {
  let score = 0;
  
  // Base score from participants (logarithmic scaling to prevent huge differences)
  score += Math.log(desafio.participants + 1) * 10;
  
  // Featured bonus
  if (desafio.featured) {
    score += 50;
  }
  
  // Status bonus
  if (desafio.status === 'Ativo') {
    score += 30;
  } else if (desafio.status === 'Em Breve') {
    score += 20;
  }
  
  // Difficulty multiplier (advanced challenges get slight boost)
  const difficultyMultiplier = {
    'Iniciante': 1.0,
    'Intermediário': 1.1,
    'Avançado': 1.2
  };
  score *= difficultyMultiplier[desafio.difficulty as keyof typeof difficultyMultiplier] || 1.0;
  
  // Prize value bonus (rough estimation)
  if (desafio.prizes && desafio.prizes.length > 0) {
    const mainPrize = desafio.prizes[0];
    if (mainPrize.value.includes('15.000') || mainPrize.value.includes('12.000')) {
      score += 20;
    } else if (mainPrize.value.includes('10.000') || mainPrize.value.includes('8.000')) {
      score += 15;
    } else if (mainPrize.value.includes('6.000') || mainPrize.value.includes('5.000')) {
      score += 10;
    }
  }
  
  return Math.round(score);
}

// Helper function to calculate days remaining
function calculateDaysRemaining(endDate: Date): number {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Helper function to format prizes for display
function formatPrizes(prizes: any[]): string {
  if (!prizes || prizes.length === 0) return 'Prêmios a definir';
  
  const mainPrize = prizes[0];
  if (prizes.length === 1) {
    return mainPrize.value;
  } else {
    return `${mainPrize.value} + ${prizes.length - 1} outros prêmios`;
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if user is a mentor or admin
    const user = await User.findById(session.user.id);
    if (!user || !['mentor', 'admin'].includes(user.account_type)) {
      return NextResponse.json(
        { error: "Apenas mentores e administradores podem criar desafios" },
        { status: 403 }
      );
    }

    const desafioData = await request.json();

    // Validate required fields
    if (!desafioData.title || !desafioData.description || !desafioData.category) {
      return NextResponse.json(
        { error: "Título, descrição e categoria são obrigatórios" },
        { status: 400 }
      );
    }

    // Create new desafio
    const desafio = await Desafio.create({
      ...desafioData,
      created_by: session.user.id,
      participants: 0,
      status: 'Ativo',
      created_at: new Date(),
      updated_at: new Date()
    });

    const populatedDesafio = await Desafio.findById(desafio._id)
      .populate('category', 'name')
      .populate('created_by', 'name avatar');

    return NextResponse.json(populatedDesafio, { status: 201 });
  } catch (error: any) {
    console.error('Error creating desafio:', error);
    return NextResponse.json(
      { error: error.message || "Falha ao criar desafio" },
      { status: 500 }
    );
  }
}
