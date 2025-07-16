import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Projeto from '@/models/Projeto';
import Channel from '@/models/Channel';
import User from '@/models/User';
import Desafio from '@/models/Desafio';

export async function POST() {
  try {
    await connectDB();

    // Clear existing projects
    await Projeto.deleteMany({});

    // Get users for assignment
    const mentors = await User.find({ account_type: 'mentor' });
    const talents = await User.find({ account_type: 'talent' });
    const portfolios = await Channel.find({});
    const desafios = await Desafio.find({});

    // Helper functions
    const getRandomMentor = () => mentors_found[Math.floor(Math.random() * mentors_found.length)];
    const getRandomTalent = () => talents_found[Math.floor(Math.random() * talents_found.length)];
    const getRandomPortfolio = () => channels[Math.floor(Math.random() * channels.length)];
    const getRandomDesafio = () => desafios_found[Math.floor(Math.random() * desafios_found.length)];

    const projetosSeed = [
      {
        nome: "EcoTech - Monitoramento Ambiental IoT",
        descricao: "Sistema inteligente de monitoramento ambiental usando sensores IoT para detectar poluição em tempo real e alertar autoridades competentes.",
        objetivo: "Reduzir a poluição urbana através de tecnologia acessível",
        categoria: "Habilidade Cognitiva & Técnica",
        status: "ativo",
        tipo_criador: "talent",
        tem_desafio: true,
        tem_sponsors: true,
        imagem_capa: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
        avatar: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
      },
      {
        nome: "CreativeHub - Plataforma de Colaboração",
        descricao: "Marketplace digital que conecta artistas independentes com empresas, facilitando projetos criativos colaborativos.",
        objetivo: "Democratizar oportunidades para artistas emergentes",
        categoria: "Criatividade & Inovação", 
        status: "ativo",
        tipo_criador: "mentor",
        tem_desafio: true,
        tem_sponsors: false,
        imagem_capa: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&h=400&fit=crop",
        avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=100&h=100&fit=crop"
      },
      {
        nome: "TeamSync - Gestão de Equipes Remotas",
        descricao: "Ferramenta de produtividade que combina gestão de projetos com bem-estar da equipe, promovendo liderança humanizada.",
        objetivo: "Melhorar performance e satisfação de equipes remotas",
        categoria: "Liderança & Colaboração",
        status: "ativo",
        tipo_criador: "talent",
        tem_desafio: false,
        tem_sponsors: true,
        imagem_capa: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
      },
      {
        nome: "Phoenix Startup Recovery",
        descricao: "Consultoria especializada em reestruturação de startups em crise, oferecendo metodologias de pivot e recuperação financeira.",
        objetivo: "Transformar fracassos empresariais em casos de sucesso",
        categoria: "Resiliência & Adaptabilidade",
        status: "concluido",
        tipo_criador: "mentor",
        tem_desafio: true,
        tem_sponsors: true,
        imagem_capa: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
      },
      {
        nome: "GreenChain - Rastreabilidade Sustentável",
        descricao: "Blockchain para rastreamento de produtos sustentáveis, garantindo transparência na cadeia produtiva e certificação ESG.",
        objetivo: "Promover consumo consciente através da transparência",
        categoria: "Consciência Social & Ética",
        status: "ativo",
        tipo_criador: "talent",
        tem_desafio: false,
        tem_sponsors: false,
        imagem_capa: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop"
      }
    ];

    const users = await User.find({ account_type: { $in: ['talent', 'mentor'] } });
    const talents_found = users.filter(u => u.account_type === 'talent');
    const mentors_found = users.filter(u => u.account_type === 'mentor');
    const channels = await Channel.find();
    const desafios_found = await Desafio.find();

    if (talents_found.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum usuário talent encontrado. Execute seed-users primeiro.' },
        { status: 400 }
      );
    }

    if (mentors_found.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum usuário mentor encontrado. Execute seed-mentores primeiro.' },
        { status: 400 }
      );
    }

    if (channels.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum channel encontrado. Execute seed de channels primeiro.' },
        { status: 400 }
      );
    }

    await Projeto.deleteMany({});

    const projetosCriados = [];

    for (let i = 0; i < projetosSeed.length; i++) {
      const dadosProjeto = projetosSeed[i];
      
      const criador = dadosProjeto.tipo_criador === 'mentor' 
        ? mentors_found[i % mentors_found.length] 
        : talents_found[i % talents_found.length];
      
      const lider = talents_found[i % talents_found.length];
      const channel = channels[i % channels.length];
      
      const desafio = dadosProjeto.tem_desafio ? desafios_found[i % desafios_found.length] : null;
      const mentorAprovador = desafio ? mentors_found[(i + 1) % mentors_found.length] : null;
      
      const sponsors = dadosProjeto.tem_sponsors 
        ? [mentors_found[(i + 2) % mentors_found.length]._id, mentors_found[(i + 3) % mentors_found.length]._id] 
        : [];

      // Generate random participation data
      const randomParticipants = talents_found.filter(t => 
        t._id.toString() !== lider._id.toString() && 
        t._id.toString() !== criador._id.toString()
      ).sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);

      const approvedParticipants = randomParticipants.slice(0, Math.floor(randomParticipants.length / 2));
      const pendingParticipants = randomParticipants.slice(approvedParticipants.length);

      // Generate participation requests
      const solicitacoesParticipacao = randomParticipants.map((participant, idx) => ({
        usuario_id: participant._id,
        mensagem: `Olá! Tenho interesse em participar do projeto ${dadosProjeto.nome}. Tenho experiência em ${participant.skills?.[0] || 'desenvolvimento'}.`,
        status: idx < approvedParticipants.length ? 'aprovado' : 'pendente',
        solicitado_em: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
        respondido_em: idx < approvedParticipants.length ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) : null,
        resposta_mensagem: idx < approvedParticipants.length ? 'Bem-vindo(a) ao projeto! Vamos fazer algo incrível juntos.' : null
      }));

      // Generate likes
      const likesCount = Math.floor(Math.random() * 50) + 10;
      const likesUsers = [...talents_found, ...mentors_found]
        .filter(u => u._id.toString() !== criador._id.toString())
        .sort(() => 0.5 - Math.random())
        .slice(0, likesCount)
        .map(u => u._id);

      const projeto = await Projeto.create({
        nome: dadosProjeto.nome,
        descricao: dadosProjeto.descricao,
        objetivo: dadosProjeto.objetivo,
        categoria: dadosProjeto.categoria,
        status: dadosProjeto.status,
        imagem_capa: dadosProjeto.imagem_capa,
        avatar: dadosProjeto.avatar,
        criador_id: criador._id,
        talento_lider_id: lider._id,
        portfolio_id: channel._id,
        desafio_id: desafio?._id,
        desafio_vinculacao_status: desafio ? 'aprovado' : null,
        desafio_solicitado_em: desafio ? new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000) : null,
        mentor_aprovador_id: mentorAprovador?._id,
        desafio_aprovado: desafio ? true : false,
        sponsors: sponsors,
        likes: likesUsers,
        solicitacoes_participacao: solicitacoesParticipacao,
        participantes_solicitados: pendingParticipants.map(p => p._id),
        participantes_aprovados: approvedParticipants.map(p => p._id),
        seguidores: Math.floor(Math.random() * 500) + 50,
        favoritos: talents_found.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 10) + 5).map(t => t._id),
        verificado: Math.random() > 0.5,
        criado_em: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });

      projetosCriados.push(projeto);
    }

    return NextResponse.json({
      message: `${projetosCriados.length} projetos criados com sucesso!`,
      projetos: projetosCriados.map(p => ({
        id: p._id,
        nome: p.nome,
        status: p.status,
        categoria: p.categoria,
        tem_desafio: !!p.desafio_id,
        tem_sponsors: p.sponsors.length > 0,
        criador_tipo: p.criador_id ? 'definido' : 'indefinido'
      }))
    });

  } catch (error: any) {
    console.error('Erro ao criar projetos seed:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}