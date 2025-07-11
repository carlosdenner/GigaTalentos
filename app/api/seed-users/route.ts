import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await connectDB();

    // Clear existing demo users (but keep real registered users)
    await User.deleteMany({ email: { $regex: /demo\d+@/ } });

    const demoUsers = [
      {
        name: "Ana Costa",
        email: "demo1@gigatalentos.com",
        password: await bcrypt.hash("demo123", 12),
        bio: "Desenvolvedora Full-Stack apaixonada por soluções inovadoras. Especialista em React, Node.js e Python. Busco oportunidades para aplicar tecnologia em problemas sociais reais.",
        account_type: "talent",
        location: "São Paulo, SP",
        skills: ["JavaScript", "Python", "React", "Node.js", "MongoDB", "AWS"],
        experience: "3 anos de experiência em desenvolvimento web",
        portfolio: "https://anacosta.dev",
        categories: ["Habilidade Cognitiva & Técnica", "Criatividade & Inovação"],
        avatar: "/placeholder-user.jpg",
        verified: true,
        projects_count: 8,
        created_at: new Date('2024-03-15')
      },
      {
        name: "Carlos Silva",
        email: "demo2@gigatalentos.com", 
        password: await bcrypt.hash("demo123", 12),
        bio: "Empreendedor serial com foco em startups de impacto social. Fundador de 2 empresas exitosas. Mentor de jovens empreendedores e palestrante sobre liderança.",
        account_type: "talent",
        location: "Rio de Janeiro, RJ",
        skills: ["Liderança", "Gestão de Equipes", "Estratégia", "Fundraising", "Marketing Digital"],
        experience: "10+ anos liderando equipes e construindo negócios",
        portfolio: "https://carlossilva.com.br",
        categories: ["Liderança & Colaboração", "Comunicação & Persuasão"],
        avatar: "/placeholder-user.jpg",
        verified: true,
        projects_count: 15,
        created_at: new Date('2024-02-01')
      },
      {
        name: "Marina Alves",
        email: "demo3@gigatalentos.com",
        password: await bcrypt.hash("demo123", 12),
        bio: "Designer UX/UI focada em acessibilidade e inclusão digital. Trabalho para criar experiências que impactem positivamente pessoas com deficiência.",
        account_type: "talent",
        location: "Belo Horizonte, MG",
        skills: ["Design UX/UI", "Figma", "Pesquisa com Usuários", "Acessibilidade", "Design Thinking"],
        experience: "5 anos criando experiências digitais inclusivas",
        portfolio: "https://marinaalves.design",
        categories: ["Criatividade & Inovação", "Consciência Social & Ética"],
        avatar: "/placeholder-user.jpg",
        verified: true,
        projects_count: 12,
        created_at: new Date('2024-01-20')
      },
      {
        name: "Roberto Ferreira",
        email: "demo4@gigatalentos.com",
        password: await bcrypt.hash("demo123", 12),
        bio: "Analista de dados especializado em Business Intelligence. Transformo dados em insights estratégicos para startups e scale-ups brasileiras.",
        account_type: "talent", 
        location: "Brasília, DF",
        skills: ["Python", "SQL", "Power BI", "Machine Learning", "Estatística", "Análise de Dados"],
        experience: "6 anos analisando dados para tomada de decisão",
        portfolio: "https://robertoferreira.data",
        categories: ["Habilidade Cognitiva & Técnica", "Comunicação & Persuasão"],
        avatar: "/placeholder-user.jpg",
        verified: true,
        projects_count: 10,
        created_at: new Date('2024-04-10')
      },
      {
        name: "Julia Santos",
        email: "demo5@gigatalentos.com",
        password: await bcrypt.hash("demo123", 12),
        bio: "Especialista em sustentabilidade e ESG. Desenvolvo estratégias para empresas que querem causar impacto social positivo sem comprometer o crescimento.",
        account_type: "talent",
        location: "Curitiba, PR",
        skills: ["Sustentabilidade", "ESG", "Gestão Ambiental", "Relatórios de Impacto", "Estratégia"],
        experience: "8 anos implementando práticas sustentáveis",
        portfolio: "https://juliasantos.sustentavel",
        categories: ["Consciência Social & Ética", "Liderança & Colaboração"],
        avatar: "/placeholder-user.jpg",
        verified: true,
        projects_count: 6,
        created_at: new Date('2024-03-05')
      },
      {
        name: "Pedro Oliveira",
        email: "demo6@gigatalentos.com",
        password: await bcrypt.hash("demo123", 12),
        bio: "Jovem empreendedor que superou adversidades para criar sua primeira startup. Apaixonado por tecnologia educacional e democratização do conhecimento.",
        account_type: "talent",
        location: "Fortaleza, CE",
        skills: ["Empreendedorismo", "EdTech", "Resiliência", "Vendas", "Produto"],
        experience: "2 anos construindo minha primeira startup",
        portfolio: "https://pedrooliveira.edtech",
        categories: ["Resiliência & Adaptabilidade", "Criatividade & Inovação"],
        avatar: "/placeholder-user.jpg",
        verified: true,
        projects_count: 4,
        created_at: new Date('2024-05-01')
      },
      {
        name: "Camila Rodriguez",
        email: "demo7@gigatalentos.com",
        password: await bcrypt.hash("demo123", 12),
        bio: "Comunicadora estratégica especializada em storytelling para startups. Ajudo empreendedores a construir narrativas poderosas que conectam com investidores.",
        account_type: "talent",
        location: "Porto Alegre, RS",
        skills: ["Storytelling", "Comunicação", "Pitches", "Marketing", "Relações Públicas"],
        experience: "4 anos ajudando startups a se comunicarem melhor",
        portfolio: "https://camilarodriguez.stories",
        categories: ["Comunicação & Persuasão", "Criatividade & Inovação"],
        avatar: "/placeholder-user.jpg",
        verified: true,
        projects_count: 9,
        created_at: new Date('2024-02-28')
      },
      {
        name: "Lucas Mendes",
        email: "demo8@gigatalentos.com",
        password: await bcrypt.hash("demo123", 12),
        bio: "Desenvolvedor mobile com foco em apps que resolvem problemas urbanos. Especialista em React Native e desenvolvimento ágil.",
        account_type: "talent",
        location: "Salvador, BA",
        skills: ["React Native", "Flutter", "JavaScript", "Mobile Development", "Agile"],
        experience: "4 anos desenvolvendo apps mobile",
        portfolio: "https://lucasmendes.mobile",
        categories: ["Habilidade Cognitiva & Técnica", "Resiliência & Adaptabilidade"],
        avatar: "/placeholder-user.jpg",
        verified: true,
        projects_count: 11,
        created_at: new Date('2024-04-15')
      }
    ];

    const users = await User.insertMany(demoUsers);

    return NextResponse.json({
      message: "Usuários demo criados com sucesso",
      users: users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        account_type: user.account_type,
        verified: user.verified
      }))
    });
  } catch (error) {
    console.error("Error seeding users:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuários demo" },
      { status: 500 }
    );
  }
}
