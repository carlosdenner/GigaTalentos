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
import VideoWatch from '@/models/VideoWatch';
import SeedDataLoader from '@/lib/seed-data-loader';
import SeedDataGenerator from '@/lib/seed-data-generator';

export async function POST() {
  try {
    // Load seed data from structured files
    const seedLoader = new SeedDataLoader();
    const seedData = seedLoader.loadAll();
    const generator = new SeedDataGenerator(seedData.config);

    console.log('🗑️ Clearing existing data...');
    
    // Clear data more efficiently with timeout handling
    const collections = [
      { model: Comment, name: 'Comments' },
      { model: Message, name: 'Messages' },
      { model: Subscription, name: 'Subscriptions' },
      { model: Playlist, name: 'Playlists' },
      { model: VideoWatch, name: 'VideoWatches' },
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

    if (seedData.config.database.clearExisting) {
      for (const { model, name } of collections) {
        try {
          console.log(`Deleting ${name}...`);
          const count = await (model as any).countDocuments().maxTimeMS(2000);
          if (count > 1000) {
            console.log(`⚠️ Skipping ${name} (${count} documents) - too large for quick deletion`);
            continue;
          }
          await (model as any).deleteMany({}).maxTimeMS(5000);
          console.log(`✅ ${name} cleared (${count} documents)`);
        } catch (error) {
          console.warn(`⚠️ Warning: Could not clear ${name}:`, error instanceof Error ? error.message : String(error));
        }
      }
    }

    console.log('📝 Creating categories...');
    
    // Create categories from structured data
    const categories = await Promise.race([
      Category.insertMany(seedData.categories),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Categories creation timeout')), generator.getTimeout('categoryCreation')))
    ]) as any[];

    console.log('👥 Creating users...');
    
    // Hash passwords and create users
    const allUsers = [];
    
    // Process each user type
    for (const [userType, users] of Object.entries(seedData.users)) {
      for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        allUsers.push({
          ...user,
          password: hashedPassword
        });
      }
    }

    const createdUsers = await Promise.race([
      User.insertMany(allUsers),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Users creation timeout')), generator.getTimeout('userCreation')))
    ]) as any[];

    // Organize users by type for easier access
    const adminUsers = createdUsers.filter((u: any) => u.account_type === 'admin');
    const talentUsers = createdUsers.filter((u: any) => u.account_type === 'talent');
    const mentorUsers = createdUsers.filter((u: any) => u.account_type === 'mentor');
    const fanUsers = createdUsers.filter((u: any) => u.account_type === 'fan');
    const sponsorUsers = createdUsers.filter((u: any) => u.account_type === 'sponsor');
    const adminUser = adminUsers[0];

    console.log('📺 Creating channels...');
    
    // Create channels for users
    const channels = [];
    for (const user of createdUsers) {
      let channelDescription = '';
      if (user.account_type === 'admin') {
        channelDescription = 'Canal oficial da plataforma Giga Talentos - Conteúdo exclusivo sobre desenvolvimento de talentos, empreendedorismo e inovação.';
      } else if (user.account_type === 'talent') {
        channelDescription = `Canal de ${user.name} - Talento empreendedor compartilhando projetos, tutoriais e experiências na área de ${user.skills?.join(', ') || 'tecnologia'}.`;
      } else if (user.account_type === 'mentor') {
        channelDescription = `Canal de ${user.name} - Mentor experiente compartilhando conhecimento, dicas e orientações para o desenvolvimento profissional.`;
      } else {
        channelDescription = `Canal oficial de ${user.name} - ${user.bio || 'Talento empreendedor compartilhando experiências, projetos e aprendizados na jornada de inovação e desenvolvimento.'}.`;
      }
      
      channels.push({
        name: `${user.name} - Canal Oficial`,
        description: channelDescription,
        user_id: user._id,
        subscriber_count: Math.floor(Math.random() * 10000) + 100,
        video_count: 0,
        verified: user.verified || generator.randomBoolean(0.3),
        created_at: generator.randomDateWithinDays(365)
      });
    }

    const createdChannels = await Channel.insertMany(channels);

    console.log('🎯 Creating desafios...');
    
    // Create desafios from structured data with creator lookup
    const desafios = [];
    for (const desafioData of seedData.desafios) {
      // Find creator by email
      const creator = createdUsers.find(u => u.email === desafioData.creator);
      if (!creator) {
        console.warn(`Creator not found for desafio: ${desafioData.title}, using admin user`);
      }
      
      const desafio = {
        ...desafioData,
        category: categories.find(c => c.name === desafioData.category)?._id || categories[0]._id,
        created_by: creator?._id || adminUser._id,
        start_date: new Date(desafioData.start_date),
        end_date: new Date(desafioData.end_date),
        created_at: generator.randomDateWithinDays(90),
        projetos_vinculados: [], // Will be populated later
        featured: generator.randomBoolean(0.4), // 40% chance of being featured
        participants: Math.floor(Math.random() * 50) + 5, // 5-55 participants
        status: 'Ativo' // Make sure desafios are active
      };
      
      desafios.push(desafio);
    }

    const createdDesafios = await Promise.race([
      Desafio.insertMany(desafios),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Desafio creation timeout')), generator.getTimeout('desafioCreation')))
    ]) as any[];

    console.log('🚀 Creating projetos...');

    // Create projetos from templates
    const projetos = [];
    const creatorsForProjects = [...talentUsers, ...mentorUsers, ...adminUsers];
    const leadersForProjects = [...talentUsers];
    
    // Create projects from templates
    for (let i = 0; i < seedData.projectTemplates.length; i++) {
      const template = seedData.projectTemplates[i];
      const creator = creatorsForProjects[i % creatorsForProjects.length];
      const category = categories.find(c => c.name === template.category);
      
      // Generate leadership data
      const leadershipData = generator.generateProjectLeadership();
      let leader = null;
      let solicitacaoLideranca = null;
      
      if (leadershipData.hasLeader) {
        leader = creator.account_type === 'talent' ? creator : 
          (leadersForProjects.length > 0 ? generator.randomElement(leadersForProjects) : creator);
      } else if (leadershipData.hasPendingRequest && leadersForProjects.length > 0) {
        const candidateTalent = generator.randomElement(leadersForProjects);
        if (candidateTalent) {
          solicitacaoLideranca = generator.generateLeadershipRequest(candidateTalent._id);
        }
      }

      // Find channel for project
      const creatorChannel = createdChannels.find(ch => ch.user_id.toString() === creator._id.toString()) ||
                           (createdChannels.length > 0 ? generator.randomElement(createdChannels) : null);
      
      if (!creatorChannel) {
        console.warn(`No channel found for creator: ${creator.name}, skipping project: ${template.title}`);
        continue;
      }

      // Generate participants
      const excludeIds = [creator._id.toString()];
      if (leader && leader._id) {
        excludeIds.push(leader._id.toString());
      }
      const participantIds = generator.generateProjectParticipants(
        creatorsForProjects, 
        excludeIds
      );

      const projectData: any = {
        nome: template.title,
        descricao: template.description,
        objetivo: `Desenvolver ${template.description}`,
        categoria: category?._id || categories[0]._id,
        video_apresentacao: template.demo_url,
        status: generator.generateProjectStatus(),
        lideranca_status: leadershipData.status,
        avatar: '/placeholder-logo.png',
        imagem_capa: template.image,
        criador_id: creator._id,
        talento_lider_id: leader?._id || null,
        portfolio_id: creatorChannel._id,
        tecnologias: template.technologies,
        repositorio_url: template.repository_url,
        demo_url: template.demo_url,
        desafio_vinculacao_status: 'pendente',
        likes: generator.randomElements(creatorsForProjects, Math.floor(Math.random() * 8) + 2).map(u => u._id),
        favoritos: [],
        sponsors: [],
        solicitacoes_participacao: [],
        participantes_solicitados: [],
        participantes_aprovados: participantIds,
        verificado: generator.randomBoolean(0.4),
        demo: true
      };

      if (solicitacaoLideranca) {
        projectData.solicitacao_lideranca = solicitacaoLideranca;
      }

      projetos.push(projectData);
    }

    // Add admin projects
    if (adminUser) {
      const adminChannel = createdChannels.find(ch => ch.user_id.toString() === adminUser._id.toString());
      const availableTalents = talentUsers.slice(0, 3);
      
      for (const adminProject of seedData.adminProjects) {
        const category = categories.find(c => c.name === adminProject.categoria);
        
        let talentLeader = null;
        let solicitacaoLideranca = null;
        
        if (adminProject.lideranca_status === 'ativo') {
          talentLeader = availableTalents[0];
        } else if (adminProject.leadership_request) {
          const candidateTalent = availableTalents[1];
          solicitacaoLideranca = {
            candidato_id: candidateTalent._id,
            mensagem: adminProject.leadership_request.mensagem,
            solicitado_em: new Date(Date.now() - adminProject.leadership_request.days_ago * 24 * 60 * 60 * 1000),
            status: adminProject.leadership_request.status
          };
        }

        const projectData: any = {
          nome: adminProject.nome,
          descricao: adminProject.descricao,
          objetivo: adminProject.objetivo,
          categoria: category?._id || categories[0]._id,
          video_apresentacao: adminProject.video_apresentacao,
          status: adminProject.status,
          lideranca_status: adminProject.lideranca_status,
          avatar: adminProject.avatar,
          imagem_capa: adminProject.imagem_capa,
          criador_id: adminUser._id,
          talento_lider_id: talentLeader?._id || null,
          portfolio_id: adminChannel?._id || createdChannels[0]._id,
          tecnologias: adminProject.tecnologias,
          repositorio_url: adminProject.repositorio_url,
          demo_url: adminProject.demo_url,
          visibilidade: adminProject.visibilidade,
          colaboradores_max: adminProject.colaboradores_max,
          duracao_estimada: adminProject.duracao_estimada,
          nivel_dificuldade: adminProject.nivel_dificuldade,
          custo_estimado: adminProject.custo_estimado,
          desafio_vinculacao_status: adminProject.desafio_vinculacao_status,
          likes: generator.randomElements(talentUsers, Math.floor(Math.random() * 10) + 3).map(u => u._id),
          favoritos: [],
          sponsors: [],
          solicitacoes_participacao: [],
          participantes_solicitados: [],
          participantes_aprovados: [],
          verificado: adminProject.verificado,
          demo: adminProject.demo
        };

        if (solicitacaoLideranca) {
          projectData.solicitacao_lideranca = solicitacaoLideranca;
        }

        projetos.push(projectData);
      }
    }

    const createdProjetos = await Promise.race([
      Projeto.insertMany(projetos),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Project creation timeout')), generator.getTimeout('projectCreation')))
    ]) as any[];

    console.log('📹 Creating videos...');

    // Create videos from YouTube data
    const videos = [];
    
    if (generator.shouldUseRealYouTubeVideos()) {
      for (const videoData of seedData.youtubeVideos) {
        const category = categories.find(c => c.name === videoData.category_name);
        if (!category) {
          console.log(`Category "${videoData.category_name}" not found, skipping video: ${videoData.title}`);
          continue;
        }

        const videoChannel = createdChannels.find(ch => ch.name.includes(videoData.channel_name.split(' ')[0])) ||
                            (createdChannels.length > 0 ? generator.randomElement(createdChannels) : null);
        
        if (!videoChannel) {
          console.log(`No channel found for video: ${videoData.title}, skipping`);
          continue;
        }

        const metrics = generator.generateVideoMetrics(videoData.youtube_id);

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
    }

    const createdVideos = await Promise.race([
      Video.insertMany(videos),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Video creation timeout')), generator.getTimeout('videoCreation')))
    ]) as any[];

    console.log('🎵 Creating playlists...');
    
    // Create playlists for channels with videos
    const playlists = [];
    for (const channel of createdChannels) {
      const channelVideos = createdVideos.filter(v => v && v.channel_id && channel && channel._id && v.channel_id.toString() === channel._id.toString());
      
      if (channelVideos.length >= 2) {
        const videosInPlaylist = channelVideos.slice(0, Math.min(5, channelVideos.length));
        const totalDuration = videosInPlaylist.reduce((total, video) => {
          const [minutes, seconds] = video.duration.split(':').map(Number);
          return total + minutes * 60 + seconds;
        }, 0);

        const playlistData = {
          name: `${channel.name} - Seleção Especial`,
          description: `Playlist curada com os melhores vídeos do canal ${channel.name}`,
          user_id: channel.user_id,
          videos: videosInPlaylist.map(v => v._id),
          total_duration: totalDuration, // Keep as number in seconds
          created_at: generator.randomDateWithinDays(30)
        };

        console.log('Creating playlist with data:', JSON.stringify(playlistData, null, 2));
        playlists.push(playlistData);
      }
    }

    if (playlists.length > 0) {
      await Playlist.insertMany(playlists);
    }

    // Generate interactions if enabled
    let interactionStats = {};
    let likes: any[] = [];
    let favorites: any[] = [];
    let projectFavorites: any[] = [];
    let subscriptions: any[] = [];
    let comments: any[] = [];
    let messages: any[] = [];
    let participationRequests: any[] = [];
    let watches: any[] = [];

    if (generator.shouldGenerateInteractions()) {
      console.log('❤️ Creating interactions...');

      // Generate likes, favorites, subscriptions, comments, messages, and watches
      for (const user of createdUsers) {
        // Skip admin user for some interactions
        if (user.account_type === 'admin') continue;

        // Create likes for videos
        if (createdVideos.length > 0) {
          const videosToLike = generator.randomElements(createdVideos, Math.floor(Math.random() * 3) + 1);
          videosToLike.forEach(video => {
            likes.push({
              user_id: user._id,
              video_id: video._id,
              liked_at: generator.randomDateWithinDays(30)
            });
          });
        }

        // Create favorites for videos
        if (createdVideos.length > 0) {
          const videosToFavorite = generator.randomElements(createdVideos, Math.floor(Math.random() * 2) + 1);
          videosToFavorite.forEach(video => {
            favorites.push({
              user_id: user._id,
              video_id: video._id,
              favorited_at: generator.randomDateWithinDays(30)
            });
          });
        }

        // Create project favorites
        if (createdProjetos.length > 0) {
          const projectsToFavorite = generator.randomElements(createdProjetos, Math.floor(Math.random() * Math.min(3, createdProjetos.length)) + 1);
          projectsToFavorite.forEach(projeto => {
            if (projeto && projeto._id) {
              projectFavorites.push({
                user_id: user._id,
                projeto_id: projeto._id,
                favorited_at: generator.randomDateWithinDays(30)
              });
            }
          });
        }

        // Create subscriptions
        const availableChannels = createdChannels.filter(ch => ch && ch.user_id && user && user._id && ch.user_id.toString() !== user._id.toString());
        if (availableChannels.length > 0) {
          const channelsToSubscribe = generator.randomElements(
            availableChannels,
            Math.floor(Math.random() * Math.min(4, availableChannels.length)) + 1
          );
          channelsToSubscribe.forEach(channel => {
            subscriptions.push({
              user_id: user._id,
              channel_id: channel._id,
              created_at: generator.randomDateWithinDays(60)
            });
          });
        }

        // Create comments for videos
        if (createdVideos.length > 0) {
          const videosToComment = generator.randomElements(createdVideos, Math.floor(Math.random() * Math.min(3, createdVideos.length)) + 1);
          videosToComment.forEach(video => {
            if (video && video._id) {
              comments.push({
                user_id: user._id,
                video_id: video._id,
                content: generator.generateComment(),
                created_at: generator.randomDateWithinDays(20)
              });
            }
          });
        }

        // Create comments for projects
        if (createdProjetos.length > 0) {
          const projectsToComment = generator.randomElements(createdProjetos, Math.floor(Math.random() * Math.min(2, createdProjetos.length)) + 1);
          projectsToComment.forEach(projeto => {
            if (projeto && projeto._id) {
              comments.push({
                user_id: user._id,
                projeto_id: projeto._id,
                content: generator.generateComment(),
                created_at: generator.randomDateWithinDays(20)
              });
            }
          });
        }

        // Create video watches
        if (createdVideos.length > 0) {
          const videosToWatch = generator.randomElements(createdVideos, Math.floor(Math.random() * Math.min(5, createdVideos.length)) + 1);
          videosToWatch.forEach(video => {
            if (video && video._id) {
              const sessionId = `session_${Math.random().toString(36).substring(2, 15)}`;
              watches.push({
                user_id: user._id,
                video_id: video._id,
                session_id: sessionId,
                watch_duration: Math.floor(Math.random() * 300) + 30 // 30-330 seconds
              });
            }
          });
        }
      }

      // Create messages between users
      const activeUsers = createdUsers.filter(u => u.account_type !== 'admin');
      for (let i = 0; i < Math.min(40, activeUsers.length * 2); i++) {
        const sender = generator.randomElement(activeUsers);
        if (!sender) continue;
        
        const receiver = generator.randomElement(activeUsers.filter(u => u._id.toString() !== sender._id.toString()));
        if (!receiver) continue;
        
        messages.push({
          remetente: sender._id,
          destinatario: receiver._id,
          assunto: generator.generateMessageSubject(),
          mensagem: generator.generateMessage(),
          tipo: 'general',
          data_envio: generator.randomDateWithinDays(30),
          lida: generator.randomBoolean(0.7) // 70% read rate
        });
      }

      // Create participation requests for projects
      const talentUsers = createdUsers.filter(u => u.account_type === 'talent');
      for (const projeto of createdProjetos) {
        // Some projects get participation requests
        if (Math.random() < 0.6 && projeto.creator_id) {
          const requestingUser = generator.randomElement(talentUsers.filter(u => u._id.toString() !== projeto.creator_id.toString()));
          if (requestingUser) {
            participationRequests.push({
              user_id: requestingUser._id,
              projeto_id: projeto._id,
              message: generator.generateParticipationMessage(),
              status: generator.randomElement(['pending', 'approved', 'rejected']) || 'pending',
              created_at: generator.randomDateWithinDays(15)
            });
          }
        }
      }

      // Insert interactions
      if (likes.length > 0) await Like.insertMany(likes);
      if (favorites.length > 0) await Favorite.insertMany(favorites);
      if (projectFavorites.length > 0) await ProjectFavorite.insertMany(projectFavorites);
      if (subscriptions.length > 0) await Subscription.insertMany(subscriptions);
      if (comments.length > 0) await Comment.insertMany(comments);
      if (messages.length > 0) await Message.insertMany(messages);
      if (participationRequests.length > 0) await ParticipationRequest.insertMany(participationRequests);
      if (watches.length > 0) await VideoWatch.insertMany(watches);

      console.log(`📊 Interactions created: ${likes.length} likes, ${favorites.length} favorites, ${projectFavorites.length} project favorites, ${subscriptions.length} subscriptions, ${comments.length} comments, ${messages.length} messages, ${participationRequests.length} participation requests, ${watches.length} watches`);
      
      // Save interaction stats
      interactionStats = {
        likes: likes.length,
        favorites: favorites.length,
        projectFavorites: projectFavorites.length,
        subscriptions: subscriptions.length,
        comments: comments.length,
        messages: messages.length,
        participationRequests: participationRequests.length,
        watches: watches.length
      };
    }

    console.log('✅ Seed completed successfully!');
    console.log(`Created: ${categories.length} categories, ${createdUsers.length} users, ${createdChannels.length} channels, ${createdDesafios.length} desafios, ${createdProjetos.length} projetos, ${createdVideos.length} videos`);

    return NextResponse.json({
      message: 'Database seeded successfully with structured data!',
      stats: {
        categories: categories.length,
        users: createdUsers.length,
        channels: createdChannels.length,
        desafios: createdDesafios.length,
        projetos: createdProjetos.length,
        videos: createdVideos.length,
        playlists: playlists.length,
        ...(Object.keys(interactionStats).length > 0 && {
          interactions: interactionStats
        })
      }
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
