import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Desafio from '@/models/Desafio';
import Category from '@/models/Category';
import User from '@/models/User';

export async function POST() {
  try {
    await connectDB();

    // Clear existing desafios
    await Desafio.deleteMany({});

    // Get categories to link desafios
    const categories = await Category.find({});
    
    // Get mentors to assign as creators
    const mentors = await User.find({ account_type: 'mentor' });
    
    // Helper function to find category safely
    const findCategory = (searchTerm: string) => {
      return categories.find(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || categories[0]; // Fallback to first category if not found
    };
    
    // Helper function to get random mentor
    const getRandomMentor = () => {
      return mentors[Math.floor(Math.random() * mentors.length)];
    };
    
    const desafiosData = [
      {
        title: "Startup Pitch Challenge",
        description: "Crie um pitch de 3 minutos para sua ideia de startup. Demonstre o problema, solução, mercado e modelo de negócio.",
        category: findCategory('comunicação')._id,
        difficulty: "Intermediário",
        duration: "2 semanas",
        participants: 127,
        prizes: [
          { position: "1º Lugar", description: "Mentoria com investidor", value: "R$ 10.000" },
          { position: "2º Lugar", description: "Curso de empreendedorismo", value: "R$ 5.000" },
          { position: "3º Lugar", description: "Networking premium", value: "R$ 2.000" }
        ],
        requirements: ["Pitch em vídeo de até 3 minutos", "Apresentação PDF", "Plano de negócio resumido"],
        status: "Ativo",
        start_date: new Date('2025-07-01'),
        end_date: new Date('2025-07-15'),
        featured: true,
        created_by: getRandomMentor()?._id
      },
      {
        title: "Solução Tech Inovadora",
        description: "Desenvolva uma solução tecnológica para um problema social brasileiro. Use criatividade e inovação para impactar positivamente a sociedade.",
        category: findCategory('criatividade')._id,
        difficulty: "Avançado",
        duration: "1 mês",
        participants: 89,
        prizes: [
          { position: "1º Lugar", description: "Aceleradora de startups", value: "R$ 25.000" },
          { position: "2º Lugar", description: "Mentoria técnica", value: "R$ 15.000" }
        ],
        requirements: ["Protótipo funcional", "Código-fonte no GitHub", "Documentação técnica"],
        status: "Ativo",
        start_date: new Date('2025-07-01'),
        end_date: new Date('2025-08-01'),
        featured: true,
        created_by: getRandomMentor()?._id
      },
      {
        title: "Liderança em Equipe",
        description: "Demonstre suas habilidades de liderança organizando e executando um projeto em equipe. Mostre colaboração e gestão eficazes.",
        category: findCategory('liderança')._id,
        difficulty: "Intermediário",
        duration: "3 semanas",
        participants: 156,
        prizes: [
          { position: "1º Lugar", description: "Workshop de liderança", value: "R$ 8.000" },
          { position: "2º Lugar", description: "Certificação em gestão", value: "R$ 4.000" }
        ],
        requirements: ["Projeto em equipe (3-5 pessoas)", "Relatório de gestão", "Vídeo de apresentação"],
        status: "Ativo",
        start_date: new Date('2025-07-05'),
        end_date: new Date('2025-07-26'),
        featured: true,
        created_by: getRandomMentor()?._id
      },
      {
        title: "Análise de Dados para Negócios",
        description: "Use suas habilidades analíticas para resolver um case real de negócios. Demonstre pensamento crítico e competências técnicas.",
        category: findCategory('cognitiva')._id,
        difficulty: "Avançado",
        duration: "2 semanas",
        participants: 73,
        prizes: [
          { position: "1º Lugar", description: "Estágio em consultoria", value: "R$ 12.000" },
          { position: "2º Lugar", description: "Curso de analytics", value: "R$ 6.000" }
        ],
        requirements: ["Análise completa com visualizações", "Relatório executivo", "Código de análise"],
        status: "Em Breve",
        start_date: new Date('2025-07-20'),
        end_date: new Date('2025-08-03'),
        featured: false,
        created_by: getRandomMentor()?._id
      },
      {
        title: "Resiliência Empreendedora",
        description: "Compartilhe uma história pessoal de superação e como ela moldou sua mentalidade empreendedora. Inspire outros com sua jornada.",
        category: findCategory('resiliência')._id,
        difficulty: "Iniciante",
        duration: "1 semana",
        participants: 201,
        prizes: [
          { position: "1º Lugar", description: "Coaching pessoal", value: "R$ 5.000" },
          { position: "2º Lugar", description: "Livros de desenvolvimento", value: "R$ 1.000" }
        ],
        requirements: ["Vídeo depoimento (5-7 min)", "Texto reflexivo (500 palavras)"],
        status: "Ativo",
        start_date: new Date('2025-07-10'),
        end_date: new Date('2025-07-17'),
        featured: true
      },
      {
        title: "Impacto Social Sustentável",
        description: "Proponha uma iniciativa que combine consciência social com sustentabilidade. Demonstre ética e responsabilidade empresarial.",
        category: findCategory('social')._id,
        difficulty: "Intermediário",
        duration: "3 semanas",
        participants: 94,
        prizes: [
          { position: "1º Lugar", description: "Parceria com ONG", value: "R$ 15.000" },
          { position: "2º Lugar", description: "Certificação ESG", value: "R$ 8.000" }
        ],
        requirements: ["Proposta detalhada", "Plano de implementação", "Análise de impacto"],
        status: "Em Breve",
        start_date: new Date('2025-07-25'),
        end_date: new Date('2025-08-15'),
        featured: false,
        created_by: getRandomMentor()?._id
      }
    ];

    const desafios = await Desafio.insertMany(desafiosData);

    return NextResponse.json({
      message: "Desafios criados com sucesso",
      desafios: desafios
    });
  } catch (error) {
    console.error("Error seeding desafios:", error);
    return NextResponse.json(
      { error: "Erro ao criar desafios" },
      { status: 500 }
    );
  }
}
