import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User, Video, Projeto, Desafio } from '@/models';

export async function POST() {
  try {
    await connectDB();

    // Get all users, videos, projects, and challenges
    const users = await User.find().limit(20);
    const videos = await Video.find().limit(10);
    const projetos = await Projeto.find().limit(10);
    const desafios = await Desafio.find().limit(5);

    let totalInteractions = 0;

    // Generate realistic interaction patterns for each user
    for (const user of users) {
      const interactions = [];
      const userType = user.account_type;
      
      // Determine interaction patterns based on user type
      let interactionPatterns = {
        talent: {
          video: { views: 0.8, likes: 0.3, shares: 0.1 },
          projeto: { views: 0.9, likes: 0.4, follows: 0.2 },
          desafio: { views: 0.95, likes: 0.6, participates: 0.3 }
        },
        fan: {
          video: { views: 0.9, likes: 0.5, shares: 0.2 },
          projeto: { views: 0.7, likes: 0.3, follows: 0.1 },
          desafio: { views: 0.4, likes: 0.2, participates: 0.05 }
        },
        mentor: {
          video: { views: 0.6, likes: 0.2, shares: 0.3 },
          projeto: { views: 0.8, likes: 0.3, follows: 0.4 },
          desafio: { views: 0.7, likes: 0.3, participates: 0.1 }
        }
      };

      const patterns = interactionPatterns[userType as keyof typeof interactionPatterns] || interactionPatterns.fan;

      // Generate video interactions
      for (const video of videos) {
        if (Math.random() < patterns.video.views) {
          interactions.push({
            contentId: video._id.toString(),
            contentType: 'video',
            action: 'view',
            metadata: { 
              duration: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
              source: 'homepage'
            },
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days
          });

          if (Math.random() < patterns.video.likes) {
            interactions.push({
              contentId: video._id.toString(),
              contentType: 'video',
              action: 'like',
              metadata: {},
              timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            });
          }

          if (Math.random() < patterns.video.shares) {
            interactions.push({
              contentId: video._id.toString(),
              contentType: 'video',
              action: 'share',
              metadata: { platform: ['whatsapp', 'twitter', 'linkedin'][Math.floor(Math.random() * 3)] },
              timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            });
          }
        }
      }

      // Generate project interactions
      for (const projeto of projetos) {
        if (Math.random() < patterns.projeto.views) {
          interactions.push({
            contentId: projeto._id.toString(),
            contentType: 'projeto',
            action: 'view',
            metadata: { source: 'search' },
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });

          if (Math.random() < patterns.projeto.likes) {
            interactions.push({
              contentId: projeto._id.toString(),
              contentType: 'projeto',
              action: 'like',
              metadata: {},
              timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            });
          }

          if (Math.random() < patterns.projeto.follows) {
            interactions.push({
              contentId: projeto._id.toString(),
              contentType: 'projeto',
              action: 'follow',
              metadata: {},
              timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            });
          }
        }
      }

      // Generate challenge interactions
      for (const desafio of desafios) {
        if (Math.random() < patterns.desafio.views) {
          interactions.push({
            contentId: desafio._id.toString(),
            contentType: 'desafio',
            action: 'view',
            metadata: { source: 'featured' },
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });

          if (Math.random() < patterns.desafio.likes) {
            interactions.push({
              contentId: desafio._id.toString(),
              contentType: 'desafio',
              action: 'like',
              metadata: {},
              timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            });
          }

          if (Math.random() < patterns.desafio.participates) {
            interactions.push({
              contentId: desafio._id.toString(),
              contentType: 'desafio',
              action: 'participate',
              metadata: {},
              timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            });
          }
        }
      }

      // Generate user preferences based on interactions
      const categoryInteractions = interactions.reduce((acc: any, interaction) => {
        const category = 'Empreendedorismo'; // Default category
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const topCategories = Object.entries(categoryInteractions)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([category]) => category);

      // Update user with interactions and preferences
      await User.findByIdAndUpdate(user._id, {
        interactionHistory: interactions,
        preferences: {
          categories: topCategories,
          topics: ['startup', 'tecnologia', 'inovacao'],
          contentTypes: userType === 'talent' ? ['desafio', 'video'] : ['video', 'projeto']
        }
      });

      totalInteractions += interactions.length;
    }

    return NextResponse.json({
      message: "Interações de usuários criadas com sucesso!",
      results: {
        usersUpdated: users.length,
        totalInteractions,
        avgInteractionsPerUser: Math.round(totalInteractions / users.length)
      },
      success: true
    });

  } catch (error) {
    console.error("Error seeding user interactions:", error);
    return NextResponse.json(
      { error: "Erro ao criar interações de usuários" },
      { status: 500 }
    );
  }
}
