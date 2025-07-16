import connectDB from '../lib/mongodb';
import User from '../models/User';
import Projeto from '../models/Projeto';
import Channel from '../models/Channel';
import ProjectFavorite from '../models/ProjectFavorite';
import ParticipationRequest from '../models/ParticipationRequest';
import bcrypt from 'bcryptjs';

async function seedExtendedData() {
  try {
    await connectDB();
    console.log('🌱 Starting extended seed for project features...');

    // Get existing users and projects
    const users = await User.find().limit(10);
    const projetos = await Projeto.find().limit(10);

    if (users.length === 0 || projetos.length === 0) {
      console.log('❌ No users or projects found. Please run basic seed first.');
      return;
    }

    console.log(`Found ${users.length} users and ${projetos.length} projects`);

    // 1. Create project favorites
    console.log('📌 Creating project favorites...');
    const favoritePromises = [];
    
    for (let i = 0; i < Math.min(20, users.length * 2); i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomProject = projetos[Math.floor(Math.random() * projetos.length)];
      
      favoritePromises.push(
        ProjectFavorite.create({
          user_id: randomUser._id,
          projeto_id: randomProject._id
        }).catch(() => {}) // Ignore duplicates
      );
    }

    await Promise.allSettled(favoritePromises);
    console.log('✅ Project favorites created');

    // 2. Create participation requests
    console.log('🤝 Creating participation requests...');
    const talents = users.filter(u => u.account_type === 'talent');
    const requestPromises = [];

    for (let i = 0; i < Math.min(15, talents.length); i++) {
      const talent = talents[i];
      const randomProject = projetos[Math.floor(Math.random() * projetos.length)];
      
      // Don't request participation in own project
      if (randomProject.talento_lider_id.toString() === talent._id.toString()) {
        continue;
      }

      const skills = ['React', 'Node.js', 'Design', 'Marketing', 'Python', 'JavaScript', 'UI/UX'];
      const areas = ['Frontend', 'Backend', 'Design', 'Marketing', 'Analytics', 'Testing'];
      
      requestPromises.push(
        ParticipationRequest.create({
          projeto_id: randomProject._id,
          solicitante_id: talent._id,
          lider_id: randomProject.talento_lider_id,
          mensagem: `Olá! Tenho interesse em participar do projeto ${randomProject.nome}. Acredito que posso contribuir significativamente com minha experiência.`,
          habilidades_oferecidas: skills.slice(0, Math.floor(Math.random() * 3) + 1),
          area_interesse: areas[Math.floor(Math.random() * areas.length)],
          experiencia_relevante: `Tenho experiência em projetos similares e acredito que posso agregar valor ao ${randomProject.nome}.`,
          status: ['pendente', 'aprovado', 'rejeitado'][Math.floor(Math.random() * 3)]
        }).catch(() => {}) // Ignore duplicates
      );
    }

    await Promise.allSettled(requestPromises);
    console.log('✅ Participation requests created');

    // 3. Update some projects with approved participants
    console.log('👥 Adding approved participants to projects...');
    const approvedRequests = await ParticipationRequest.find({ status: 'aprovado' }).limit(5);
    
    for (const request of approvedRequests) {
      await Projeto.findByIdAndUpdate(
        request.projeto_id,
        {
          $addToSet: { participantes_aprovados: request.solicitante_id }
        }
      );
    }
    console.log('✅ Approved participants added to projects');

    // 4. Update project favorite counts
    console.log('❤️ Updating project favorite counts...');
    for (const projeto of projetos) {
      const favoriteCount = await ProjectFavorite.countDocuments({ projeto_id: projeto._id });
      await Projeto.findByIdAndUpdate(projeto._id, {
        seguidores: favoriteCount + projeto.seguidores // Keep existing followers and add favorites
      });
    }
    console.log('✅ Project favorite counts updated');

    // 5. Create some demo projects with all fields
    console.log('🚀 Creating enhanced demo projects...');
    const channels = await Channel.find().limit(5);
    
    const enhancedProjects = [
      {
        nome: "EcoTracker - App de Sustentabilidade",
        descricao: "Aplicativo mobile para tracking de práticas sustentáveis pessoais e corporativas.",
        objetivo: "Ajudar pessoas e empresas a monitorar e melhorar suas práticas ambientais através de gamificação e analytics.",
        video_apresentacao: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        categoria: "Sustentabilidade",
        avatar: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&h=150&fit=crop&crop=center",
        imagem_capa: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop&crop=center",
        status: "ativo",
        demo: true
      },
      {
        nome: "LearnHub - Plataforma de Educação",
        descricao: "Plataforma colaborativa para criação e compartilhamento de conteúdo educacional.",
        objetivo: "Democratizar o acesso à educação de qualidade através de uma plataforma colaborativa e interativa.",
        video_apresentacao: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        categoria: "Educação",
        avatar: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=150&fit=crop&crop=center",
        imagem_capa: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop&crop=center",
        status: "ativo",
        demo: true
      },
      {
        nome: "TechMentor - Sistema de Mentoria",
        descricao: "Plataforma que conecta profissionais experientes com jovens talentos da tecnologia.",
        objetivo: "Facilitar o desenvolvimento profissional através de conexões de mentoria personalizadas.",
        video_apresentacao: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        categoria: "Tecnologia",
        avatar: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&h=150&fit=crop&crop=center",
        imagem_capa: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&crop=center",
        status: "ativo",
        demo: true
      },
      {
        nome: "ArtFlow - Marketplace Criativo",
        descricao: "Plataforma para artistas venderem suas obras e oferecerem serviços criativos.",
        objetivo: "Empoderar artistas com ferramentas para monetizar seu talento e conectar com clientes.",
        video_apresentacao: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        categoria: "Arte & Design",
        avatar: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150&h=150&fit=crop&crop=center",
        imagem_capa: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop&crop=center",
        status: "ativo",
        demo: true
      },
      {
        nome: "HealthTrack - Monitoramento de Saúde",
        descricao: "App para monitoramento de indicadores de saúde com integração IoT.",
        objetivo: "Facilitar o acompanhamento de saúde pessoal através de tecnologia acessível.",
        video_apresentacao: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        categoria: "Saúde",
        avatar: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150&h=150&fit=crop&crop=center",
        imagem_capa: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&crop=center",
        status: "ativo",
        demo: true
      }
    ];

    for (let i = 0; i < enhancedProjects.length && i < Math.min(users.length, channels.length); i++) {
      const randomUser = users[i];
      const randomChannel = channels[i];
      
      const projectData = {
        ...enhancedProjects[i],
        talento_lider_id: randomUser._id,
        criador_id: randomUser._id,
        portfolio_id: randomChannel._id,
        seguidores: Math.floor(Math.random() * 50) + 10,
        verificado: Math.random() > 0.5,
        favoritos: [],
        participantes_solicitados: [],
        participantes_aprovados: []
      };

      await Projeto.create(projectData);
    }
    console.log('✅ Enhanced demo projects created');

    console.log('🎉 Extended seed completed successfully!');
    console.log('📊 Summary:');
    console.log(`- Project favorites: Created random favorites`);
    console.log(`- Participation requests: Created with various statuses`);
    console.log(`- Approved participants: Added to projects`);
    console.log(`- Enhanced projects: Created with all fields`);

  } catch (error) {
    console.error('❌ Error in extended seed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedExtendedData().then(() => {
    console.log('✅ Seed completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
}

export default seedExtendedData;
