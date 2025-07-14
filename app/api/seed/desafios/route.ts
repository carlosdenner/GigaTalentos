import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Desafio from '@/models/Desafio';
import Category from '@/models/Category';

const desafiosData = [
  {
    title: "Inovação em FinTech",
    description: "Desenvolva uma solução inovadora para pagamentos digitais ou gestão financeira pessoal que possa transformar o mercado brasileiro.",
    category: "Criatividade & Inovação",
    difficulty: "Avançado",
    duration: "6 semanas",
    participants: 127,
    prizes: [
      { position: "1º Lugar", description: "Mentoria com CEO de startup unicórnio", value: "R$ 10.000" },
      { position: "2º Lugar", description: "Programa de aceleração", value: "R$ 5.000" },
      { position: "3º Lugar", description: "Workshop intensivo", value: "R$ 2.500" }
    ],
    requirements: [
      "Prototipo funcional",
      "Plano de negócios",
      "Apresentação em pitch de 5 minutos",
      "Análise de mercado"
    ],
    status: "Ativo",
    featured: true,
    start_date: new Date('2025-07-01'),
    end_date: new Date('2025-08-15')
  },
  {
    title: "Liderança Digital",
    description: "Demonstre suas habilidades de liderança criando e executando um projeto que impacte positivamente sua comunidade local.",
    category: "Liderança & Colaboração",
    difficulty: "Intermediário",
    duration: "4 semanas",
    participants: 89,
    prizes: [
      { position: "1º Lugar", description: "Programa de liderança executiva", value: "R$ 8.000" },
      { position: "2º Lugar", description: "Mentoria com líder corporativo", value: "R$ 4.000" }
    ],
    requirements: [
      "Projeto com impacto social mensurável",
      "Equipe de pelo menos 3 pessoas",
      "Relatório de resultados",
      "Vídeo de apresentação"
    ],
    status: "Ativo",
    featured: true,
    start_date: new Date('2025-07-10'),
    end_date: new Date('2025-08-10')
  },
  {
    title: "Algoritmo Inteligente",
    description: "Crie um algoritmo de machine learning que resolva um problema real do mercado brasileiro utilizando dados abertos.",
    category: "Cognição & Competência Técnica",
    difficulty: "Avançado",
    duration: "8 semanas",
    participants: 156,
    prizes: [
      { position: "1º Lugar", description: "Estágio remunerado em Big Tech", value: "R$ 15.000" },
      { position: "2º Lugar", description: "Curso de especialização", value: "R$ 8.000" },
      { position: "3º Lugar", description: "Certificação internacional", value: "R$ 3.000" }
    ],
    requirements: [
      "Código documentado no GitHub",
      "Dataset e modelo treinado",
      "Artigo técnico explicativo",
      "Demo funcional"
    ],
    status: "Em Breve",
    featured: true,
    start_date: new Date('2025-08-01'),
    end_date: new Date('2025-09-30')
  },
  {
    title: "Comunicação Persuasiva",
    description: "Crie uma campanha de comunicação que promova empreendedorismo social entre jovens brasileiros.",
    category: "Comunicação & Persuasão",
    difficulty: "Intermediário",
    duration: "3 semanas",
    participants: 73,
    prizes: [
      { position: "1º Lugar", description: "Workshop com especialista em marketing", value: "R$ 6.000" },
      { position: "2º Lugar", description: "Curso de comunicação digital", value: "R$ 3.000" }
    ],
    requirements: [
      "Campanha multiplataforma",
      "Métricas de engajamento",
      "Estratégia de comunicação",
      "Relatório de impacto"
    ],
    status: "Ativo",
    featured: false,
    start_date: new Date('2025-07-15'),
    end_date: new Date('2025-08-05')
  },
  {
    title: "Resiliência Empreendedora",
    description: "Documente sua jornada superando um desafio real em seu negócio ou projeto pessoal, compartilhando lições aprendidas.",
    category: "Resiliência & Adaptabilidade",
    difficulty: "Iniciante",
    duration: "2 semanas",
    participants: 45,
    prizes: [
      { position: "1º Lugar", description: "Mentoria com empreendedor serial", value: "R$ 4.000" },
      { position: "2º Lugar", description: "Livros e recursos de desenvolvimento", value: "R$ 1.500" }
    ],
    requirements: [
      "Relato pessoal autêntico",
      "Evidências do desafio enfrentado",
      "Lições aprendidas documentadas",
      "Plano de aplicação futura"
    ],
    status: "Ativo",
    featured: false,
    start_date: new Date('2025-07-20'),
    end_date: new Date('2025-08-03')
  },
  {
    title: "Impacto Social Sustentável",
    description: "Desenvolva uma iniciativa que combine lucro com impacto social positivo, seguindo princípios de sustentabilidade.",
    category: "Consciência Social & Ética",
    difficulty: "Intermediário",
    duration: "5 semanas",
    participants: 112,
    prizes: [
      { position: "1º Lugar", description: "Investimento seed para projeto", value: "R$ 12.000" },
      { position: "2º Lugar", description: "Aceleração em incubadora social", value: "R$ 6.000" },
      { position: "3º Lugar", description: "Consultoria em sustentabilidade", value: "R$ 3.000" }
    ],
    requirements: [
      "Modelo de negócio sustentável",
      "Métricas de impacto social",
      "Análise de viabilidade financeira",
      "Parcerias estratégicas"
    ],
    status: "Em Breve",
    featured: true,
    start_date: new Date('2025-08-15'),
    end_date: new Date('2025-09-20')
  }
];

export async function POST() {
  try {
    await connectDB();

    // Clear existing desafios
    await Desafio.deleteMany({});

    // Get categories to link desafios
    const categories = await Category.find({});
    const categoryMap = new Map(categories.map(cat => [cat.name, cat._id]));

    // Create desafios with category references
    const desafiosWithCategories = desafiosData.map(desafio => ({
      ...desafio,
      category: categoryMap.get(desafio.category)
    }));

    const createdDesafios = await Desafio.insertMany(desafiosWithCategories);

    return NextResponse.json({
      message: 'Desafios criados com sucesso',
      count: createdDesafios.length,
      desafios: createdDesafios
    });
  } catch (error) {
    console.error('Error seeding desafios:', error);
    return NextResponse.json(
      { error: 'Erro ao criar desafios' },
      { status: 500 }
    );
  }
}
