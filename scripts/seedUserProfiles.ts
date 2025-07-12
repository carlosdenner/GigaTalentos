import mongoose from "mongoose";
import User from "../models/User";
import Projeto from "../models/Projeto";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor, defina a variável MONGODB_URI no arquivo .env.local');
}

// Dados demo para perfis completos usando usuários existentes
const userProfilesData = [
  {
    email: "demo1@gigatalentos.com", // Ana Costa
    updates: {
      name: "Ana Costa",
      bio: "Desenvolvedora Full Stack apaixonada por criar soluções inovadoras. Especialista em React, Node.js e MongoDB. Sempre em busca de novos desafios e oportunidades de crescimento.",
      experience: "3 anos de experiência como desenvolvedora front-end na TechCorp, trabalhando com equipes ágeis e entregando produtos de alta qualidade. Participei do desenvolvimento de 5 aplicações web de grande escala.",
      location: "São Paulo, SP",
      portfolio: "https://anacosta.dev",
      skills: ["React", "Node.js", "MongoDB", "TypeScript", "CSS", "Git", "Agile"],
      categories: ["Tecnologia", "Desenvolvimento Web", "Design"],
      account_type: "talent",
      avatar: "/placeholder-user.jpg"
    },
    projects: [
      {
        titulo: "E-commerce Sustentável",
        descricao: "Plataforma de e-commerce focada em produtos sustentáveis com sistema de recompensas por compras conscientes.",
        categoria: "Tecnologia",
        tags: ["React", "Node.js", "MongoDB", "Sustentabilidade"],
        video_apresentacao: "https://example.com/video1",
        status: "ativo"
      },
      {
        titulo: "App de Meditação",
        descricao: "Aplicativo mobile para meditação guiada com IA personalizada baseada no humor do usuário.",
        categoria: "Bem-estar",
        tags: ["React Native", "IA", "Wellness"],
        video_apresentacao: "https://example.com/video2",
        status: "ativo"
      }
    ]
  },
  {
    email: "mentor1@gigatalentos.com", // Dr. Ricardo Mendes
    updates: {
      name: "Dr. Ricardo Mendes",
      bio: "Mentor experiente em transformação digital e liderança tecnológica. 15+ anos ajudando startups e empresas a escalar seus produtos digitais.",
      experience: "Ex-CTO da StartupX (exit de $50M), fundador de 3 empresas de tecnologia. Mentor de mais de 100 empreendedores e desenvolvedores. Palestrante em conferências nacionais e internacionais.",
      location: "Rio de Janeiro, RJ",
      portfolio: "https://ricardomendes.com.br",
      skills: ["Liderança", "Arquitetura de Software", "Gestão de Produtos", "Mentoria", "Estratégia", "Blockchain", "AI/ML"],
      categories: ["Tecnologia", "Empreendedorismo", "Liderança"],
      account_type: "mentor",
      avatar: "/placeholder-user.jpg"
    },
    projects: [
      {
        titulo: "Programa de Mentoria TechLeaders",
        descricao: "Programa estruturado de mentoria para desenvolvedores que querem evoluir para posições de liderança técnica.",
        categoria: "Educação",
        tags: ["Mentoria", "Liderança", "Tecnologia"],
        video_apresentacao: "https://example.com/video3",
        status: "ativo"
      }
    ]
  },
  {
    email: "demo3@gigatalentos.com", // Marina Alves
    updates: {
      name: "Marina Alves",
      bio: "UX/UI Designer especializada em design thinking e experiência do usuário. Apaixonada por criar interfaces que conectam pessoas e solucionam problemas reais.",
      experience: "5 anos como UX Designer em agências e startups. Conduzi mais de 50 projetos de redesign, aumentando conversão em média 40%. Formação em Design Digital e certificações em UX Research.",
      location: "Belo Horizonte, MG",
      portfolio: "https://marinaalves.portfolio.com",
      skills: ["Figma", "Adobe Creative Suite", "UX Research", "Design Thinking", "Prototipagem", "User Testing"],
      categories: ["Design", "UX/UI", "Criatividade"],
      account_type: "talent",
      avatar: "/placeholder-user.jpg"
    },
    projects: [
      {
        titulo: "Redesign App Bancário",
        descricao: "Redesign completo da experiência do usuário de um app bancário, aumentando satisfação em 60%.",
        categoria: "Design",
        tags: ["UX Design", "Mobile", "Banking"],
        video_apresentacao: "https://example.com/video4",
        status: "ativo"
      },
      {
        titulo: "Sistema Design Inclusivo",
        descricao: "Criação de um design system focado em acessibilidade e inclusão para aplicações governamentais.",
        categoria: "Acessibilidade",
        tags: ["Design System", "Acessibilidade", "Governo"],
        video_apresentacao: "https://example.com/video5",
        status: "ativo"
      }
    ]
  },
  {
    email: "demo5@gigatalentos.com", // Julia Santos
    updates: {
      name: "Julia Santos",
      bio: "Especialista em Growth Marketing e Marketing Digital. Ajudo empresas a escalar através de estratégias data-driven e campanhas criativas.",
      experience: "7 anos em marketing digital, passando por startups unicórnio e grandes corporações. Especialista em growth hacking, SEO/SEM, social media e analytics. Aumentei revenue em 300% na última empresa.",
      location: "Florianópolis, SC",
      portfolio: "https://juliagrowth.com",
      skills: ["Growth Marketing", "Google Analytics", "SEO", "Social Media", "Data Analysis", "A/B Testing"],
      categories: ["Marketing", "Crescimento", "Dados"],
      account_type: "talent",
      avatar: "/placeholder-user.jpg"
    },
    projects: [
      {
        titulo: "Campanha Viral #TechParaTodos",
        descricao: "Campanha de marketing que alcançou 2M de pessoas, promovendo inclusão digital em comunidades carentes.",
        categoria: "Marketing",
        tags: ["Marketing Viral", "Inclusão Social", "Impacto"],
        video_apresentacao: "https://example.com/video6",
        status: "ativo"
      }
    ]
  },
  {
    email: "mentor2@gigatalentos.com", // Dra. Patricia Campos
    updates: {
      name: "Dra. Patricia Campos",
      bio: "Mentora em Business Strategy e Inovação. Ajudo empreendedores a transformar ideias em negócios sustentáveis e escaláveis.",
      experience: "10+ anos como consultora estratégica, trabalhou com empresas do Fortune 500. MBA em Estratégia Empresarial, especialização em Inovação. Mentora oficial de 3 aceleradoras de startup.",
      location: "Brasília, DF",
      portfolio: "https://patriciacampos.com",
      skills: ["Estratégia Empresarial", "Modelagem de Negócios", "Inovação", "Pitch", "Fundraising", "Operações"],
      categories: ["Negócios", "Estratégia", "Inovação"],
      account_type: "mentor",
      avatar: "/placeholder-user.jpg"
    },
    projects: [
      {
        titulo: "Metodologia StartUp Canvas",
        descricao: "Framework proprietário para validação e estruturação de modelos de negócio para startups early-stage.",
        categoria: "Negócios",
        tags: ["Metodologia", "Canvas", "Startup"],
        video_apresentacao: "https://example.com/video7",
        status: "ativo"
      }
    ]
  },
  {
    email: "demo8@gigatalentos.com", // Lucas Mendes
    updates: {
      name: "Lucas Mendes",
      bio: "Desenvolvedor Backend e DevOps Engineer com foco em arquiteturas escaláveis e infraestrutura cloud.",
      experience: "4 anos trabalhando com microserviços, Kubernetes e AWS. Especialista em otimização de performance e automação de deployment. Reduzi custos de infraestrutura em 40% na última empresa.",
      location: "Porto Alegre, RS",
      portfolio: "https://lucasmendes.dev",
      skills: ["Python", "Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Monitoring"],
      categories: ["Tecnologia", "DevOps", "Cloud"],
      account_type: "talent",
      avatar: "/placeholder-user.jpg"
    },
    projects: [
      {
        titulo: "Plataforma de Automação CI/CD",
        descricao: "Sistema completo de automação para deployment de aplicações com monitoramento em tempo real.",
        categoria: "DevOps",
        tags: ["CI/CD", "Automation", "Monitoring"],
        video_apresentacao: "https://example.com/video8",
        status: "ativo"
      }
    ]
  }
];

async function seedUserProfiles() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(MONGODB_URI!);
    console.log("🔗 Conectado ao MongoDB");

    for (const userData of userProfilesData) {
      // Encontrar o usuário pelo email
      const user = await User.findOne({ email: userData.email });
      
      if (user) {
        // Atualizar perfil do usuário
        await User.findByIdAndUpdate(user._id, userData.updates);
        console.log(`✅ Perfil atualizado para: ${userData.updates.name}`);

        // Criar projetos para o usuário
        for (const projectData of userData.projects) {
          const existingProject = await Projeto.findOne({ 
            nome: projectData.titulo,
            criador_id: user._id 
          });

          if (!existingProject) {
            const projeto = new Projeto({
              nome: projectData.titulo,
              descricao: projectData.descricao,
              objetivo: projectData.descricao,
              video_apresentacao: projectData.video_apresentacao,
              categoria: projectData.categoria,
              talento_lider_id: user._id,
              criador_id: user._id,
              portfolio_id: user._id, // Usando o ID do usuário como portfolio temporário
              status: projectData.status,
              demo: true,
              criado_em: new Date()
            });
            await projeto.save();
            console.log(`  📁 Projeto criado: ${projectData.titulo}`);
          } else {
            console.log(`  📁 Projeto já existe: ${projectData.titulo}`);
          }
        }
      } else {
        console.log(`❌ Usuário não encontrado: ${userData.email}`);
      }
    }

    console.log("\n🎉 Seed de perfis completo!");
    console.log("\n📊 Resumo dos perfis criados:");
    console.log("👥 5 usuários com perfis completos");
    console.log("🎯 2 mentores experientes");
    console.log("💡 3 talentos em diferentes áreas");
    console.log("📁 8 projetos demonstrativos");
    console.log("🛠️ Skills e categorias diversificadas");

  } catch (error) {
    console.error("❌ Erro no seed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado do MongoDB");
  }
}

export default seedUserProfiles;

// Executar se chamado diretamente
if (require.main === module) {
  seedUserProfiles();
}
