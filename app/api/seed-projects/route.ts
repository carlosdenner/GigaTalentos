import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';
import Channel from '@/models/Channel';
import Category from '@/models/Category';
import User from '@/models/User';

export async function POST() {
  try {
    await connectDB();

    // Clear existing demo projects
    await Video.deleteMany({ demo: true });

    // Get categories and demo users
    const categories = await Category.find({});
    const demoUsers = await User.find({ email: { $regex: /demo\d+@/ } });

    // Create channels for demo users if they don't exist
    const channelsData = demoUsers.map(user => ({
      name: user.name,
      description: user.bio,
      category: user.categories?.[0] || "Geral",
      user_id: user._id, // For backward compatibility
      avatar: user.avatar,
      subscribers: Math.floor(Math.random() * 500) + 50,
      verified: user.verified,
      demo: true
    }));

    // Delete existing demo channels and create new ones
    await Channel.deleteMany({ demo: true });
    const channels = await Channel.insertMany(channelsData);

    const projectsData = [
      // Ana Costa - Tech Projects
      {
        title: "Sistema de Monitoramento Ambiental IoT",
        description: "Desenvolvi um sistema completo de monitoramento da qualidade do ar usando sensores IoT, React e Node.js. O projeto visa ajudar cidades a monitorar poluição em tempo real.",
        thumbnail: "/categories/cognitive-technical.jpg",
        video_url: "https://example.com/video1",
        category: categories.find(c => c.name.includes('Cognitiva'))?.name || "Habilidade Cognitiva & Técnica",
        channel_id: channels.find(c => c.name === "Ana Costa")?._id,
        views: 1250,
        likes: [],
        created_at: new Date('2024-06-01'),
        featured: true,
        demo: true,
        tags: ["IoT", "React", "Sustentabilidade", "Tech4Good"],
        duration: "8:45"
      },
      {
        title: "App de Gestão de Resíduos Urbanos",
        description: "Aplicativo mobile que conecta cidadãos com cooperativas de reciclagem, utilizando geolocalização e gamificação para incentivar reciclagem.",
        thumbnail: "/categories/creativity-innovation.jpg",
        video_url: "https://example.com/video2",
        category: categories.find(c => c.name.includes('Criatividade'))?.name || "Criatividade & Inovação",
        channel_id: channels.find(c => c.name === "Ana Costa")?._id,
        views: 890,
        likes: [],
        created_at: new Date('2024-05-15'),
        featured: false,
        demo: true,
        tags: ["Mobile", "Sustentabilidade", "UX", "Social Impact"],
        duration: "6:32"
      },

      // Carlos Silva - Leadership Projects
      {
        title: "Como Liderei uma Equipe Remota de 15 Pessoas",
        description: "Compartilho estratégias práticas que usei para liderar uma equipe distribuída globalmente, mantendo produtividade e engajamento altos durante a pandemia.",
        thumbnail: "/categories/leadership-collaboration.jpg",
        video_url: "https://example.com/video3",
        category: categories.find(c => c.name.includes('Liderança'))?.name || "Liderança & Colaboração",
        channel_id: channels.find(c => c.name === "Carlos Silva")?._id,
        views: 2100,
        likes: [],
        created_at: new Date('2024-06-10'),
        featured: true,
        demo: true,
        tags: ["Liderança", "Trabalho Remoto", "Gestão", "Produtividade"],
        duration: "12:18"
      },
      {
        title: "Estratégia de Comunicação para Startup em Crescimento",
        description: "Case real de como estruturei a comunicação interna e externa de uma startup que cresceu de 5 para 50 funcionários em 1 ano.",
        thumbnail: "/categories/communication-persuasion.jpg",
        video_url: "https://example.com/video4",
        category: categories.find(c => c.name.includes('Comunicação'))?.name || "Comunicação & Persuasão",
        channel_id: channels.find(c => c.name === "Carlos Silva")?._id,
        views: 1680,
        likes: [],
        created_at: new Date('2024-05-28'),
        featured: true,
        demo: true,
        tags: ["Comunicação", "Startup", "Escalabilidade", "Estratégia"],
        duration: "10:05"
      },

      // Marina Alves - Design Projects
      {
        title: "Design Inclusivo: App para Pessoas com Deficiência Visual",
        description: "Processo completo de design de um aplicativo de navegação urbana para pessoas com deficiência visual, desde pesquisa até prototipagem.",
        thumbnail: "/categories/creativity-innovation.jpg",
        video_url: "https://example.com/video5",
        category: categories.find(c => c.name.includes('Criatividade'))?.name || "Criatividade & Inovação",
        channel_id: channels.find(c => c.name === "Marina Alves")?._id,
        views: 1420,
        likes: [],
        created_at: new Date('2024-06-05'),
        featured: true,
        demo: true,
        tags: ["Design Inclusivo", "UX Research", "Acessibilidade", "Social Impact"],
        duration: "15:22"
      },
      {
        title: "Redesign de E-commerce com Foco em Acessibilidade",
        description: "Como redesenhei completamente um e-commerce para torná-lo acessível, aumentando conversões em 40% e incluindo usuários com diferentes necessidades.",
        thumbnail: "/categories/social-ethics.jpg",
        video_url: "https://example.com/video6",
        category: categories.find(c => c.name.includes('Social'))?.name || "Consciência Social & Ética",
        channel_id: channels.find(c => c.name === "Marina Alves")?._id,
        views: 980,
        likes: [],
        created_at: new Date('2024-05-20'),
        featured: false,
        demo: true,
        tags: ["E-commerce", "Acessibilidade", "Conversão", "Inclusão"],
        duration: "9:14"
      },

      // Roberto Ferreira - Data Projects
      {
        title: "Análise Preditiva de Vendas para Startup de Educação",
        description: "Utilizei machine learning para criar modelos preditivos que ajudaram uma edtech a aumentar vendas em 35% através de insights de dados.",
        thumbnail: "/categories/cognitive-technical.jpg",
        video_url: "https://example.com/video7",
        category: categories.find(c => c.name.includes('Cognitiva'))?.name || "Habilidade Cognitiva & Técnica",
        channel_id: channels.find(c => c.name === "Roberto Ferreira")?._id,
        views: 1150,
        likes: [],
        created_at: new Date('2024-06-08'),
        featured: true,
        demo: true,
        tags: ["Machine Learning", "Data Science", "EdTech", "Business Intelligence"],
        duration: "11:33"
      },

      // Julia Santos - Sustainability Projects
      {
        title: "Implementação de ESG em Startup Brasileira",
        description: "Case completo de como implementei práticas ESG em uma startup de tecnologia, criando impacto social mensurável sem comprometer crescimento.",
        thumbnail: "/categories/social-ethics.jpg",
        video_url: "https://example.com/video8",
        category: categories.find(c => c.name.includes('Social'))?.name || "Consciência Social & Ética",
        channel_id: channels.find(c => c.name === "Julia Santos")?._id,
        views: 1320,
        likes: [],
        created_at: new Date('2024-06-12'),
        featured: true,
        demo: true,
        tags: ["ESG", "Sustentabilidade", "Impacto Social", "Startup"],
        duration: "13:27"
      },

      // Pedro Oliveira - Resilience Projects
      {
        title: "De Jovem da Periferia a Empreendedor de Sucesso",
        description: "Minha jornada pessoal de superação: como transformei adversidades em combustível para criar uma startup de educação que já impactou 10mil estudantes.",
        thumbnail: "/categories/resilience-adaptability.jpg",
        video_url: "https://example.com/video9",
        category: categories.find(c => c.name.includes('Resiliência'))?.name || "Resiliência & Adaptabilidade",
        channel_id: channels.find(c => c.name === "Pedro Oliveira")?._id,
        views: 2850,
        likes: [],
        created_at: new Date('2024-06-15'),
        featured: true,
        demo: true,
        tags: ["Inspiração", "Superação", "EdTech", "Empreendedorismo Social"],
        duration: "18:45"
      },

      // Camila Rodriguez - Communication Projects
      {
        title: "Pitch Perfeito: Como Consegui R$ 2M em Investimento",
        description: "Breakdown completo do pitch que me garantiu investimento seed. Analiso cada slide, timing e estratégia de storytelling utilizada.",
        thumbnail: "/categories/communication-persuasion.jpg",
        video_url: "https://example.com/video10",
        category: categories.find(c => c.name.includes('Comunicação'))?.name || "Comunicação & Persuasão",
        channel_id: channels.find(c => c.name === "Camila Rodriguez")?._id,
        views: 3200,
        likes: [],
        created_at: new Date('2024-06-18'),
        featured: true,
        demo: true,
        tags: ["Pitch", "Investimento", "Storytelling", "Fundraising"],
        duration: "14:20"
      },

      // Lucas Mendes - Mobile Projects
      {
        title: "App de Mobilidade Urbana Sustentável",
        description: "Desenvolvimento de aplicativo que integra diferentes modais de transporte sustentável, incentivando alternativas ao carro particular nas grandes cidades.",
        thumbnail: "/categories/cognitive-technical.jpg",
        video_url: "https://example.com/video11",
        category: categories.find(c => c.name.includes('Cognitiva'))?.name || "Habilidade Cognitiva & Técnica",
        channel_id: channels.find(c => c.name === "Lucas Mendes")?._id,
        views: 890,
        likes: [],
        created_at: new Date('2024-06-20'),
        featured: false,
        demo: true,
        tags: ["Mobilidade", "Sustentabilidade", "React Native", "Smart Cities"],
        duration: "7:58"
      }
    ];

    const projects = await Video.insertMany(projectsData);

    return NextResponse.json({
      message: "Projetos demo criados com sucesso",
      projects: projects.length,
      channels: channels.length
    });
  } catch (error) {
    console.error("Error seeding projects:", error);
    console.error("Error details:", error.message);
    return NextResponse.json(
      { error: "Erro ao criar projetos demo", details: error.message },
      { status: 500 }
    );
  }
}
