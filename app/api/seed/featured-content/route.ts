import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Video, Channel, User, Projeto, Desafio } from '@/models';

const featuredVideos = [
  {
    title: "Pitch Perfeito: Como Consegui R$ 2M em Investimento",
    description: "Aprenda as técnicas que usei para conquistar investidores e conseguir 2 milhões para minha startup de tecnologia educacional.",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "14:20",
    views: 156800,
    likes: 8900,
    category: "Empreendedorismo",
    featured: true,
    channelName: "Camila Rodriguez",
    channelAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face"
  },
  {
    title: "De Jovem da Periferia a Empreendedor de Sucesso",
    description: "Minha jornada superando obstáculos sociais e econômicos para construir uma empresa de R$ 10M+ em faturamento.",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "18:45",
    views: 234500,
    likes: 12300,
    category: "Inspiração",
    featured: true,
    channelName: "Pedro Oliveira",
    channelAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    title: "Como Liderar uma Equipe Remota de 15 Pessoas",
    description: "Estratégias práticas de liderança que transformaram minha startup em uma empresa distribuída globalmente.",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "22:10",
    views: 89700,
    likes: 4200,
    category: "Liderança",
    featured: true,
    channelName: "Carlos Silva",
    channelAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    title: "Estratégia de Comunicação para Startup em Crescimento",
    description: "Como desenvolvi uma estratégia de comunicação que aumentou nosso engajamento em 400% em 6 meses.",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "16:33",
    views: 67800,
    likes: 3100,
    category: "Marketing",
    featured: true,
    channelName: "Ana Santos",
    channelAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    title: "Design Inclusivo: App para Pessoas com Deficiência Visual",
    description: "O processo de desenvolvimento de um app que já impactou mais de 50.000 pessoas com deficiência visual no Brasil.",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "19:55",
    views: 145600,
    likes: 7800,
    category: "Tecnologia",
    featured: true,
    channelName: "Mariana Costa",
    channelAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  },
  {
    title: "Implementação de ESG em Startup Brasileira",
    description: "Como implementamos práticas ESG desde o início e conseguimos certificação B Corp em apenas 2 anos.",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "25:40",
    views: 78900,
    likes: 3600,
    category: "Sustentabilidade",
    featured: true,
    channelName: "Julia Santos",
    channelAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
  }
];

const featuredProjetos = [
  {
    name: "EcoTech - Soluções Sustentáveis para Cidades",
    description: "Plataforma IoT para monitoramento de qualidade do ar e gestão inteligente de resíduos urbanos. Projeto já implementado em 5 cidades brasileiras.",
    categoria: "Tecnologia Verde",
    status: "concluido",
    seguidores: 340,
    sponsors: [],
    criado_em: new Date('2024-09-15'),
    portfolio_id: null,
    desafio_id: null,
    tech_stack: ["IoT", "Python", "React", "MongoDB", "AWS"],
    impact_metrics: {
      cities_impacted: 5,
      co2_saved: "15 toneladas",
      waste_reduced: "2.3 toneladas"
    }
  },
  {
    name: "FinanceAI - Educação Financeira Personalizada",
    description: "Aplicativo de IA que ensina educação financeira através de gamificação e análise de comportamento de gastos. Mais de 10.000 usuários ativos.",
    categoria: "FinTech",
    status: "em_andamento",
    seguidores: 567,
    sponsors: [],
    criado_em: new Date('2024-10-22'),
    portfolio_id: null,
    desafio_id: null,
    tech_stack: ["React Native", "TensorFlow", "Node.js", "PostgreSQL"],
    impact_metrics: {
      active_users: 10500,
      money_saved_by_users: "R$ 2.3M",
      financial_goals_achieved: 3200
    }
  },
  {
    name: "AgriConnect - Marketplace para Pequenos Produtores",
    description: "Conecta pequenos produtores rurais diretamente aos consumidores, eliminando intermediários e aumentando a renda dos agricultores.",
    categoria: "AgriTech",
    status: "em_andamento",
    seguidores: 289,
    sponsors: [],
    criado_em: new Date('2024-08-10'),
    portfolio_id: null,
    desafio_id: null,
    tech_stack: ["Next.js", "Express", "MySQL", "Stripe", "Google Maps API"],
    impact_metrics: {
      farmers_benefited: 450,
      revenue_increase: "35%",
      products_sold: 12000
    }
  }
];

const featuredDesafios = [
  {
    title: "Hackathon Sustentabilidade Urbana 2025",
    description: "Desenvolva soluções inovadoras para tornar as cidades brasileiras mais sustentáveis e resilientes às mudanças climáticas.",
    prazo_final: new Date('2025-09-15'),
    premio: "R$ 50.000 + incubação",
    participants: 456,
    featured: true,
    category_name: "Sustentabilidade",
    requirements: [
      "Solução deve impactar pelo menos 10.000 pessoas",
      "Usar tecnologia sustentável",
      "Apresentar viabilidade econômica",
      "Protótipo funcional obrigatório"
    ],
    sponsors: ["Instituto Verde", "TechSustain", "Prefeitura de São Paulo"]
  },
  {
    title: "Desafio HealthTech: Saúde para Todos",
    description: "Crie tecnologias que democratizem o acesso à saúde de qualidade, especialmente em regiões remotas do Brasil.",
    prazo_final: new Date('2025-08-30'),
    premio: "R$ 30.000 + mentoria especializada",
    participants: 234,
    featured: true,
    category_name: "Saúde",
    requirements: [
      "Foco em telemedicina ou diagnóstico remoto",
      "Solução deve ser economicamente acessível",
      "Validação médica necessária",
      "Demonstrar impacto social mensurável"
    ],
    sponsors: ["Hospital Sírio-Libanês", "MedTech Brasil", "Ministério da Saúde"]
  },
  {
    title: "EdTech Revolution: Educação do Futuro",
    description: "Desenvolva ferramentas educacionais que revolucionem o aprendizado e reduzam a desigualdade educacional no país.",
    prazo_final: new Date('2025-10-20'),
    premio: "R$ 40.000 + programa de aceleração",
    participants: 378,
    featured: true,
    category_name: "Educação",
    requirements: [
      "Usar IA ou realidade virtual/aumentada",
      "Adaptar-se a diferentes níveis socioeconômicos",
      "Comprovar melhoria no aprendizado",
      "Interface intuitiva e acessível"
    ],
    sponsors: ["Fundação Lemann", "Google for Education", "BNDES"]
  }
];

export async function POST() {
  try {
    await connectDB();

    // Create or find channels for videos
    const createdChannels = [];
    const createdVideos = [];
    const createdProjetos = [];
    const createdDesafios = [];

    // Create channels and videos
    for (const videoData of featuredVideos) {
      // Find or create user for channel
      let user = await User.findOne({ name: videoData.channelName });
      if (!user) {
        user = await User.create({
          name: videoData.channelName,
          email: `${videoData.channelName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          password: 'hashedpassword123',
          account_type: 'talent',
          avatar: videoData.channelAvatar,
          bio: `Empreendedor(a) especialista em ${videoData.category}`,
          verified: true,
          categories: [videoData.category]
        });
      }

      // Find or create channel
      let channel = await Channel.findOne({ name: videoData.channelName });
      if (!channel) {
        channel = await Channel.create({
          name: videoData.channelName,
          description: `Canal de ${videoData.channelName} sobre ${videoData.category}`,
          avatar: videoData.channelAvatar,
          category: videoData.category,
          owner_id: user._id,
          subscribers: Math.floor(videoData.views / 10),
          verified: true,
          total_views: videoData.views,
          videos_count: 1
        });
        createdChannels.push(channel);
      }

      // Create video
      const video = await Video.create({
        title: videoData.title,
        description: videoData.description,
        video_url: videoData.video_url,
        duration: videoData.duration,
        views: videoData.views,
        likes: videoData.likes,
        category: videoData.category,
        featured: videoData.featured,
        channel_id: channel._id,
        upload_date: new Date(),
        tags: [videoData.category, 'empreendedorismo', 'startup', 'brasileiro']
      });
      createdVideos.push(video);
    }

    // Create projetos
    for (const projetoData of featuredProjetos) {
      // Find a talent user to be the leader
      const talentUser = await User.findOne({ account_type: 'talent' });
      
      const projeto = await Projeto.create({
        ...projetoData,
        talento_lider_id: talentUser?._id,
        criador_id: talentUser?._id,
        tags: projetoData.tech_stack,
        metrics: projetoData.impact_metrics
      });
      createdProjetos.push(projeto);
    }

    // Create desafios
    for (const desafioData of featuredDesafios) {
      const desafio = await Desafio.create({
        title: desafioData.title,
        description: desafioData.description,
        prazo_final: desafioData.prazo_final,
        premio: desafioData.premio,
        participants: desafioData.participants,
        featured: desafioData.featured,
        requirements: desafioData.requirements,
        sponsors: desafioData.sponsors,
        category_name: desafioData.category_name,
        status: 'ativo',
        created_at: new Date()
      });
      createdDesafios.push(desafio);
    }

    return NextResponse.json({
      message: "Conteúdo em destaque criado com sucesso!",
      results: {
        channels: createdChannels.length,
        videos: createdVideos.length,
        projetos: createdProjetos.length,
        desafios: createdDesafios.length
      },
      success: true
    });

  } catch (error) {
    console.error("Error seeding featured content:", error);
    return NextResponse.json(
      { error: "Erro ao criar conteúdo em destaque" },
      { status: 500 }
    );
  }
}
