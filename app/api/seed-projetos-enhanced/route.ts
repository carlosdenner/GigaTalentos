import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Projeto from '@/models/Projeto';
import User from '@/models/User';
import Channel from '@/models/Channel';
import Desafio from '@/models/Desafio';

export async function POST() {
  try {
    await connectDB();

    // Clear existing projects
    await Projeto.deleteMany({});

    // Get users and resources
    const mentors = await User.find({ account_type: 'mentor' }).limit(10);
    const talents = await User.find({ account_type: 'talent' }).limit(10);
    const channels = await Channel.find({}).limit(10);
    const desafios = await Desafio.find({}).limit(5);

    if (talents.length === 0 || channels.length === 0) {
      return NextResponse.json(
        { error: "Precisa ter usuários e portfólios criados antes" },
        { status: 400 }
      );
    }

    const allUsers = [...talents, ...mentors];
    const projetosCriados = [];

    // Sample project data
    const projetosData = [
      {
        nome: "EcoTech - Monitoramento Ambiental",
        descricao: "Sistema IoT para monitoramento ambiental em tempo real",
        objetivo: "Reduzir poluição através de tecnologia",
        categoria: "Sustentabilidade",
        status: "ativo",
        criador_tipo: "talent",
        tem_desafio: true
      },
      {
        nome: "CreativeHub - Marketplace Artístico",
        descricao: "Plataforma que conecta artistas com empresas",
        objetivo: "Democratizar oportunidades artísticas",
        categoria: "Criatividade",
        status: "ativo",
        criador_tipo: "mentor",
        tem_desafio: false
      },
      {
        nome: "TeamSync - Gestão de Equipes",
        descricao: "Ferramenta de produtividade para equipes remotas",
        objetivo: "Melhorar performance de equipes",
        categoria: "Liderança",
        status: "ativo",
        criador_tipo: "talent",
        tem_desafio: true
      },
      {
        nome: "GreenChain - Blockchain Sustentável",
        descricao: "Rastreabilidade de produtos sustentáveis",
        objetivo: "Promover consumo consciente",
        categoria: "Tecnologia",
        status: "concluido",
        criador_tipo: "mentor",
        tem_desafio: false
      },
      {
        nome: "StudyBot - IA para Educação",
        descricao: "Assistant educacional usando inteligência artificial",
        objetivo: "Personalizar aprendizado",
        categoria: "Educação",
        status: "ativo",
        criador_tipo: "talent",
        tem_desafio: true
      }
    ];

    for (let i = 0; i < projetosData.length; i++) {
      const dadosProjeto = projetosData[i];
      
      // Select creator based on type
      const criador = dadosProjeto.criador_tipo === 'mentor' 
        ? mentors[i % mentors.length] 
        : talents[i % talents.length];
      
      // Leader must always be a talent
      const lider = talents[i % talents.length];
      const portfolio = channels[i % channels.length];
      
      // Optional desafio assignment
      const desafio = dadosProjeto.tem_desafio && desafios.length > 0 
        ? desafios[i % desafios.length] 
        : null;

      // Generate random participants
      const availableUsers = allUsers.filter(u => 
        u._id.toString() !== lider._id.toString() && 
        u._id.toString() !== criador._id.toString()
      );
      
      const numParticipants = Math.floor(Math.random() * 4) + 1;
      const randomParticipants = availableUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, numParticipants);

      const approvedCount = Math.floor(randomParticipants.length / 2);
      const approved = randomParticipants.slice(0, approvedCount);
      const pending = randomParticipants.slice(approvedCount);

      // Generate participation requests
      const participationRequests = randomParticipants.map((participant, idx) => ({
        usuario_id: participant._id,
        mensagem: `Gostaria de participar do projeto ${dadosProjeto.nome}!`,
        status: idx < approvedCount ? 'aprovado' : 'pendente',
        solicitado_em: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
        respondido_em: idx < approvedCount ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) : null,
        resposta_mensagem: idx < approvedCount ? 'Bem-vindo ao projeto!' : null
      }));

      // Generate likes and favorites
      const likesUsers = allUsers
        .filter(u => u._id.toString() !== criador._id.toString())
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 20) + 5)
        .map(u => u._id);

      const favoritesUsers = allUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 10) + 2)
        .map(u => u._id);

      const projeto = await Projeto.create({
        nome: dadosProjeto.nome,
        descricao: dadosProjeto.descricao,
        objetivo: dadosProjeto.objetivo,
        categoria: dadosProjeto.categoria,
        status: dadosProjeto.status,
        criador_id: criador._id,
        talento_lider_id: lider._id,
        portfolio_id: portfolio._id,
        desafio_id: desafio?._id || null,
        desafio_vinculacao_status: desafio ? 'aprovado' : null,
        desafio_aprovado: !!desafio,
        mentor_aprovador_id: desafio && mentors.length > 0 ? mentors[0]._id : null,
        likes: likesUsers,
        solicitacoes_participacao: participationRequests,
        participantes_solicitados: pending.map(p => p._id),
        participantes_aprovados: approved.map(p => p._id),
        favoritos: favoritesUsers,
        sponsors: mentors.slice(0, Math.floor(Math.random() * 2) + 1).map(m => m._id),
        seguidores: Math.floor(Math.random() * 500) + 50,
        verificado: Math.random() > 0.3,
        demo: true,
        criado_em: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        atualizado_em: new Date()
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
        criador: p.criador_id ? 'definido' : 'indefinido',
        lider: p.talento_lider_id ? 'definido' : 'indefinido',
        participantes_aprovados: p.participantes_aprovados.length,
        participantes_pendentes: p.participantes_solicitados.length,
        likes: p.likes.length,
        favoritos: p.favoritos.length
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
