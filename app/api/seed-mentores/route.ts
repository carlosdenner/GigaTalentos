import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const mentoresSeed = [
  {
    email: "mentor1@gigatalentos.com",
    name: "Dr. Ricardo Mendes",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    account_type: "mentor",
    bio: "Ex-CEO de unicórnio brasileiro. Especialista em scale-up e captação de investimentos. Mentor de 50+ startups exitosas.",
    location: "São Paulo, SP",
    skills: ["Captação de Investimento", "Scale-up", "Estratégia Corporativa", "Mentoria", "M&A"],
    experience: "15+ anos construindo e escalando empresas de tecnologia",
    portfolio: "https://ricardomendes.mentor",
    categories: ["Liderança & Colaboração", "Comunicação & Persuasão"],
    verified: true,
    projects_count: 0
  },
  {
    email: "mentor2@gigatalentos.com", 
    name: "Dra. Patricia Campos",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop",
    account_type: "mentor",
    bio: "Investidora anjo e especialista em ESG. Fundadora de aceleradora focada em impacto social. PhD em Sustentabilidade.",
    location: "Rio de Janeiro, RJ",
    skills: ["Investimento Anjo", "ESG", "Sustentabilidade", "Aceleração", "Impact Investment"],
    experience: "12 anos investindo em startups de impacto social",
    portfolio: "https://patriciacampos.impact",
    categories: ["Consciência Social & Ética", "Liderança & Colaboração"],
    verified: true,
    projects_count: 0
  },
  {
    email: "mentor3@gigatalentos.com",
    name: "Prof. Antonio Ribeiro", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    account_type: "mentor",
    bio: "CTO de big tech. Especialista em IA e Machine Learning. Professor universitário e orientador de pesquisas em inovação.",
    location: "Campinas, SP",
    skills: ["Inteligência Artificial", "Machine Learning", "Cloud Computing", "Pesquisa", "Inovação Tecnológica"],
    experience: "20+ anos liderando times de tecnologia e pesquisa",
    portfolio: "https://antonioribeiro.tech",
    categories: ["Habilidade Cognitiva & Técnica", "Criatividade & Inovação"],
    verified: true,
    projects_count: 0
  },
  {
    email: "mentor4@gigatalentos.com",
    name: "Sra. Beatriz Lima",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", 
    account_type: "mentor",
    bio: "Especialista em comunicação corporativa e brand building. Ajudou 100+ startups a construir suas marcas e narrativas.",
    location: "Brasília, DF",
    skills: ["Brand Building", "Comunicação Corporativa", "PR", "Marketing Estratégico", "Storytelling"],
    experience: "10 anos construindo marcas de startups para scale-ups",
    portfolio: "https://beatrizlima.brand",
    categories: ["Comunicação & Persuasão", "Criatividade & Inovação"],
    verified: true,
    projects_count: 0
  }
];

export async function POST() {
  try {
    await connectDB();

    // Verificar se já existem mentores
    const existingMentors = await User.find({ account_type: 'mentor' });
    if (existingMentors.length > 0) {
      return NextResponse.json({
        message: `${existingMentors.length} mentores já existem no banco`,
        mentores: existingMentors.map(m => ({ id: m._id, name: m.name, email: m.email }))
      });
    }

    const mentoresCriados = [];

    for (const dadosMentor of mentoresSeed) {
      const hashedPassword = await bcrypt.hash('mentor123', 12);
      
      const mentor = await User.create({
        ...dadosMentor,
        password: hashedPassword,
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Último ano
      });

      mentoresCriados.push(mentor);
    }

    return NextResponse.json({
      message: `${mentoresCriados.length} mentores criados com sucesso!`,
      mentores: mentoresCriados.map(m => ({
        id: m._id,
        name: m.name,
        email: m.email,
        specialties: m.categories
      }))
    });

  } catch (error: any) {
    console.error('Erro ao criar mentores seed:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
