import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import Channel from '@/models/Channel';
import Category from '@/models/Category';
import Desafio from '@/models/Desafio';
import Projeto from '@/models/Projeto';
import Video from '@/models/Video';
import Playlist from '@/models/Playlist';
import Like from '@/models/Like';
import Favorite from '@/models/Favorite';
import ProjectFavorite from '@/models/ProjectFavorite';
import Subscription from '@/models/Subscription';
import Comment from '@/models/Comment';
import Message from '@/models/Message';
import ParticipationRequest from '@/models/ParticipationRequest';

export async function POST() {
  try {
    console.log('🗑️ Clearing existing data...');
    
    // Clear data sequentially to avoid timeout issues
    const collections = [
      { model: Comment, name: 'Comments' },
      { model: Message, name: 'Messages' },
      { model: Subscription, name: 'Subscriptions' },
      { model: Playlist, name: 'Playlists' },
      { model: Video, name: 'Videos' },
      { model: Projeto, name: 'Projetos' },
      { model: Desafio, name: 'Desafios' },
      { model: Channel, name: 'Channels' },
      { model: User, name: 'Users' },
      { model: Category, name: 'Categories' },
      { model: Like, name: 'Likes' },
      { model: Favorite, name: 'Favorites' },
      { model: ProjectFavorite, name: 'ProjectFavorites' },
      { model: ParticipationRequest, name: 'ParticipationRequests' }
    ];

    for (const { model, name } of collections) {
      try {
        console.log(`Deleting ${name}...`);
        await (model as any).deleteMany({});
        console.log(`✅ ${name} cleared`);
      } catch (error) {
        console.warn(`⚠️ Warning: Could not clear ${name}:`, error instanceof Error ? error.message : String(error));
        // Continue with other collections even if one fails
      }
    }

    console.log('📝 Creating categories...');
    
    // Create categories - The original 6 core skill areas from the business model
    const categories = await Category.insertMany([
      {
        name: "Habilidade Cognitiva & Técnica",
        code: "COGNITIVA_TECNICA",
        description: "Habilidades excepcionais de resolução de problemas, competência técnica em STEM, solução de problemas e habilidades técnicas",
        thumbnail: "/categories/category-1.jpg"
      },
      {
        name: "Criatividade & Inovação",
        code: "CRIATIVIDADE_INOVACAO", 
        description: "Pensamento criativo em soluções, capacidade de gerar ideias e soluções novas, buscar lacunas de formas originais",
        thumbnail: "/categories/category-2.jpg"
      },
      {
        name: "Motivação & Paixão",
        code: "MOTIVACAO_PAIXAO",
        description: "Paixão intensa por empreendedorismo, motivação intrínseca para criar e inovar, dedicação a objetivos",
        thumbnail: "/categories/category-3.jpg"
      },
      {
        name: "Liderança & Colaboração",
        code: "LIDERANCA_COLABORACAO",
        description: "Habilidades naturais de liderança, capacidade de trabalhar efetivamente em equipe, inspirar e motivar outros",
        thumbnail: "/categories/category-4.jpg"
      },
      {
        name: "Consciência Social & Integridade",
        code: "CONSCIENCIA_SOCIAL",
        description: "Consciência sobre questões sociais, integridade ética, compromisso com soluções que beneficiam a sociedade",
        thumbnail: "/categories/category-5.jpg"
      },
      {
        name: "Adaptabilidade & Resistência",
        code: "ADAPTABILIDADE_RESISTENCIA",
        description: "Capacidade de lidar com falhas, enfrentar desafios, se adaptar a mudanças e superar obstáculos",
        thumbnail: "/categories/category-6.jpg"
      }
    ]);

    console.log('👥 Creating users...');
    
    // Hash passwords for all users
    const hashedAdminPassword = await bcrypt.hash('carlosdenner', 12);
    const hashedDefaultPassword = await bcrypt.hash('password123', 12);
    
    // Create diverse users with different types
    const users = await User.insertMany([
      // Admin (Platform Administrator)
      {
        name: 'Carlos Denner',
        email: 'carlosdenner@gmail.com',
        password: hashedAdminPassword,
        avatar: '/carlos denner.jpg',
        account_type: 'admin',
        bio: 'Fundador e administrador da plataforma Giga Talentos. Especialista em identificação e desenvolvimento de talentos empreendedores.',
        location: 'Brasília, DF',
        portfolio: 'https://carlosdenner.com',
        experience: 'Expert',
        skills: ['Platform Management', 'Talent Identification', 'Entrepreneurship', 'Innovation'],
        verified: true
      },

      // Fans
      {
        name: 'Ana Silva',
        email: 'ana.silva@email.com',
        password: hashedDefaultPassword,
        avatar: '/placeholder-user.jpg',
        account_type: 'fan',
        bio: 'Apaixonada por tecnologia e sempre em busca de novos aprendizados.',
        location: 'São Paulo, SP',
        portfolio: 'https://ana-silva.dev',
        experience: 'Iniciante'
      },
      {
        name: 'Pedro Santos',
        email: 'pedro.santos@email.com',
        password: hashedDefaultPassword,
        avatar: '/placeholder-user.jpg',
        account_type: 'fan',
        bio: 'Estudante de design gráfico interessado em projetos criativos.',
        location: 'Rio de Janeiro, RJ',
        experience: 'Iniciante'
      },
      {
        name: 'Maria Oliveira',
        email: 'maria.oliveira@email.com',
        password: hashedDefaultPassword,
        avatar: '/placeholder-user.jpg',
        account_type: 'fan',
        bio: 'Entusiasta de marketing digital e tendências.',
        location: 'Belo Horizonte, MG',
        experience: 'Intermediário'
      },

      // Talents
      {
        name: 'João Desenvolvedor',
        email: 'joao.dev@email.com',
        password: hashedDefaultPassword,
        avatar: '/placeholder-user.jpg',
        account_type: 'talent',
        bio: 'Desenvolvedor Full Stack com 3 anos de experiência em React e Node.js.',
        location: 'São Paulo, SP',
        portfolio: 'https://joao-dev.com',
        experience: 'Intermediário',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB']
      },
      {
        name: 'Carla Designer',
        email: 'carla.design@email.com',
        password: hashedDefaultPassword,
        avatar: '/placeholder-user.jpg',
        account_type: 'talent',
        bio: 'Designer UX/UI especializada em experiências digitais inovadoras.',
        location: 'Rio de Janeiro, RJ',
        portfolio: 'https://carla-design.com',
        experience: 'Avançado',
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research']
      },
      {
        name: 'Lucas Frontend',
        email: 'lucas.frontend@email.com',
        password: hashedDefaultPassword,
        avatar: '/placeholder-user.jpg',
        account_type: 'talent',
        bio: 'Especialista em desenvolvimento frontend com foco em performance.',
        location: 'Florianópolis, SC',
        portfolio: 'https://lucas-frontend.dev',
        experience: 'Avançado',
        skills: ['Vue.js', 'React', 'CSS', 'JavaScript', 'Performance']
      },
      {
        name: 'Sofia Backend',
        email: 'sofia.backend@email.com',
        password: hashedDefaultPassword,
        avatar: '/placeholder-user.jpg',
        account_type: 'talent',
        bio: 'Desenvolvedora backend especializada em arquiteturas escaláveis.',
        location: 'Brasília, DF',
        portfolio: 'https://sofia-backend.dev',
        experience: 'Avançado',
        skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker']
      },
      {
        name: 'Rafael Mobile',
        email: 'rafael.mobile@email.com',
        password: hashedDefaultPassword,
        avatar: '/placeholder-user.jpg',
        account_type: 'talent',
        bio: 'Desenvolvedor mobile com experiência em React Native e Flutter.',
        location: 'Curitiba, PR',
        portfolio: 'https://rafael-mobile.dev',
        experience: 'Intermediário',
        skills: ['React Native', 'Flutter', 'iOS', 'Android']
      },

      // Mentors
      {
        name: 'Dr. Carlos Tech',
        email: 'carlos.tech@email.com',
        password: hashedDefaultPassword,
        avatar: '/placeholder-user.jpg',
        account_type: 'mentor',
        bio: 'CTO com 15 anos de experiência em tecnologia. Mentor de startups e projetos inovadores.',
        location: 'São Paulo, SP',
        portfolio: 'https://carlos-tech.com',
        experience: 'Expert',
        skills: ['Leadership', 'Architecture', 'Strategy', 'Mentoring'],
        categories: ['Tecnologia', 'Empreendedorismo'],
        verified: true
      },
      {
        name: 'Prof. Marina UX',
        email: 'marina.ux@email.com',
        password: hashedDefaultPassword,
        avatar: '/placeholder-user.jpg',
        account_type: 'mentor',
        bio: 'Design Leader e professora universitária. Especialista em Design Thinking e UX Strategy.',
        location: 'Rio de Janeiro, RJ',
        portfolio: 'https://marina-ux.com',
        experience: 'Expert',
        skills: ['Design Thinking', 'UX Strategy', 'Team Leadership'],
        categories: ['Design', 'Educação'],
        verified: true
      },
      {
        name: 'Eng. Roberto Sustentável',
        email: 'roberto.sustentavel@email.com',
        password: hashedDefaultPassword,
        avatar: '/placeholder-user.jpg',
        account_type: 'mentor',
        bio: 'Engenheiro ambiental e consultor em sustentabilidade. Mentor de projetos de impacto social.',
        location: 'Porto Alegre, RS',
        portfolio: 'https://roberto-sustentavel.com',
        experience: 'Expert',
        skills: ['Sustainability', 'Environmental Engineering', 'Impact Assessment'],
        categories: ['Sustentabilidade', 'Empreendedorismo'],
        verified: true
      },
      {
        name: 'Dra. Juliana Marketing',
        email: 'juliana.marketing@email.com',
        password: hashedDefaultPassword,
        avatar: '/placeholder-user.jpg',
        account_type: 'mentor',
        bio: 'VP de Marketing com vasta experiência em growth hacking e marketing digital.',
        location: 'São Paulo, SP',
        portfolio: 'https://juliana-marketing.com',
        experience: 'Expert',
        skills: ['Growth Hacking', 'Digital Marketing', 'Brand Strategy'],
        categories: ['Marketing', 'Empreendedorismo'],
        verified: true
      }
    ]);

    console.log('📺 Creating channels...');

    // Create channels for talents, mentors, and admin
    const talentUsers = users.filter(u => u.account_type === 'talent');
    const mentorUsers = users.filter(u => u.account_type === 'mentor');
    const adminUsers = users.filter(u => u.account_type === 'admin');
    const allCreators = [...talentUsers, ...mentorUsers, ...adminUsers];

    const channels = [];
    for (const user of allCreators) {
      const channel = {
        name: `Canal do ${user.name.split(' ')[0]}`,
        description: `Canal oficial de ${user.name} - ${user.bio}`,
        user_id: user._id, // Fixed: use user_id instead of owner_id
        category: categories[Math.floor(Math.random() * categories.length)].name, // Use category name string
        subscribers: Math.floor(Math.random() * 10000) + 100,
        avatar: user.avatar,
        cover_image: '/placeholder.jpg',
        verified: user.account_type === 'mentor' || Math.random() > 0.5,
        demo: true
      };
      channels.push(channel);
    }

    const createdChannels = await Channel.insertMany(channels);

    console.log('🎯 Creating desafios...');

    // Create desafios (mentors and admin can create)
    const desafios = [];
    const mentors = users.filter(u => u.account_type === 'mentor' || u.account_type === 'admin');
    
    const desafioTemplates = [
      {
        title: 'Hackathon: Algoritmos Inteligentes',
        description: 'Desenvolva algoritmos avançados para resolver problemas complexos de otimização em tempo real. Use técnicas de machine learning e análise de dados.',
        difficulty: 'Avançado',
        duration: '4 semanas',
        category: 'Habilidade Cognitiva & Técnica',
        prizes: [
          { position: '1º Lugar', description: 'Mentorias em AI/ML + R$ 12.000', value: 'R$ 12.000' },
          { position: '2º Lugar', description: 'Curso avançado + R$ 6.000', value: 'R$ 6.000' },
          { position: '3º Lugar', description: 'Kit técnico + R$ 3.000', value: 'R$ 3.000' }
        ],
        requirements: [
          'Solução técnica inovadora',
          'Algoritmos otimizados',
          'Documentação técnica completa',
          'Código disponível no GitHub'
        ]
      },
      {
        title: 'Innovation Lab: Soluções Disruptivas',
        description: 'Crie uma solução completamente inovadora para um problema que ainda não foi resolvido. Pense fora da caixa e use criatividade extrema.',
        difficulty: 'Avançado',
        duration: '5 semanas',
        category: 'Criatividade & Inovação',
        prizes: [
          { position: '1º Lugar', description: 'Incubação de ideia + R$ 15.000', value: 'R$ 15.000' },
          { position: '2º Lugar', description: 'Mentoria em inovação + R$ 8.000', value: 'R$ 8.000' }
        ],
        requirements: [
          'Solução totalmente original',
          'Prototipagem criativa',
          'Potencial de impacto disruptivo',
          'Apresentação inovadora'
        ]
      },
      {
        title: 'Startup Challenge: Do Sonho ao MVP',
        description: 'Transforme sua paixão em um negócio real. Desenvolva um MVP completo de uma startup que resolve um problema que você realmente se importa.',
        difficulty: 'Intermediário',
        duration: '6 semanas',
        category: 'Motivação & Paixão',
        prizes: [
          { position: '1º Lugar', description: 'Seed funding + R$ 20.000', value: 'R$ 20.000' },
          { position: '2º Lugar', description: 'Aceleração + R$ 10.000', value: 'R$ 10.000' }
        ],
        requirements: [
          'Demonstrar paixão autêntica',
          'MVP funcional',
          'Plano de crescimento',
          'Pitch apaixonante'
        ]
      },
      {
        title: 'Leadership Summit: Lidere uma Equipe',
        description: 'Monte e lidere uma equipe multidisciplinar para resolver um desafio complexo. Demonstre habilidades de liderança e colaboração efetiva.',
        difficulty: 'Avançado',
        duration: '4 semanas',
        category: 'Liderança & Colaboração',
        prizes: [
          { position: '1º Lugar', description: 'Programa de liderança + R$ 10.000', value: 'R$ 10.000' },
          { position: '2º Lugar', description: 'Workshop de gestão + R$ 5.000', value: 'R$ 5.000' }
        ],
        requirements: [
          'Formar equipe de pelo menos 4 pessoas',
          'Demonstrar liderança efetiva',
          'Resultado colaborativo excepcional',
          'Feedback positivo da equipe'
        ]
      },
      {
        title: 'Social Impact: Mudança Real',
        description: 'Desenvolva um projeto que gere impacto social positivo real e mensurável. Foque em ética, transparência e benefício para a sociedade.',
        difficulty: 'Intermediário',
        duration: '5 semanas',
        category: 'Consciência Social & Integridade',
        prizes: [
          { position: '1º Lugar', description: 'Fundo para implementação + R$ 18.000', value: 'R$ 18.000' },
          { position: '2º Lugar', description: 'Mentoria em impacto social + R$ 9.000', value: 'R$ 9.000' }
        ],
        requirements: [
          'Impacto social mensurável',
          'Transparência total',
          'Sustentabilidade do projeto',
          'Relatório de impacto'
        ]
      },
      {
        title: 'Resilience Challenge: Supere os Obstáculos',
        description: 'Enfrente uma série de desafios progressivamente mais difíceis. Demonstre capacidade de adaptação, aprendizado com falhas e superação.',
        difficulty: 'Avançado',
        duration: '3 semanas intensivas',
        category: 'Adaptabilidade & Resistência',
        prizes: [
          { position: '1º Lugar', description: 'Programa de desenvolvimento + R$ 8.000', value: 'R$ 8.000' },
          { position: '2º Lugar', description: 'Coaching pessoal + R$ 4.000', value: 'R$ 4.000' }
        ],
        requirements: [
          'Completar todos os módulos',
          'Documentar aprendizados com falhas',
          'Demonstrar evolução',
          'Reflexão sobre crescimento pessoal'
        ]
      },
      // Additional desafios for more variety
      {
        title: 'FinTech Revolution: Soluções Financeiras Inovadoras',
        description: 'Desenvolva uma solução FinTech que democratize o acesso a serviços financeiros, usando tecnologias emergentes como blockchain, AI ou IoT.',
        difficulty: 'Avançado',
        duration: '6 semanas',
        category: 'Habilidade Cognitiva & Técnica',
        prizes: [
          { position: '1º Lugar', description: 'Investimento seed + R$ 25.000', value: 'R$ 25.000' },
          { position: '2º Lugar', description: 'Aceleração em hub financeiro + R$ 15.000', value: 'R$ 15.000' },
          { position: '3º Lugar', description: 'Mentoria especializada + R$ 8.000', value: 'R$ 8.000' }
        ],
        requirements: [
          'Solução tecnológica robusta',
          'Compliance regulatório',
          'MVP funcional',
          'Plano de negócios detalhado'
        ]
      },
      {
        title: 'Green Innovation Lab: Sustentabilidade em Ação',
        description: 'Crie uma solução inovadora para enfrentar desafios ambientais urgentes. Foque em economia circular, energia renovável ou preservação ambiental.',
        difficulty: 'Intermediário',
        duration: '4 semanas',
        category: 'Consciência Social & Integridade',
        prizes: [
          { position: '1º Lugar', description: 'Grant para implementação + R$ 20.000', value: 'R$ 20.000' },
          { position: '2º Lugar', description: 'Parceria com ONGs + R$ 12.000', value: 'R$ 12.000' }
        ],
        requirements: [
          'Impacto ambiental positivo',
          'Viabilidade econômica',
          'Escalabilidade da solução',
          'Parcerias estratégicas'
        ]
      },
      {
        title: 'Digital Art & NFT: Criatividade no Metaverso',
        description: 'Explore as fronteiras da arte digital e crie experiências imersivas usando NFTs, realidade virtual ou aumentada.',
        difficulty: 'Intermediário',
        duration: '5 semanas',
        category: 'Criatividade & Inovação',
        prizes: [
          { position: '1º Lugar', description: 'Exposição digital + R$ 15.000', value: 'R$ 15.000' },
          { position: '2º Lugar', description: 'Residência artística + R$ 10.000', value: 'R$ 10.000' }
        ],
        requirements: [
          'Originalidade artística',
          'Inovação tecnológica',
          'Narrativa envolvente',
          'Experiência do usuário'
        ]
      },
      {
        title: 'Youth Entrepreneurship: Jovens Transformadores',
        description: 'Desenvolva um negócio de impacto social voltado para jovens. Demonstre como a paixão jovem pode transformar comunidades.',
        difficulty: 'Iniciante',
        duration: '4 semanas',
        category: 'Motivação & Paixão',
        prizes: [
          { position: '1º Lugar', description: 'Bolsa de estudos + R$ 18.000', value: 'R$ 18.000' },
          { position: '2º Lugar', description: 'Programa de mentoria + R$ 10.000', value: 'R$ 10.000' }
        ],
        requirements: [
          'Foco em jovens (16-25 anos)',
          'Impacto social claro',
          'Paixão demonstrada',
          'Plano de implementação'
        ]
      }
    ];

    for (let i = 0; i < desafioTemplates.length; i++) {
      const template = desafioTemplates[i];
      const mentor = mentors[i % mentors.length];
      const category = categories.find(c => c.name === template.category);
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) - 15); // -15 to +15 days
      
      const endDate = new Date(startDate);
      const durationDays = template.duration.includes('semana') ? 
        parseInt(template.duration) * 7 : 
        template.duration.includes('mês') ? 
          parseInt(template.duration) * 30 : 
          parseInt(template.duration);
      endDate.setDate(endDate.getDate() + durationDays);

      desafios.push({
        title: template.title,
        description: template.description,
        category: category._id,
        difficulty: template.difficulty,
        duration: template.duration,
        participants: Math.floor(Math.random() * 100) + 10,
        prizes: template.prizes,
        requirements: template.requirements,
        status: endDate > new Date() ? 'Ativo' : Math.random() > 0.5 ? 'Finalizado' : 'Em Breve',
        start_date: startDate,
        end_date: endDate,
        featured: Math.random() > 0.6,
        created_by: mentor._id,
        favoritos: [], // Will be populated later
        projetos_vinculados: [] // Will be populated later
      });
    }

    // Add specific desafios for admin user (Carlos Denner) before creating all desafios
    const adminUser = users.find(u => u.account_type === 'admin');
    if (adminUser) {
      const adminDesafios = [
        {
          title: 'Concurso Nacional de Inovação Tecnológica',
          description: 'Desenvolva uma solução tecnológica inovadora que resolva um problema real da sociedade brasileira. Este é o desafio oficial da plataforma Giga Talentos.',
          objective: 'Revolucionar o ecossistema de inovação brasileiro',
          difficulty: 'Avançado',
          duration: '8 semanas',
          category: categories.find(c => c.name === 'Habilidade Cognitiva & Técnica')?._id || categories[0]._id,
          created_by: adminUser._id,
          start_date: new Date(),
          end_date: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000), // 8 weeks from now
          status: 'Ativo',
          featured: true,
          participants: 0,
          prizes: [
            { position: '1º Lugar', description: 'Incubação + R$ 50.000', value: 'R$ 50.000' },
            { position: '2º Lugar', description: 'Mentoria + R$ 25.000', value: 'R$ 25.000' },
            { position: '3º Lugar', description: 'Curso + R$ 10.000', value: 'R$ 10.000' }
          ],
          requirements: [
            'Solução tecnológica funcional',
            'Plano de negócio detalhado',
            'Pitch de apresentação',
            'Código fonte disponível'
          ],
          favoritos: [],
          sponsors: [],
          submissions: [],
          projetos_vinculados: []
        },
        {
          title: 'Hackathon Empreendedorismo Social',
          description: 'Crie uma startup com impacto social positivo. Desenvolva um modelo de negócio sustentável que resolve problemas sociais.',
          objective: 'Promover empreendedorismo social no Brasil',
          difficulty: 'Intermediário',
          duration: '6 semanas',
          category: categories.find(c => c.name === 'Consciência Social & Integridade')?._id || categories[0]._id,
          created_by: adminUser._id,
          start_date: new Date(),
          end_date: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 6 weeks from now
          status: 'Ativo',
          featured: true,
          participants: 0,
          prizes: [
            { position: '1º Lugar', description: 'Investimento + R$ 30.000', value: 'R$ 30.000' },
            { position: '2º Lugar', description: 'Aceleração + R$ 15.000', value: 'R$ 15.000' }
          ],
          requirements: [
            'Impacto social mensurável',
            'Modelo de negócio sustentável',
            'Prototipo funcional',
            'Apresentação executiva'
          ],
          favoritos: [],
          sponsors: [],
          submissions: [],
          projetos_vinculados: []
        }
      ];
      
      desafios.push(...adminDesafios);
    }

    const createdDesafios = await Desafio.insertMany(desafios);

    console.log('🚀 Creating projetos...');

    // Create projetos (talents, mentors, and admin can create)
    const projetos = [];
    const creatorsForProjects = [...talentUsers, ...mentorUsers, ...adminUsers];
    
    const projetoTemplates = [
      {
        title: 'AI Problem Solver - Sistema Inteligente',
        description: 'Sistema de IA que resolve problemas complexos de otimização usando algoritmos avançados de machine learning.',
        category: 'Habilidade Cognitiva & Técnica',
        technologies: ['Python', 'TensorFlow', 'React', 'FastAPI'],
        demo_url: 'https://ai-solver-demo.vercel.app',
        repository_url: 'https://github.com/exemplo/ai-solver'
      },
      {
        title: 'Creative Studio Platform',
        description: 'Plataforma colaborativa para artistas e designers criarem projetos inovadores usando ferramentas digitais avançadas.',
        category: 'Criatividade & Inovação',
        technologies: ['Figma API', 'React', 'WebRTC', 'Canvas'],
        demo_url: 'https://creative-studio.netlify.app',
        repository_url: 'https://github.com/exemplo/creative-studio'
      },
      {
        title: 'StartupHub - Ecossistema Empreendedor',
        description: 'Plataforma que conecta empreendedores apaixonados com recursos, mentores e oportunidades de investimento.',
        category: 'Motivação & Paixão',
        technologies: ['Next.js', 'Supabase', 'Stripe', 'Socket.io'],
        demo_url: 'https://startup-hub.vercel.app',
        repository_url: 'https://github.com/exemplo/startup-hub'
      },
      {
        title: 'TeamSync - Gestão Colaborativa',
        description: 'Ferramenta de gestão de equipes que promove liderança distribuída e colaboração efetiva em projetos.',
        category: 'Liderança & Colaboração',
        technologies: ['Vue.js', 'Node.js', 'MongoDB', 'WebSocket'],
        demo_url: 'https://teamsync-app.com',
        repository_url: 'https://github.com/exemplo/teamsync'
      },
      {
        title: 'ImpactTracker - Medição Social',
        description: 'Plataforma para organizações medirem e reportarem seu impacto social e ambiental de forma transparente.',
        category: 'Consciência Social & Integridade',
        technologies: ['React', 'D3.js', 'PostgreSQL', 'GraphQL'],
        demo_url: 'https://impact-tracker.org',
        repository_url: 'https://github.com/exemplo/impact-tracker'
      },
      {
        title: 'AdaptLearn - Aprendizado Resiliente',
        description: 'Sistema educacional que se adapta aos desafios e falhas dos usuários, promovendo crescimento através da superação.',
        category: 'Adaptabilidade & Resistência',
        technologies: ['React Native', 'Python', 'TensorFlow', 'Firebase'],
        demo_url: 'https://adaptlearn.app',
        repository_url: 'https://github.com/exemplo/adaptlearn'
      },
      {
        title: 'TechInnovate - Hub de Inovação',
        description: 'Plataforma para desenvolvedores colaborarem em soluções técnicas inovadoras para problemas complexos.',
        category: 'Habilidade Cognitiva & Técnica',
        technologies: ['Docker', 'Kubernetes', 'React', 'PostgreSQL'],
        demo_url: 'https://tech-innovate.com',
        repository_url: 'https://github.com/exemplo/tech-innovate'
      },
      {
        title: 'CreativeCollab - Rede Criativa',
        description: 'Rede social para criativos compartilharem ideias disruptivas e colaborarem em projetos inovadores.',
        category: 'Criatividade & Inovação',
        technologies: ['React', 'Express', 'MongoDB', 'Cloudinary'],
        demo_url: 'https://creative-collab.net',
        repository_url: 'https://github.com/exemplo/creative-collab'
      }
    ];

    for (let i = 0; i < projetoTemplates.length; i++) {
      const template = projetoTemplates[i];
      const creator = creatorsForProjects[i % creatorsForProjects.length];
      const category = categories.find(c => c.name === template.category);
      
      // Assign leader (can be creator or another talent/mentor)
      const leader = Math.random() > 0.3 ? creator : 
        creatorsForProjects[Math.floor(Math.random() * creatorsForProjects.length)];

      // Find or assign a channel (portfolio) for the project
      const creatorChannel = createdChannels.find(ch => ch.user_id.toString() === creator._id.toString()) ||
                           createdChannels[Math.floor(Math.random() * createdChannels.length)];

      projetos.push({
        nome: template.title, // Fixed: use 'nome' instead of 'title'
        descricao: template.description, // Fixed: use 'descricao' instead of 'description'
        objetivo: `Desenvolver ${template.description}`,
        categoria: template.category, // Use category name as string
        video_apresentacao: template.demo_url,
        status: ['ativo', 'concluido', 'pausado'][Math.floor(Math.random() * 3)], // Fixed: use valid enum values
        avatar: '/placeholder-logo.png',
        imagem_capa: '/placeholder.jpg',
        criador_id: creator._id,
        talento_lider_id: leader._id,
        portfolio_id: creatorChannel._id, // Required: assign to a channel
        desafio_vinculacao_status: 'pendente',
        likes: [], // Will be populated later
        favoritos: [], // Will be populated later
        sponsors: [], // Will be populated later
        solicitacoes_participacao: [], // Will be populated later
        participantes_solicitados: [], // Will be populated later
        participantes_aprovados: [], // Will be populated later
        verificado: Math.random() > 0.6,
        demo: true
      });
    }

    // Add specific projetos for admin user (Carlos Denner) before creating all projetos
    if (adminUser) {
      // Find admin's channel to use as portfolio_id
      const adminChannel = createdChannels.find(ch => ch.user_id.toString() === adminUser._id.toString());
      
      const adminProjetos = [
        {
          nome: 'Plataforma Giga Talentos - Sistema Completo',
          descricao: 'Desenvolvimento da plataforma completa Giga Talentos usando Next.js, MongoDB e tecnologias modernas. Sistema de gestão de talentos, desafios e projetos.',
          objetivo: 'Criar a melhor plataforma para desenvolvimento de talentos empreendedores',
          categoria: categories.find(c => c.name === 'Habilidade Cognitiva & Técnica')?._id || categories[0]._id,
          video_apresentacao: 'https://youtube.com/watch?v=giga-talentos-demo',
          status: 'ativo',
          avatar: '/giga-talentos-logo.svg',
          imagem_capa: '/placeholder.jpg',
          criador_id: adminUser._id,
          talento_lider_id: adminUser._id,
          portfolio_id: adminChannel?._id || createdChannels[0]._id,
          tecnologias: ['Next.js', 'TypeScript', 'MongoDB', 'NextAuth', 'Tailwind CSS'],
          repositorio_url: 'https://github.com/carlosdenner/GigaTalentos',
          demo_url: 'https://giga-talentos.datasciencetech.ca',
          visibilidade: 'Público',
          colaboradores_max: 5,
          duracao_estimada: '12 meses',
          nivel_dificuldade: 'Avançado',
          custo_estimado: 'R$ 100.000',
          desafio_vinculacao_status: 'aprovado',
          likes: [],
          favoritos: [],
          sponsors: [],
          solicitacoes_participacao: [],
          participantes_solicitados: [],
          participantes_aprovados: [],
          verificado: true,
          demo: false
        },
        {
          nome: 'IA para Identificação de Talentos',
          descricao: 'Sistema de inteligência artificial para identificação automática de talentos baseado em análise comportamental e performance em desafios.',
          objetivo: 'Automatizar descoberta de talentos usando machine learning',
          categoria: categories.find(c => c.name === 'Habilidade Cognitiva & Técnica')?._id || categories[0]._id,
          video_apresentacao: 'https://youtube.com/watch?v=ai-talent-demo',
          status: 'ativo',
          avatar: '/placeholder-logo.svg',
          imagem_capa: '/placeholder.jpg',
          criador_id: adminUser._id,
          talento_lider_id: adminUser._id,
          portfolio_id: adminChannel?._id || createdChannels[0]._id,
          tecnologias: ['Python', 'TensorFlow', 'Machine Learning', 'API REST'],
          repositorio_url: 'https://github.com/carlosdenner/AI-Talent-Identifier',
          demo_url: 'https://ai-talent-demo.datasciencetech.ca',
          visibilidade: 'Público',
          colaboradores_max: 3,
          duracao_estimada: '6 meses',
          nivel_dificuldade: 'Avançado',
          custo_estimado: 'R$ 50.000',
          desafio_vinculacao_status: 'aprovado',
          likes: [],
          favoritos: [],
          sponsors: [],
          solicitacoes_participacao: [],
          participantes_solicitados: [],
          participantes_aprovados: [],
          verificado: true,
          demo: false
        },
        {
          nome: 'Mentoria Digital Automatizada',
          descricao: 'Plataforma de mentoria digital que conecta mentores e talentos usando algoritmos de matching inteligente.',
          objetivo: 'Revolucionar o processo de mentoria usando tecnologia',
          categoria: categories.find(c => c.name === 'Consciência Social & Integridade')?._id || categories[0]._id,
          video_apresentacao: 'https://youtube.com/watch?v=mentoria-digital',
          status: 'ativo',
          avatar: '/placeholder-logo.svg',
          imagem_capa: '/placeholder.jpg',
          criador_id: adminUser._id,
          talento_lider_id: adminUser._id,
          portfolio_id: adminChannel?._id || createdChannels[0]._id,
          tecnologias: ['React', 'Node.js', 'WebRTC', 'Socket.io'],
          repositorio_url: 'https://github.com/carlosdenner/Digital-Mentorship',
          demo_url: 'https://mentoria-digital.datasciencetech.ca',
          visibilidade: 'Público',
          colaboradores_max: 4,
          duracao_estimada: '8 meses',
          nivel_dificuldade: 'Intermediário',
          custo_estimado: 'R$ 75.000',
          desafio_vinculacao_status: 'pendente',
          likes: [],
          favoritos: [],
          sponsors: [],
          solicitacoes_participacao: [],
          participantes_solicitados: [],
          participantes_aprovados: [],
          verificado: true,
          demo: false
        }
      ];
      
      projetos.push(...adminProjetos);
    }

    const createdProjetos = await Projeto.insertMany(projetos);

    console.log('❤️ Creating interactions (likes, favorites, etc.)...');

    // Create interactions between users and content
    const allUsers = users;

    // Add favorites to desafios
    for (const desafio of createdDesafios) {
      const numFavorites = Math.floor(Math.random() * 8) + 2; // 2-10 favorites
      const favoriters = allUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, numFavorites);
      
      desafio.favoritos = favoriters.map(u => u._id);
      await desafio.save();
    }

    // Add likes and favorites to projetos
    for (const projeto of createdProjetos) {
      // Likes
      const numLikes = Math.floor(Math.random() * 15) + 3; // 3-18 likes
      const likers = allUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, numLikes);
      
      (projeto as any).likes = likers.map(u => u._id);

      // Favorites
      const numFavorites = Math.floor(Math.random() * 6) + 1; // 1-7 favorites
      const favoriters = allUsers
        .filter(u => !likers.includes(u)) // Different from likers
        .sort(() => 0.5 - Math.random())
        .slice(0, numFavorites);
      
      (projeto as any).favoritos = favoriters.map(u => u._id);
      await projeto.save();

      // Participation requests (only for talents and mentors)
      const eligibleParticipants = allUsers.filter(u => 
        u && u._id && u.account_type !== 'fan' && 
        projeto.criador_id && !u._id.equals(projeto.criador_id) && 
        projeto.talento_lider_id && !u._id.equals(projeto.talento_lider_id)
      );

      const numRequests = Math.floor(Math.random() * 4) + 1; // 1-5 requests
      const requesters = eligibleParticipants
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(numRequests, eligibleParticipants.length));

      for (let j = 0; j < requesters.length; j++) {
        const requester = requesters[j];
        const isApproved = Math.random() > 0.4; // 60% approval rate
        const status = isApproved ? 'aprovado' : Math.random() > 0.7 ? 'rejeitado' : 'pendente';

        const request = {
          usuario_id: requester._id, // Fixed: use 'usuario_id' to match schema
          status,
          mensagem: `Olá! Gostaria de participar deste projeto. Tenho experiência em ${requester.skills?.slice(0, 2).join(' e ') || 'desenvolvimento'}.`,
          solicitado_em: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
          respondido_em: status !== 'pendente' ? new Date() : undefined,
          resposta_mensagem: status === 'aprovado' ? 'Bem-vindo ao projeto!' : 
                            status === 'rejeitado' ? 'Obrigado pelo interesse, mas já temos a equipe completa.' : undefined
        };

        (projeto as any).solicitacoes_participacao.push(request);
        
        if (status === 'aprovado') {
          (projeto as any).participantes_aprovados.push(requester._id);
        } else if (status === 'pendente') {
          (projeto as any).participantes_solicitados.push(requester._id);
        }
      }

      await projeto.save();
    }

    // Create project-desafio linking requests
    let totalProjetoDesafioLinks = 0;
    for (let i = 0; i < Math.min(createdProjetos.length, createdDesafios.length); i++) {
      if (Math.random() > 0.4) { // 60% chance of linking
        const projeto = createdProjetos[i];
        const desafio = createdDesafios[i % createdDesafios.length];
        const status = ['pendente', 'aprovado', 'rejeitado'][Math.floor(Math.random() * 3)];

        const linkRequest = {
          projeto_id: projeto._id,
          status,
          solicitado_em: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000), // Last 10 days
          aprovado_em: status === 'aprovado' ? new Date() : undefined
        };

        desafio.projetos_vinculados.push(linkRequest);
        await desafio.save();
        totalProjetoDesafioLinks++;
      }
    }

    // All interactions are now stored directly in the models (likes in projetos, favorites in desafios/projetos, participation requests in projetos)
    
    console.log('❤️ Creating comprehensive interactions (favorites, likes, participation requests)...');

    // Add favorites to desafios (ENHANCED - much more comprehensive)
    let totalDesafioFavorites = 0;
    for (const desafio of createdDesafios) {
      const numFavorites = Math.floor(Math.random() * 15) + 8; // 8-22 favorites per desafio (much higher for demo)
      const userPool = allUsers.filter(u => u && u._id && !u._id.equals(desafio.created_by));
      const favoriters = userPool
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(numFavorites, userPool.length));
      
      desafio.favoritos = favoriters.map(u => u._id);
      await desafio.save();
      totalDesafioFavorites += favoriters.length;
    }

    // Add likes and favorites to projetos, plus participation requests (ENHANCED - much more comprehensive)
    let totalProjetoLikes = 0;
    let totalProjetoFavorites = 0;
    let totalParticipationRequests = 0;

    for (const projeto of createdProjetos) {
      // Add likes (more common than favorites) - ENHANCED NUMBERS
      const numLikes = Math.floor(Math.random() * 25) + 10; // 10-34 likes per projeto (much higher for demo)
      const likerPool = allUsers.filter(u => u && u._id && !u._id.equals(projeto.criador_id));
      const likers = likerPool
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(numLikes, likerPool.length));
      
      (projeto as any).likes = likers.map(u => u._id);
      totalProjetoLikes += likers.length;

      // Add favorites (subset of likers typically) - ENHANCED NUMBERS
      const numFavorites = Math.floor(Math.random() * 12) + 5; // 5-16 favorites per projeto (much higher for demo)
      const favoriters = likers
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(numFavorites, likers.length));
      
      (projeto as any).favoritos = favoriters.map(u => u._id);
      totalProjetoFavorites += favoriters.length;

      // Add participation requests (only talents can request to participate) - ENHANCED
      const talentUsers = allUsers.filter(u => u && u._id && u.account_type === 'talent' && !u._id.equals(projeto.criador_id));
      const numRequests = Math.floor(Math.random() * 6) + 2; // 2-7 participation requests per projeto (increased)
      const requesters = talentUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(numRequests, talentUsers.length));

      (projeto as any).solicitacoes_participacao = requesters.map(talent => ({
        usuario_id: talent._id,
        status: Math.random() > 0.7 ? 'aprovado' : Math.random() > 0.4 ? 'pendente' : 'rejeitado', // 30% approved, 40% pending, 30% rejected
        solicitado_em: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000), // Last 45 days
        respondido_em: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000) : undefined, // 70% have responses
        mensagem: `Olá! Gostaria muito de participar do projeto "${projeto.nome}". Tenho experiência em ${projeto.categoria} e posso contribuir significativamente com minha expertise.`,
        resposta_mensagem: Math.random() > 0.3 ? 
          (Math.random() > 0.5 ? 'Perfeito! Sua experiência será muito valiosa. Bem-vindo ao projeto!' : 
           'Obrigado pelo interesse, mas no momento o projeto já tem a equipe completa.') : undefined
      }));
      totalParticipationRequests += requesters.length;

      await projeto.save();
    }

    console.log('� Creating user-to-user following relationships...');

    // Create realistic following relationships
    let totalFollowingRelationships = 0;
    
    // Mentors are likely to be followed by talents and fans
    const mentorsForFollowing = allUsers.filter(u => u.account_type === 'mentor');
    const talentsForFollowing = allUsers.filter(u => u.account_type === 'talent');
    const fansForFollowing = allUsers.filter(u => u.account_type === 'fan');
    
    // Fans follow mentors and talents
    for (const fan of fansForFollowing) {
      const numMentorsToFollow = Math.floor(Math.random() * 3) + 1; // 1-3 mentors
      const numTalentsToFollow = Math.floor(Math.random() * 4) + 2; // 2-5 talents
      
      const mentorsToFollow = mentorsForFollowing
        .sort(() => 0.5 - Math.random())
        .slice(0, numMentorsToFollow);
      
      const talentsToFollow = talentsForFollowing
        .sort(() => 0.5 - Math.random())
        .slice(0, numTalentsToFollow);
      
      const allToFollow = [...mentorsToFollow, ...talentsToFollow];
      
      for (const userToFollow of allToFollow) {
        fan.following = fan.following || [];
        userToFollow.followers = userToFollow.followers || [];
        
        if (!fan.following.includes(userToFollow._id)) {
          fan.following.push(userToFollow._id);
          userToFollow.followers.push(fan._id);
          totalFollowingRelationships++;
        }
      }
      
      await fan.save();
      for (const user of allToFollow) {
        await user.save();
      }
    }
    
    // Talents follow mentors and some other talents
    for (const talent of talentsForFollowing) {
      const numMentorsToFollow = Math.floor(Math.random() * 2) + 1; // 1-2 mentors
      const numTalentsToFollow = Math.floor(Math.random() * 3) + 1; // 1-3 other talents
      
      const mentorsToFollow = mentorsForFollowing
        .sort(() => 0.5 - Math.random())
        .slice(0, numMentorsToFollow);
      
      const otherTalents = talentsForFollowing
        .filter(t => t._id.toString() !== talent._id.toString())
        .sort(() => 0.5 - Math.random())
        .slice(0, numTalentsToFollow);
      
      const allToFollow = [...mentorsToFollow, ...otherTalents];
      
      for (const userToFollow of allToFollow) {
        talent.following = talent.following || [];
        userToFollow.followers = userToFollow.followers || [];
        
        if (!talent.following.includes(userToFollow._id)) {
          talent.following.push(userToFollow._id);
          userToFollow.followers.push(talent._id);
          totalFollowingRelationships++;
        }
      }
      
      await talent.save();
      for (const user of allToFollow) {
        await user.save();
      }
    }
    
    // Some mentors follow other mentors (mutual professional respect)
    for (const mentor of mentorsForFollowing) {
      const numMentorsToFollow = Math.floor(Math.random() * 2); // 0-1 other mentors
      
      if (numMentorsToFollow > 0) {
        const otherMentors = mentorsForFollowing
          .filter(m => m._id.toString() !== mentor._id.toString())
          .sort(() => 0.5 - Math.random())
          .slice(0, numMentorsToFollow);
        
        for (const mentorToFollow of otherMentors) {
          mentor.following = mentor.following || [];
          mentorToFollow.followers = mentorToFollow.followers || [];
          
          if (!mentor.following.includes(mentorToFollow._id)) {
            mentor.following.push(mentorToFollow._id);
            mentorToFollow.followers.push(mentor._id);
            totalFollowingRelationships++;
          }
        }
        
        await mentor.save();
        for (const user of otherMentors) {
          await user.save();
        }
      }
    }

    console.log('�📹 Creating real YouTube videos...');

    // Real YouTube videos for the 6 skill categories with their carefully selected content
    const realYouTubeVideos = [
      {
        youtube_id: "8aGhZQkoFbQ",
        title: "Como Desenvolver Pensamento Analítico Para Empreendedores",
        description: "Aprenda as técnicas essenciais para desenvolver pensamento crítico e analítico no empreendedorismo, incluindo frameworks de resolução de problemas e tomada de decisão baseada em dados.",
        channel_name: "Sebrae",
        category_name: "Habilidade Cognitiva & Técnica",
        featured: true,
        tags: ["pensamento crítico", "análise", "tomada de decisão", "framework"],
        duration: "15:32"
      },
      {
        youtube_id: "QRZ_l7cVzzU",
        title: "Metodologia Lean Startup: Validação de Ideias de Negócio",
        description: "Entenda como usar a metodologia Lean Startup para validar suas ideias de negócio de forma científica e eficiente, reduzindo riscos e aumentando chances de sucesso.",
        channel_name: "StartSe",
        category_name: "Habilidade Cognitiva & Técnica",
        featured: false,
        tags: ["lean startup", "validação", "mvp", "metodologia"],
        duration: "18:45"
      },
      {
        youtube_id: "NugRZGDbPFU",
        title: "Design Thinking Para Inovação Em Negócios",
        description: "Aprenda como aplicar Design Thinking para inovar em produtos e serviços, desenvolvendo soluções centradas no usuário e criando valor diferenciado no mercado.",
        channel_name: "IDEO",
        category_name: "Criatividade & Inovação",
        featured: true,
        tags: ["design thinking", "inovação", "criatividade", "ux"],
        duration: "16:28"
      },
      {
        youtube_id: "4q-aGaP0qE8",
        title: "Liderança Inspiradora: Como Motivar Sua Equipe",
        description: "Desenvolva habilidades de liderança inspiradora para motivar equipes, criar culturas de alto desempenho e alcançar resultados extraordinários em ambientes empresariais.",
        channel_name: "Felipe Miranda",
        category_name: "Liderança & Colaboração",
        featured: true,
        tags: ["liderança", "motivação", "equipe", "cultura"],
        duration: "19:12"
      },
      {
        youtube_id: "8S0FDjFBj8o",
        title: "Resiliência Empreendedora: Como Superar Fracassos",
        description: "Desenvolva resiliência mental para superar fracassos empresariais, aprender com erros e manter motivação em momentos desafiadores da jornada empreendedora.",
        channel_name: "Flávio Augusto",
        category_name: "Adaptabilidade & Resistência",
        featured: true,
        tags: ["resiliência", "fracasso", "mindset", "superação"],
        duration: "13:27"
      },
      {
        youtube_id: "WkMM3LJZaqs",
        title: "Comunicação Persuasiva Para Empreendedores",
        description: "Desenvolva habilidades de comunicação persuasiva para pitch de negócios, vendas e liderança, aprendendo técnicas de storytelling e influência ética.",
        channel_name: "TED Talks",
        category_name: "Motivação & Paixão",
        featured: true,
        tags: ["comunicação", "persuasão", "pitch", "storytelling"],
        duration: "17:23"
      },
      {
        youtube_id: "vBYnQQj3Q_o", 
        title: "Ética Empresarial e Responsabilidade Social",
        description: "Explore os princípios de ética empresarial e responsabilidade social corporativa, entendendo como construir negócios sustentáveis e socialmente responsáveis.",
        channel_name: "Harvard Business Review",
        category_name: "Consciência Social & Integridade",
        featured: false,
        tags: ["ética", "responsabilidade social", "sustentabilidade", "ESG"],
        duration: "14:56"
      }
    ];

    // Function to generate realistic metrics based on video ID
    function generateRealisticMetrics(videoId: string) {
      const hash = videoId.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
      const views = Math.floor((hash % 50000) + 15000); // 15K - 65K views
      const likes = Math.floor(views * (0.02 + (hash % 100) / 10000)); // 2-12% like rate
      const comments = Math.floor(likes * (0.05 + (hash % 50) / 10000)); // 5-10% comment rate
      
      return {
        views,
        likes,
        comments,
        publishedAt: new Date(Date.now() - (hash % 180) * 24 * 60 * 60 * 1000), // Random date in last 6 months
      };
    }

    // Create videos for each real YouTube video
    const videos = [];
    for (const videoData of realYouTubeVideos) {
      // Find the category
      const category = categories.find(c => c.name === videoData.category_name);
      if (!category) {
        console.log(`Category "${videoData.category_name}" not found, skipping video: ${videoData.title}`);
        continue;
      }

      // Find or create channel for this YouTube channel
      let videoChannel = createdChannels.find(ch => ch.name.includes(videoData.channel_name.split(' ')[0])) ||
                        createdChannels[Math.floor(Math.random() * createdChannels.length)];

      const metrics = generateRealisticMetrics(videoData.youtube_id);

      videos.push({
        title: videoData.title,
        description: videoData.description,
        youtube_id: videoData.youtube_id,
        channel_id: videoChannel._id,
        category: category.name,
        duration: videoData.duration,
        view_count: metrics.views,
        like_count: metrics.likes,
        comment_count: metrics.comments,
        featured: videoData.featured,
        tags: videoData.tags,
        video_url: `https://www.youtube.com/watch?v=${videoData.youtube_id}`,
        thumbnail: `https://img.youtube.com/vi/${videoData.youtube_id}/maxresdefault.jpg`,
        youtube_views: metrics.views,
        youtube_likes: metrics.likes,
        youtube_comments: metrics.comments,
        youtube_published_at: metrics.publishedAt,
        youtube_channel_title: videoData.channel_name,
        youtube_last_updated: new Date(),
        demo: false,
        created_at: metrics.publishedAt
      });
    }

    const createdVideos = await Video.insertMany(videos);

    // Add specific videos for admin user (Carlos Denner) - these will be in his channel
    if (adminUser) {
      const adminChannel = createdChannels.find(ch => ch.user_id.equals(adminUser._id));
      if (adminChannel) {
        const adminVideos = [
          {
            title: 'Visão da Plataforma Giga Talentos - Futuro do Empreendedorismo',
            description: 'Carlos Denner apresenta a visão completa da plataforma Giga Talentos e como ela está revolucionando a identificação e desenvolvimento de talentos empreendedores no Brasil.',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            youtube_id: 'dQw4w9WgXcQ', // Using a placeholder ID
            channel_id: adminChannel._id,
            category: 'Motivação & Paixão',
            views: 15420,
            likes: [], // Array of ObjectIds - will be populated later
            youtube_likes: 1248,
            youtube_views: 15420,
            youtube_comments: 186,
            duration: '18:45',
            featured: true,
            tags: ['empreendedorismo', 'inovação', 'talentos', 'visão'],
            thumbnail: '/placeholder.jpg',
            youtube_published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            demo: false
          },
          {
            title: 'Como Identificar e Desenvolver Talentos Empreendedores',
            description: 'Metodologia exclusiva para identificação de talentos empreendedores desenvolvida por Carlos Denner. Aprenda as técnicas e frameworks utilizados na plataforma.',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcR',
            youtube_id: 'dQw4w9WgXcR', // Using a placeholder ID
            channel_id: adminChannel._id,
            category: 'Habilidade Cognitiva & Técnica',
            views: 8750,
            likes: [], // Array of ObjectIds - will be populated later
            youtube_likes: 892,
            youtube_views: 8750,
            youtube_comments: 134,
            duration: '24:12',
            featured: true,
            tags: ['metodologia', 'talentos', 'desenvolvimento', 'frameworks'],
            thumbnail: '/placeholder.jpg',
            youtube_published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
            demo: false
          },
          {
            title: 'Tecnologias por Trás da Giga Talentos',
            description: 'Deep dive técnico nas tecnologias utilizadas para construir a plataforma Giga Talentos: Next.js, MongoDB, IA e mais.',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcS',
            youtube_id: 'dQw4w9WgXcS', // Using a placeholder ID
            channel_id: adminChannel._id,
            category: 'Habilidade Cognitiva & Técnica',
            views: 5690,
            likes: [], // Array of ObjectIds - will be populated later
            youtube_likes: 567,
            youtube_views: 5690,
            youtube_comments: 89,
            duration: '31:28',
            featured: false,
            tags: ['tecnologia', 'nextjs', 'mongodb', 'desenvolvimento'],
            thumbnail: '/placeholder.jpg',
            youtube_published_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
            demo: false
          },
          {
            title: 'Construindo Ecossistemas de Inovação',
            description: 'Como criar e gerenciar ecossistemas de inovação que conectam talentos, mentores, investidores e empresas de forma sustentável.',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcT',
            youtube_id: 'dQw4w9WgXcT', // Using a placeholder ID
            channel_id: adminChannel._id,
            category: 'Consciência Social & Integridade',
            views: 12350,
            likes: [], // Array of ObjectIds - will be populated later
            youtube_likes: 1156,
            youtube_views: 12350,
            youtube_comments: 198,
            duration: '28:33',
            featured: true,
            tags: ['ecossistema', 'inovação', 'sustentabilidade', 'networking'],
            thumbnail: '/placeholder.jpg',
            youtube_published_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 4 weeks ago
            demo: false
          }
        ];

        const adminVideosDocs = await Video.insertMany(adminVideos);
        createdVideos.push(...adminVideosDocs);
      }
    }

    // Create playlists (ENHANCED - much more comprehensive)
    console.log('📋 Creating comprehensive playlists...');
    const playlists = [];
    
    // Create playlists for channel owners
    for (const channel of createdChannels) {
      const channelVideos = createdVideos.filter(v => v && v.channel_id && channel && channel._id && v.channel_id.equals(channel._id));
      if (channelVideos.length >= 2) { // Reduced requirement for more playlists
        const numPlaylists = Math.floor(Math.random() * 4) + 2; // 2-5 playlists per channel (increased)
        
        for (let i = 0; i < numPlaylists; i++) {
          const playlistNames = [
            'Série Desenvolvimento Pessoal',
            'Curso Completo de Empreendedorismo',
            'Dicas Essenciais Para Iniciantes',
            'Projetos Práticos e Cases',
            'Fundamentos de Negócios',
            'Inspiração e Motivação',
            'Análises de Mercado',
            'Ferramentas e Técnicas',
            'Histórias de Sucesso',
            'Networking e Relacionamentos',
            'Inovação e Tendências',
            'Gestão e Liderança'
          ];

          const videosInPlaylist = channelVideos
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 6) + 2); // 2-7 videos per playlist

          playlists.push({
            name: playlistNames[Math.floor(Math.random() * playlistNames.length)] + ` - ${channel.name}`,
            user_id: channel.user_id,
            videos: videosInPlaylist.map(v => v._id),
            description: `Uma coleção curada de vídeos sobre empreendedorismo e desenvolvimento, organizada por ${channel.name}.`,
            visibility: Math.random() > 0.2 ? 'public' : 'private', // 80% public, 20% private
            created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Random time in last 90 days
          });
        }
      }
    }

    // Create additional playlists for regular users (favorites, watch later, etc.)
    for (const user of allUsers) {
      if (Math.random() > 0.4) { // 60% of users have personal playlists
        const numPersonalPlaylists = Math.floor(Math.random() * 3) + 1; // 1-3 personal playlists
        
        for (let i = 0; i < numPersonalPlaylists; i++) {
          const personalPlaylistNames = [
            'Meus Favoritos',
            'Assistir Mais Tarde',
            'Inspiração Diária',
            'Aprendizado Contínuo',
            'Ideias de Projetos',
            'Referências Importantes',
            'Desenvolvimento Pessoal',
            'Networking'
          ];

          const availableVideos = createdVideos
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 8) + 3); // 3-10 videos per personal playlist

          playlists.push({
            name: personalPlaylistNames[Math.floor(Math.random() * personalPlaylistNames.length)],
            user_id: user._id,
            videos: availableVideos.map(v => v._id),
            description: 'Playlist pessoal com conteúdos selecionados.',
            visibility: Math.random() > 0.6 ? 'public' : 'private', // 40% public, 60% private for personal playlists
            created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000) // Random time in last 60 days
          });
        }
      }
    }

    if (playlists.length > 0) {
      await Playlist.insertMany(playlists);
    }

    console.log('💬 Creating comprehensive comments and messages...');

    // Create comments on videos (ENHANCED - much more comprehensive)
    const comments: any[] = [];
    for (const video of createdVideos) {
      const numComments = Math.floor(Math.random() * 20) + 8; // 8-27 comments per video (much higher for demo)
      const commenters = allUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(numComments, allUsers.length));

      const commentTexts = [
        'Excelente conteúdo! Muito útil para quem está começando.',
        'Obrigado por compartilhar esse conhecimento valioso.',
        'Estava procurando exatamente esse tipo de informação.',
        'Ótima explicação, muito clara e didática.',
        'Já coloquei em prática algumas dicas e funcionou perfeitamente!',
        'Conteúdo de qualidade como sempre, parabéns!',
        'Poderia fazer um vídeo sobre marketing digital também?',
        'Inspirador! Parabéns pelo excelente trabalho.',
        'Muito bem explicado, salvei nos favoritos. Obrigado!',
        'Perfeito! Exactly what I needed to know.',
        'Que insights incríveis! Mudou minha perspectiva.',
        'Aplicando essas estratégias no meu negócio.',
        'Top demais! Quando sai o próximo vídeo?',
        'Muito esclarecedor, tirou todas as minhas dúvidas.',
        'Compartilhando com toda a equipe!',
        'Genial! Essa abordagem faz total sentido.',
        'Conteúdo premium de graça, que valor!',
        'Estou implementando essas ideias no meu projeto.',
        'Obrigado por democratizar esse conhecimento.',
        'Salvando para assistir novamente depois.',
        'Que case interessante, muito inspirador!',
        'Practical and actionable advice, thanks!',
        'Melhor canal sobre empreendedorismo!',
        'Ansioso pelos próximos conteúdos.',
        'Isso vai transformar meu mindset empreendedor.'
      ];

      for (const commenter of commenters) {
        // Generate random likes for this comment from other users (ENHANCED)
        const numLikes = Math.floor(Math.random() * 15) + 1; // 1-15 likes per comment (increased)
        const likers = allUsers
          .filter(u => u && u._id && commenter && commenter._id && !u._id.equals(commenter._id)) // Don't like your own comment
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.min(numLikes, allUsers.length - 1));

        comments.push({
          content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
          user_id: commenter._id,
          video_id: video._id,
          likes: likers.map(u => u._id), // Array of user ObjectIds who liked this comment
          created_at: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000) // Random time in last 45 days (increased range)
        });
      }
    }

    if (comments.length > 0) {
      await Comment.insertMany(comments);
    }

    // Create messages between users (ENHANCED - more realistic messaging system)
    const messages: any[] = [];
    
    // Messages from mentors to talents (mentorship offers)
    const mentorsForMessages = allUsers.filter(u => u.account_type === 'mentor');
    const talents = allUsers.filter(u => u.account_type === 'talent');
    
    for (let i = 0; i < Math.min(25, mentorsForMessages.length * 4); i++) { // Increased message volume
      if (mentorsForMessages.length === 0 || talents.length === 0) break;
      
      const sender = mentorsForMessages[Math.floor(Math.random() * mentorsForMessages.length)];
      const receiver = talents[Math.floor(Math.random() * talents.length)];
      
      if (!receiver || (sender && receiver && sender._id && receiver._id && sender._id.equals(receiver._id))) continue;

      const mentorMessageTexts = [
        'Olá! Vi seu projeto e gostaria de oferecer mentoria.',
        'Parabéns pelo trabalho! Posso ajudar com algumas dicas?',
        'Que tal conversarmos sobre oportunidades de crescimento?',
        'Tenho experiência na sua área e gostaria de te apoiar.',
        'Sua apresentação foi excelente! Vamos trocar ideias?',
        'Você tem potencial incrível, podemos fazer uma mentoria?',
        'Interessado em discutir estratégias para o seu projeto.',
        'Vejo muito valor no que você está desenvolvendo.',
        'Gostaria de compartilhar algumas lições aprendidas.',
        'Podemos agendar um café para conversar sobre seu futuro?'
      ];

      messages.push({
        sender_id: sender._id,
        receiver_id: receiver._id,
        content: mentorMessageTexts[Math.floor(Math.random() * mentorMessageTexts.length)],
        sender_type: 'mentor',
        read: Math.random() > 0.2, // 80% read rate
        created_at: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000) // Random time in last 20 days
      });
    }

    // Messages between talents (collaboration requests)
    for (let i = 0; i < Math.min(20, talents.length * 2); i++) {
      if (talents.length < 2) break;
      
      const sender = talents[Math.floor(Math.random() * talents.length)];
      const receiver = talents.filter(t => t && t._id && sender && sender._id && !t._id.equals(sender._id))[Math.floor(Math.random() * Math.max(1, talents.length - 1))];
      
      if (!receiver) continue;

      const collaborationMessages = [
        'Oi! Que tal colaborarmos em um projeto juntos?',
        'Vi seu trabalho e acho que podemos fazer algo incrível!',
        'Tenho uma ideia que combina com seu expertise.',
        'Interessado em formar uma parceria estratégica?',
        'Podemos unir nossos talentos para algo maior.',
        'Que tal criarmos um projeto em conjunto?',
        'Acho que nossos projetos podem se complementar.',
        'Vamos fazer networking e trocar experiências?'
      ];

      messages.push({
        sender_id: sender._id,
        receiver_id: receiver._id,
        content: collaborationMessages[Math.floor(Math.random() * collaborationMessages.length)],
        sender_type: 'talent',
        read: Math.random() > 0.25, // 75% read rate
        created_at: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000) // Random time in last 15 days
      });
    }

    // Messages from fans to content creators (appreciation and questions)
    const fans = allUsers.filter(u => u.account_type === 'fan');
    const contentCreators = allUsers.filter(u => u.account_type !== 'fan');
    
    for (let i = 0; i < Math.min(30, fans.length * 3); i++) {
      if (fans.length === 0 || contentCreators.length === 0) break;
      
      const sender = fans[Math.floor(Math.random() * fans.length)];
      const receiver = contentCreators[Math.floor(Math.random() * contentCreators.length)];
      
      if (!receiver || (sender && receiver && sender._id && receiver._id && sender._id.equals(receiver._id))) continue;

      const fanMessages = [
        'Adorei seu conteúdo! Muito inspirador.',
        'Você poderia dar uma dica sobre como começar?',
        'Sou fã do seu trabalho, continue assim!',
        'Que projeto incrível! Como posso aprender mais?',
        'Obrigado por compartilhar seu conhecimento.',
        'Seu exemplo me motiva a perseguir meus sonhos.',
        'Posso fazer uma pergunta sobre empreendedorismo?',
        'Quando vai ter novo conteúdo?',
        'Estou seguindo suas dicas e funcionando!',
        'Você é uma inspiração para muitos!'
      ];

      messages.push({
        sender_id: sender._id,
        receiver_id: receiver._id,
        content: fanMessages[Math.floor(Math.random() * fanMessages.length)],
        sender_type: 'fan',
        read: Math.random() > 0.35, // 65% read rate
        created_at: new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000) // Random time in last 25 days
      });
    }

    if (messages.length > 0) {
      await Message.insertMany(messages);
    }

    // Create subscriptions (followers) - ENHANCED to represent followers of channels/projects (COMPREHENSIVE)
    console.log('👥 Creating comprehensive subscription/follower relationships...');
    const subscriptions: any[] = [];
    
    // Each user follows multiple channels based on their interests and account type
    for (const user of allUsers) {
      let numSubscriptions;
      
      // Different subscription patterns based on user type
      switch (user.account_type) {
        case 'fan':
          numSubscriptions = Math.floor(Math.random() * 8) + 5; // Fans follow 5-12 channels (they're active consumers)
          break;
        case 'talent':
          numSubscriptions = Math.floor(Math.random() * 6) + 3; // Talents follow 3-8 channels (learning from others)
          break;
        case 'mentor':
          numSubscriptions = Math.floor(Math.random() * 5) + 2; // Mentors follow 2-6 channels (selective following)
          break;
        default:
          numSubscriptions = Math.floor(Math.random() * 4) + 1; // Others follow 1-4 channels
      }
      
      const subscribableChannels = createdChannels
        .filter(c => c && c.user_id && user && user._id && !c.user_id.equals(user._id)) // Can't follow own channel
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(numSubscriptions, createdChannels.length - 1));

      for (const channel of subscribableChannels) {
        subscriptions.push({
          user_id: user._id, // The follower
          channel_id: channel._id, // The channel being followed
          notifications_enabled: Math.random() > 0.3, // 70% enable notifications
          subscribed_at: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000), // Random time in last 120 days
          last_interaction: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined // 80% have recent interactions
        });
      }
    }

    // Additional cross-category subscriptions to create a more realistic network
    for (let i = 0; i < 25; i++) { // Add 25 extra random subscriptions for network density
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const randomChannel = createdChannels[Math.floor(Math.random() * createdChannels.length)];
      
      if (randomUser && randomChannel && randomUser._id && randomChannel.user_id && 
          !randomUser._id.equals(randomChannel.user_id) && 
          !subscriptions.some(s => s.user_id.equals(randomUser._id) && s.channel_id.equals(randomChannel._id))) {
        
        subscriptions.push({
          user_id: randomUser._id,
          channel_id: randomChannel._id,
          notifications_enabled: Math.random() > 0.4, // 60% enable notifications
          subscribed_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random time in last 90 days
          last_interaction: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000) : undefined
        });
      }
    }

    if (subscriptions.length > 0) {
      await Subscription.insertMany(subscriptions);
    }

    console.log('📊 Creating analytics and engagement data...');
    
    // Create video watch history for analytics (simulated data)
    const videoWatchHistory: any[] = [];
    for (const user of allUsers) {
      const watchedVideos = createdVideos
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 15) + 5); // Each user watches 5-19 videos
      
      for (const video of watchedVideos) {
        const watchDuration = Math.floor(Math.random() * 100); // 0-100% watched
        const watchDate = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000); // Last 60 days
        
        videoWatchHistory.push({
          user_id: user._id,
          video_id: video._id,
          watch_duration_percentage: watchDuration,
          watched_at: watchDate,
          device_type: Math.random() > 0.6 ? 'mobile' : Math.random() > 0.5 ? 'desktop' : 'tablet',
          completed: watchDuration > 85 // Consider completed if watched more than 85%
        });
      }
    }

    // Create user engagement metrics (simulated analytics data)
    const userEngagementMetrics = allUsers.map(user => {
      const userSubscriptions = subscriptions.filter(s => s.user_id.equals(user._id));
      const userComments = comments.filter(c => c.user_id.equals(user._id));
      const userMessages = messages.filter(m => m.sender_id.equals(user._id));
      const userWatches = videoWatchHistory.filter(w => w.user_id.equals(user._id));
      
      return {
        user_id: user._id,
        total_subscriptions: userSubscriptions.length,
        total_comments: userComments.length,
        total_messages_sent: userMessages.length,
        total_videos_watched: userWatches.length,
        avg_watch_duration: userWatches.length > 0 ? 
          userWatches.reduce((sum, w) => sum + w.watch_duration_percentage, 0) / userWatches.length : 0,
        engagement_score: Math.floor(
          (userSubscriptions.length * 10) + 
          (userComments.length * 5) + 
          (userMessages.length * 3) + 
          (userWatches.length * 2)
        ),
        last_active: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Active in last 7 days
        account_created: user.created_at || new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
      };
    });

    // Create channel analytics (simulated data)
    const channelAnalytics = createdChannels.map(channel => {
      const channelSubscribers = subscriptions.filter(s => s.channel_id.equals(channel._id));
      const channelVideos = createdVideos.filter(v => v.channel_id.equals(channel._id));
      const channelComments = comments.filter(c => 
        channelVideos.some(v => v._id.equals(c.video_id))
      );
      const channelWatches = videoWatchHistory.filter(w => 
        channelVideos.some(v => v._id.equals(w.video_id))
      );
      
      return {
        channel_id: channel._id,
        total_subscribers: channelSubscribers.length,
        total_videos: channelVideos.length,
        total_views: channelWatches.length,
        total_comments: channelComments.length,
        subscriber_growth_rate: Math.floor(Math.random() * 20) + 5, // 5-24% monthly growth
        avg_engagement_rate: Math.floor(Math.random() * 15) + 5, // 5-19% engagement rate
        top_performing_video: channelVideos.length > 0 ? 
          channelVideos.sort((a, b) => b.view_count - a.view_count)[0]._id : null,
        revenue_potential: Math.floor(Math.random() * 5000) + 1000, // $1000-5999 potential monthly revenue
        last_updated: new Date()
      };
    });

    console.log('📈 Analytics Summary:');
    console.log(`- Video watch sessions: ${videoWatchHistory.length}`);
    console.log(`- User engagement metrics: ${userEngagementMetrics.length}`);
    console.log(`- Channel analytics: ${channelAnalytics.length}`);
    console.log(`- Average engagement score: ${Math.floor(userEngagementMetrics.reduce((sum, u) => sum + u.engagement_score, 0) / userEngagementMetrics.length)}`);
    console.log(`- Total video views (simulated): ${videoWatchHistory.length}`);
    console.log(`- Average subscription rate: ${Math.floor(subscriptions.length / allUsers.length)} per user`);

    // Store analytics data in a temporary collection for demo purposes
    // Note: In a real application, this would be in a separate analytics database

    // Summary of created data
    const summary = {
      users: users.length,
      usersByType: {
        fans: users.filter(u => u.account_type === 'fan').length,
        talents: users.filter(u => u.account_type === 'talent').length,
        mentors: users.filter(u => u.account_type === 'mentor').length
      },
      categories: categories.length,
      channels: createdChannels.length,
      desafios: createdDesafios.length,
      desafiosByStatus: {
        ativo: createdDesafios.filter(d => d.status === 'Ativo').length,
        finalizado: createdDesafios.filter(d => d.status === 'Finalizado').length,
        emBreve: createdDesafios.filter(d => d.status === 'Em Breve').length
      },
      desafiosByDifficulty: {
        iniciante: createdDesafios.filter(d => d.difficulty === 'Iniciante').length,
        intermediario: createdDesafios.filter(d => d.difficulty === 'Intermediário').length,
        avancado: createdDesafios.filter(d => d.difficulty === 'Avançado').length
      },
      featuredDesafios: createdDesafios.filter(d => d.featured).length,
      projetos: createdProjetos.length,
      videos: createdVideos.length,
      playlists: playlists.length,
      interactions: {
        desafioFavorites: totalDesafioFavorites,
        projetoLikes: totalProjetoLikes,
        projetoFavorites: totalProjetoFavorites,
        participationRequests: totalParticipationRequests,
        projetoDesafioLinks: totalProjetoDesafioLinks,
        userFollowingRelationships: totalFollowingRelationships,
        comments: comments.length,
        messages: messages.length,
        subscriptions: subscriptions.length
      },
      analytics: {
        totalVideoWatches: videoWatchHistory.length,
        avgEngagementScore: Math.floor(userEngagementMetrics.reduce((sum, u) => sum + u.engagement_score, 0) / userEngagementMetrics.length),
        avgSubscriptionsPerUser: Math.floor(subscriptions.length / users.length),
        avgCommentsPerVideo: Math.floor(comments.length / createdVideos.length),
        totalUserEngagementRecords: userEngagementMetrics.length,
        totalChannelAnalytics: channelAnalytics.length,
        mostActiveUserType: users.reduce((prev, current) => {
          const prevEngagement = userEngagementMetrics.find(u => u.user_id.equals(prev._id))?.engagement_score || 0;
          const currentEngagement = userEngagementMetrics.find(u => u.user_id.equals(current._id))?.engagement_score || 0;
          return currentEngagement > prevEngagement ? current : prev;
        }).account_type,
        highestEngagementScore: Math.max(...userEngagementMetrics.map(u => u.engagement_score)),
        avgFollowersPerUser: Math.floor(users.reduce((sum, u) => sum + u.followers.length, 0) / users.length),
        mostFollowedUserType: users.reduce((prev, current) => {
          return current.followers.length > prev.followers.length ? current : prev;
        }).account_type,
        totalPlatformActivity: comments.length + messages.length + subscriptions.length + videoWatchHistory.length + totalFollowingRelationships
      },
      businessMetrics: {
        contentCreators: users.filter(u => u.account_type !== 'fan').length,
        avgFollowersPerChannel: Math.floor(subscriptions.length / createdChannels.length),
        avgUserFollowersCount: Math.floor(users.reduce((sum, u) => sum + u.followers.length, 0) / users.length),
        totalInteractionEvents: totalDesafioFavorites + totalProjetoLikes + totalProjetoFavorites + totalParticipationRequests + comments.length + totalFollowingRelationships,
        avgDesafioParticipants: Math.floor(createdDesafios.reduce((sum, d) => sum + d.participants, 0) / createdDesafios.length),
        avgFavoritesPerDesafio: Math.floor(totalDesafioFavorites / createdDesafios.length),
        projectParticipationRate: Math.floor((totalParticipationRequests / (createdProjetos.length * users.filter(u => u.account_type === 'talent').length)) * 100),
        messageEngagementRate: Math.floor((messages.filter(m => m.read).length / messages.length) * 100),
        challengeFavoriteRate: Math.floor((totalDesafioFavorites / (createdDesafios.length * users.length)) * 100),
        userFollowRate: Math.floor((totalFollowingRelationships / (users.length * (users.length - 1))) * 100)
      }
    };

    console.log('✅ Seed completed successfully!');
    console.log('📊 Summary:', JSON.stringify(summary, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Base de dados resetada e populada com sucesso!',
      summary
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
