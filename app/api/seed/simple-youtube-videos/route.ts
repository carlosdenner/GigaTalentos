import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video, Category, Channel } from '@/models';

// Simplified approach - map video categories directly to DB categories
const videoMappings = [
  {
    youtube_id: "8aGhZQkoFbQ",
    title: "Como Desenvolver Pensamento Analítico Para Empreendedores",
    description: "Aprenda as técnicas essenciais para desenvolver pensamento crítico e analítico no empreendedorismo.",
    channel_name: "Sebrae",
    category_keyword: "cognição", // Use keyword for matching
    featured: true,
    tags: ["pensamento crítico", "análise", "tomada de decisão"]
  },
  {
    youtube_id: "QRZ_l7cVzzU", 
    title: "Metodologia Lean Startup: Validação de Ideias de Negócio",
    description: "Entenda como usar a metodologia Lean Startup para validar suas ideias de negócio.",
    channel_name: "StartSe",
    category_keyword: "cognição",
    featured: false,
    tags: ["lean startup", "validação", "mvp"]
  },
  {
    youtube_id: "NugRZGDbPFU",
    title: "Design Thinking Para Inovação Em Negócios", 
    description: "Aprenda como aplicar Design Thinking para inovar em produtos e serviços.",
    channel_name: "IDEO",
    category_keyword: "criatividade",
    featured: true,
    tags: ["design thinking", "inovação", "criatividade"]
  },
  {
    youtube_id: "4q-aGaP0qE8",
    title: "Liderança Inspiradora: Como Motivar Sua Equipe",
    description: "Desenvolva habilidades de liderança inspiradora para motivar equipes.",
    channel_name: "Felipe Miranda", 
    category_keyword: "liderança",
    featured: true,
    tags: ["liderança", "motivação", "equipe"]
  },
  {
    youtube_id: "EgCXGEv5jKw",
    title: "Storytelling Para Empreendedores: Como Contar Sua História",
    description: "Domine a arte do storytelling para comunicar a visão da sua empresa.",
    channel_name: "Escola Conquer",
    category_keyword: "comunicação",
    featured: true,
    tags: ["storytelling", "comunicação", "narrativa"]
  }
];

function generateMockMetrics(videoId: string) {
  const hash = videoId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return {
    views: Math.floor((hash % 50000) + 15000), // 15K - 65K views
    likes: Math.floor((hash % 3000) + 500), // 500 - 3500 likes
    publishedAt: new Date(Date.now() - (hash % 365) * 24 * 60 * 60 * 1000)
  };
}

export async function POST() {
  try {
    await connectDB();

    // Get all categories
    const categories = await Category.find({});
    console.log('Found categories:', categories.map(c => ({ id: c._id, name: c.name })));

    if (categories.length === 0) {
      return NextResponse.json({
        error: 'No categories found in database. Please run category seeding first.'
      }, { status: 400 });
    }

    // Check existing videos
    const existingVideos = await Video.find({ youtube_id: { $exists: true, $ne: null } });
    const existingIds = new Set(existingVideos.map(v => v.youtube_id));
    
    console.log('Existing YouTube videos:', existingIds.size);

    const results = [];
    let createdCount = 0;
    let skippedCount = 0;

    for (const videoData of videoMappings) {
      try {
        if (existingIds.has(videoData.youtube_id)) {
          console.log(`Skipping existing video: ${videoData.youtube_id}`);
          skippedCount++;
          continue;
        }

        // Find category by keyword
        const category = categories.find(cat => 
          cat.name.toLowerCase().includes(videoData.category_keyword.toLowerCase())
        );

        if (!category) {
          console.log(`No category found for keyword: ${videoData.category_keyword}`);
          continue;
        }

        console.log(`Matched "${videoData.category_keyword}" to category: ${category.name}`);

        // Create or get channel
        let channel = await Channel.findOne({ name: videoData.channel_name });
        if (!channel) {
          channel = await Channel.create({
            name: videoData.channel_name,
            description: `Canal ${videoData.channel_name}`,
            avatar: `https://img.youtube.com/vi/${videoData.youtube_id}/1.jpg`,
            category: category.name
          });
          console.log(`Created channel: ${videoData.channel_name}`);
        }

        // Generate metrics
        const metrics = generateMockMetrics(videoData.youtube_id);

        // Create video
        const video = await Video.create({
          title: videoData.title,
          description: videoData.description,
          thumbnail: `https://img.youtube.com/vi/${videoData.youtube_id}/maxresdefault.jpg`,
          channel_id: channel._id,
          views: metrics.views,
          likes: [],
          video_url: `https://www.youtube.com/watch?v=${videoData.youtube_id}`,
          category: category.name,
          featured: videoData.featured,
          demo: false,
          tags: videoData.tags,
          duration: "15:30",
          youtube_id: videoData.youtube_id,
          youtube_views: metrics.views,
          youtube_likes: metrics.likes,
          youtube_comments: Math.floor(metrics.likes * 0.1),
          youtube_published_at: metrics.publishedAt,
          youtube_channel_title: videoData.channel_name,
          youtube_last_updated: new Date(),
          created_at: metrics.publishedAt
        });

        results.push({
          id: video._id,
          title: video.title,
          youtube_id: video.youtube_id,
          category: video.category,
          views: video.youtube_views,
          likes: video.youtube_likes
        });

        createdCount++;
        console.log(`Created video: ${videoData.title}`);

      } catch (error) {
        console.error(`Error creating video ${videoData.youtube_id}:`, error);
      }
    }

    return NextResponse.json({
      message: `Criados ${createdCount} vídeos do YouTube com sucesso`,
      created: createdCount,
      skipped: skippedCount,
      total: videoMappings.length,
      videos: results,
      categories: categories.map(c => c.name)
    });

  } catch (error) {
    console.error('Error in simple YouTube seeding:', error);
    return NextResponse.json({
      error: `Erro: ${error.message}`
    }, { status: 500 });
  }
}
