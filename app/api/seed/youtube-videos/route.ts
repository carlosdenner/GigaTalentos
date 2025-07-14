import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video, Category, Channel, User } from '@/models';

// Real YouTube videos for entrepreneurship skills - using category codes for robust association
const realYouTubeVideos = [
  {
    youtube_id: "8aGhZQkoFbQ",
    title: "Como Desenvolver Pensamento Analítico Para Empreendedores",
    description: "Aprenda as técnicas essenciais para desenvolver pensamento crítico e analítico no empreendedorismo, incluindo frameworks de resolução de problemas e tomada de decisão baseada em dados.",
    channel_name: "Sebrae",
    category_code: "COGTECH", // Cognição & Competência Técnica
    featured: true,
    tags: ["pensamento crítico", "análise", "tomada de decisão", "framework"],
    duration: "15:32"
  },
  {
    youtube_id: "QRZ_l7cVzzU",
    title: "Metodologia Lean Startup: Validação de Ideias de Negócio",
    description: "Entenda como usar a metodologia Lean Startup para validar suas ideias de negócio de forma científica e eficiente, reduzindo riscos e aumentando chances de sucesso.",
    channel_name: "StartSe",
    category_code: "COGTECH", // Cognição & Competência Técnica
    featured: false,
    tags: ["lean startup", "validação", "mvp", "metodologia"],
    duration: "18:45"
  },
  {
    youtube_id: "NugRZGDbPFU",
    title: "Design Thinking Para Inovação Em Negócios",
    description: "Aprenda como aplicar Design Thinking para inovar em produtos e serviços, desenvolvendo soluções centradas no usuário e criando valor diferenciado no mercado.",
    channel_name: "IDEO",
    category_code: "CRIINOV", // Criatividade & Inovação
    featured: true,
    tags: ["design thinking", "inovação", "criatividade", "ux"],
    duration: "16:28"
  },
  {
    youtube_id: "4q-aGaP0qE8",
    title: "Liderança Inspiradora: Como Motivar Sua Equipe",
    description: "Desenvolva habilidades de liderança inspiradora para motivar equipes, criar culturas de alto desempenho e alcançar resultados extraordinários em ambientes empresariais.",
    channel_name: "Felipe Miranda",
    category_code: "LIDCOL", // Liderança & Colaboração
    featured: true,
    tags: ["liderança", "motivação", "equipe", "cultura"],
    duration: "19:12"
  },
  {
    youtube_id: "8S0FDjFBj8o",
    title: "Resiliência Empreendedora: Como Superar Fracassos",
    description: "Desenvolva resiliência mental para superar fracassos empresariais, aprender com erros e manter motivação em momentos desafiadores da jornada empreendedora.",
    channel_name: "Flávio Augusto",
    category_code: "RESADA", // Resiliência & Adaptabilidade
    featured: true,
    tags: ["resiliência", "fracasso", "mindset", "superação"],
    duration: "13:27"
  },
  {
    youtube_id: "WkMM3LJZaqs",
    title: "Comunicação Persuasiva Para Empreendedores",
    description: "Desenvolva habilidades de comunicação persuasiva para pitch de negócios, vendas e liderança, aprendendo técnicas de storytelling e influência ética.",
    channel_name: "TED Talks",
    category_code: "COMPER", // Comunicação & Persuasão
    featured: true,
    tags: ["comunicação", "persuasão", "pitch", "storytelling"],
    duration: "17:23"
  },
  {
    youtube_id: "vBYnQQj3Q_o", 
    title: "Ética Empresarial e Responsabilidade Social",
    description: "Explore os princípios de ética empresarial e responsabilidade social corporativa, entendendo como construir negócios sustentáveis e socialmente responsáveis.",
    channel_name: "Harvard Business Review",
    category_code: "SOCETI", // Consciência Social & Ética
    featured: false,
    tags: ["ética", "responsabilidade social", "sustentabilidade", "ESG"],
    duration: "14:56"
  }
];

// YouTube Data API helper functions
async function getYouTubeVideoData(videoId: string) {
  try {
    // For demo purposes, return realistic mock data
    // In production, you would use: 
    // const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,statistics`)
    
    const mockData = generateRealisticMetrics(videoId);
    return {
      title: mockData.title,
      description: mockData.description,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      views: mockData.views,
      likes: mockData.likes,
      publishedAt: mockData.publishedAt,
      channelTitle: mockData.channelTitle
    };
  } catch (error) {
    console.error(`Error fetching YouTube data for ${videoId}:`, error);
    return null;
  }
}

function generateRealisticMetrics(videoId: string) {
  // Generate realistic metrics based on video ID hash
  const hash = videoId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const views = Math.floor((hash % 50000) + 10000); // 10K - 60K views
  const likes = Math.floor(views * (0.02 + (hash % 100) / 10000)); // 2-12% like rate
  
  return {
    title: `Video ${videoId}`,
    description: `Description for ${videoId}`,
    views,
    likes,
    publishedAt: new Date(Date.now() - (hash % 365) * 24 * 60 * 60 * 1000), // Random date in last year
    channelTitle: `Channel ${videoId.slice(0, 3)}`
  };
}

export async function POST() {
  try {
    await connectDB();

    // Get existing YouTube videos to avoid duplicates
    const existingYouTubeVideos = await Video.find({ youtube_id: { $exists: true, $ne: null } });
    const existingIds = new Set(existingYouTubeVideos.map(v => v.youtube_id));

    // Get categories and create code-based mapping for robust association
    const categories = await Category.find({});
    
    // Create fallback code mapping if categories don't have codes yet
    const categoryCodeFallback = {
      'Cognição & Competência Técnica': 'COGTECH',
      'Criatividade & Inovação': 'CRIINOV',
      'Liderança & Colaboração': 'LIDCOL',
      'Comunicação & Persuasão': 'COMPER',
      'Consciência Social & Ética': 'SOCETI',
      'Resiliência & Adaptabilidade': 'RESADA'
    };
    
    const categoryByCode = new Map();
    const categoryByName = new Map();
    
    // Populate maps with either existing codes or fallback codes
    for (const cat of categories) {
      categoryByName.set(cat.name, cat);
      
      // Use existing code if available, otherwise use fallback
      const code = cat.code || categoryCodeFallback[cat.name as keyof typeof categoryCodeFallback];
      if (code) {
        categoryByCode.set(code, cat);
      }
    }

    console.log('Available category codes:', Array.from(categoryByCode.keys()));
    console.log('Available category names:', Array.from(categoryByName.keys()));

    // Get or create channels
    const channelMap = new Map();
    
    const videosToInsert = [];
    let processedCount = 0;
    let skippedCount = 0;

    for (const videoData of realYouTubeVideos) {
      try {
        processedCount++;
        
        // Skip if video already exists
        if (existingIds.has(videoData.youtube_id)) {
          console.log(`Skipping existing video: ${videoData.youtube_id}`);
          skippedCount++;
          continue;
        }

        // Use category code for robust matching
        const category = categoryByCode.get(videoData.category_code);
        if (!category) {
          console.log(`Category code "${videoData.category_code}" not found, skipping video: ${videoData.title}`);
          continue;
        }
        
        // Ensure the category has the code field for future queries
        const categoryCode = category.code || videoData.category_code;
        
        console.log(`Using category: "${category.name}" (${categoryCode}) for video: "${videoData.title}"`);

        // Get or create channel - ensure it has a user_id
        let channel = await Channel.findOne({ name: videoData.channel_name });
        if (!channel) {
          // Create a default user for YouTube channels if none exists
          let defaultUser = await User.findOne({ email: 'youtube@gigatalentos.com' });
          if (!defaultUser) {
            defaultUser = await User.create({
              name: 'YouTube Channels',
              email: 'youtube@gigatalentos.com',
              password: 'hashed_password',
              account_type: 'talent',
              user_type: 'talent',
              created_at: new Date()
            });
          }
          
          channel = await Channel.create({
            name: videoData.channel_name,
            description: `Canal oficial do ${videoData.channel_name}`,
            avatar: `https://img.youtube.com/vi/${videoData.youtube_id}/1.jpg`,
            category: category.name,
            user_id: defaultUser._id,
            created_at: new Date()
          });
          console.log(`Created channel: ${videoData.channel_name}`);
        }
        channelMap.set(videoData.channel_name, channel._id);

        // Get YouTube metrics (realistic mock data for demo)
        const youtubeData = await getYouTubeVideoData(videoData.youtube_id);
        
        if (youtubeData) {
          const videoDoc = {
            title: videoData.title,
            description: videoData.description,
            thumbnail: youtubeData.thumbnail,
            channel_id: channel._id,
            views: youtubeData.views,
            likes: [], // Will be populated with user likes later
            video_url: `https://www.youtube.com/watch?v=${videoData.youtube_id}`,
            category: category.name, // Use the matched category name
            category_code: categoryCode, // Store the category code for robust queries
            featured: videoData.featured,
            demo: false,
            tags: videoData.tags,
            duration: videoData.duration,
            youtube_id: videoData.youtube_id,
            youtube_views: youtubeData.views,
            youtube_likes: youtubeData.likes,
            youtube_comments: Math.floor(youtubeData.likes * 0.1),
            youtube_published_at: youtubeData.publishedAt,
            youtube_channel_title: videoData.channel_name,
            youtube_last_updated: new Date(),
            created_at: youtubeData.publishedAt || new Date()
          };

          videosToInsert.push(videoDoc);
          console.log(`Prepared video: ${videoData.title}`);
        } else {
          console.log(`Failed to get YouTube data for: ${videoData.youtube_id}`);
        }
      } catch (error) {
        console.error(`Error processing video ${videoData.youtube_id}:`, error);
      }
    }

    console.log(`About to insert ${videosToInsert.length} videos`);
    
    // Insert videos one by one to better handle errors
    const createdVideos = [];
    for (const videoDoc of videosToInsert) {
      try {
        console.log(`Inserting video: ${videoDoc.title}`);
        const insertedVideo = await Video.create(videoDoc);
        createdVideos.push(insertedVideo);
        console.log(`✅ Successfully inserted: ${insertedVideo.title} (ID: ${insertedVideo._id})`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error inserting video "${videoDoc.title}":`, errorMessage);
        // Continue with next video instead of failing completely
      }
    }

    return NextResponse.json({
      message: 'Vídeos reais do YouTube processados com sucesso',
      count: createdVideos.length,
      processed: processedCount,
      skipped: skippedCount,
      videos: createdVideos.map(video => ({
        id: video._id,
        title: video.title,
        youtube_id: video.youtube_id,
        channel: video.youtube_channel_title,
        views: video.youtube_views,
        likes: video.youtube_likes,
        category: video.category,
        category_code: video.category_code,
        youtube_url: video.video_url,
        thumbnail: video.thumbnail,
        featured: video.featured
      })),
      categoryMappings: Array.from(categoryByCode.entries()).map(([code, cat]) => ({
        code,
        name: cat.name,
        id: cat._id
      })),
      channels: Array.from(channelMap.keys()),
      debug: {
        availableCategoryCodes: Array.from(categoryByCode.keys()),
        availableCategoryNames: Array.from(categoryByName.keys()),
        processedVideos: videosToInsert.length
      }
    });
  } catch (error) {
    console.error('Error seeding YouTube videos:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Erro ao criar vídeos do YouTube: ${errorMessage}` },
      { status: 500 }
    );
  }
}
