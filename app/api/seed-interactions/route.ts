import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ParticipationRequest from '@/models/ParticipationRequest';
import ProjectFavorite from '@/models/ProjectFavorite';
import Projeto from '@/models/Projeto';
import User from '@/models/User';

const participationRequestsData = [
  {
    mensagem: "Sou desenvolvedor fullstack com 3 anos de experiência em React e Node.js. Gostaria muito de contribuir com o projeto EcoTech, especialmente na parte de dashboard e visualização de dados dos sensores.",
    area_interesse: "Frontend & Dashboard",
    experiencia_relevante: "Desenvolvi sistemas de monitoramento em tempo real para startups, com expertise em visualização de dados ambientais.",
    habilidades_oferecidas: ["React", "TypeScript", "D3.js", "MongoDB", "API Integration"]
  },
  {
    mensagem: "Como designer UX/UI com foco em sustentabilidade, acredito que posso agregar muito valor ao CreativeHub criando uma experiência mais intuitiva para artistas e empresas se conectarem.",
    area_interesse: "UX/UI Design",
    experiencia_relevante: "Designer em agências criativas, com projetos premiados para marcas sustentáveis e ONGs ambientais.",
    habilidades_oferecidas: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design System"]
  },
  {
    mensagem: "Tenho experiência em gestão de projetos ágeis e liderança de equipes. Gostaria de contribuir com o TeamSync implementando metodologias de bem-estar e produtividade que já testei em empresas anteriores.",
    area_interesse: "Product Management",
    experiencia_relevante: "Product Manager em startups, com foco em cultura organizacional e ferramentas de produtividade.",
    habilidades_oferecidas: ["Scrum", "OKRs", "Team Leadership", "Product Strategy", "Data Analysis"]
  },
  {
    mensagem: "Sou especialista em marketing digital e growth hacking. Vejo grande potencial no AgriConnect e gostaria de ajudar a aumentar a adoção entre pequenos produtores rurais através de estratégias de marketing direcionado.",
    area_interesse: "Marketing & Growth",
    experiencia_relevante: "Growth Lead em agtech, com campanhas que resultaram em 300% de crescimento de usuários rurais.",
    habilidades_oferecidas: ["Growth Hacking", "Google Ads", "Content Marketing", "SEO", "Analytics"]
  },
  {
    mensagem: "Como desenvolvedora mobile com paixão por educação, quero contribuir com o EduVision criando uma experiência mobile inclusiva que funcione bem mesmo com conectividade limitada.",
    area_interesse: "Mobile Development",
    experiencia_relevante: "Desenvolvi apps educacionais que funcionam offline, usados por mais de 50mil estudantes em áreas rurais.",
    habilidades_oferecidas: ["React Native", "Flutter", "Offline-First", "Progressive Web Apps", "Accessibility"]
  },
  {
    mensagem: "Tenho background em ciência de dados e machine learning. Gostaria de ajudar o HealthAI a melhorar os algoritmos de predição e criar dashboards mais informativos para os profissionais de saúde.",
    area_interesse: "Data Science & AI",
    experiencia_relevante: "Data Scientist em healthtech, com modelos de ML em produção para diagnóstico assistido.",
    habilidades_oferecidas: ["Python", "TensorFlow", "Data Visualization", "Statistical Analysis", "Healthcare APIs"]
  }
];

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await ParticipationRequest.deleteMany({});
    await ProjectFavorite.deleteMany({});

    // Get users and projects
    const talents = await User.find({ account_type: 'talent' }).limit(20);
    const projetos = await Projeto.find().limit(15);

    if (talents.length === 0 || projetos.length === 0) {
      return NextResponse.json({
        error: 'Não há usuários talents ou projetos suficientes. Execute os seeds de usuários e projetos primeiro.'
      }, { status: 400 });
    }

    const participationRequests = [];
    const projectFavorites = [];

    // Create participation requests
    for (let i = 0; i < Math.min(participationRequestsData.length, projetos.length); i++) {
      const requestData = participationRequestsData[i];
      const projeto = projetos[i];
      const talent = talents[i % talents.length];
      
      // Make sure talent is not requesting their own project
      if (talent._id.toString() !== projeto.talento_lider_id.toString()) {
        const status = Math.random() > 0.7 ? 'aprovado' : Math.random() > 0.3 ? 'pendente' : 'rejeitado';
        
        const participationRequest = await ParticipationRequest.create({
          projeto_id: projeto._id,
          solicitante_id: talent._id,
          lider_id: projeto.talento_lider_id,
          mensagem: requestData.mensagem,
          area_interesse: requestData.area_interesse,
          experiencia_relevante: requestData.experiencia_relevante,
          habilidades_oferecidas: requestData.habilidades_oferecidas,
          status: status,
          criado_em: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000), // Random date within last 15 days
          respondido_em: status !== 'pendente' ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) : undefined,
          resposta_lider: status === 'aprovado' 
            ? "Perfeito! Suas habilidades são exatamente o que precisamos. Seja bem-vindo ao time!"
            : status === 'rejeitado' 
            ? "Obrigado pelo interesse! Infelizmente já temos a equipe completa para essa área específica."
            : undefined
        });

        participationRequests.push(participationRequest);

        // If approved, add to project participants
        if (status === 'aprovado') {
          await Projeto.findByIdAndUpdate(
            projeto._id,
            { $addToSet: { participantes_aprovados: talent._id } }
          );
        }
      }
    }

    // Create additional participation requests for variety
    for (let i = 0; i < 10; i++) {
      const projeto = projetos[Math.floor(Math.random() * projetos.length)];
      const talent = talents[Math.floor(Math.random() * talents.length)];
      
      // Make sure talent is not requesting their own project
      if (talent._id.toString() !== projeto.talento_lider_id.toString()) {
        try {
          const randomData = participationRequestsData[Math.floor(Math.random() * participationRequestsData.length)];
          const status = Math.random() > 0.6 ? 'pendente' : Math.random() > 0.5 ? 'aprovado' : 'rejeitado';
          
          const participationRequest = await ParticipationRequest.create({
            projeto_id: projeto._id,
            solicitante_id: talent._id,
            lider_id: projeto.talento_lider_id,
            mensagem: randomData.mensagem,
            area_interesse: randomData.area_interesse,
            experiencia_relevante: randomData.experiencia_relevante,
            habilidades_oferecidas: randomData.habilidades_oferecidas,
            status: status,
            criado_em: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000),
            respondido_em: status !== 'pendente' ? new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000) : undefined,
            resposta_lider: status === 'aprovado' 
              ? "Aceito! Vamos conversar sobre como você pode contribuir."
              : status === 'rejeitado' 
              ? "No momento não temos vagas para esse perfil, mas obrigado pelo interesse!"
              : undefined
          });

          participationRequests.push(participationRequest);

          if (status === 'aprovado') {
            await Projeto.findByIdAndUpdate(
              projeto._id,
              { $addToSet: { participantes_aprovados: talent._id } }
            );
          }
        } catch (error) {
          // Skip duplicates (same user requesting same project)
          continue;
        }
      }
    }

    // Create project favorites
    for (let i = 0; i < talents.length; i++) {
      const talent = talents[i];
      
      // Each talent favorites 2-5 random projects
      const numFavorites = Math.floor(Math.random() * 4) + 2;
      const shuffledProjects = [...projetos].sort(() => Math.random() - 0.5);
      
      for (let j = 0; j < Math.min(numFavorites, shuffledProjects.length); j++) {
        try {
          const favorite = await ProjectFavorite.create({
            user_id: talent._id,
            projeto_id: shuffledProjects[j]._id,
            created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
          projectFavorites.push(favorite);
        } catch (error) {
          // Skip duplicates
          continue;
        }
      }
    }

    return NextResponse.json({
      message: 'Dados de interação com projetos criados com sucesso!',
      participation_requests: participationRequests.length,
      project_favorites: projectFavorites.length,
      breakdown: {
        requests_pendentes: participationRequests.filter(r => r.status === 'pendente').length,
        requests_aprovados: participationRequests.filter(r => r.status === 'aprovado').length,
        requests_rejeitados: participationRequests.filter(r => r.status === 'rejeitado').length,
      }
    });

  } catch (error: any) {
    console.error('Erro ao criar dados de interação:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
