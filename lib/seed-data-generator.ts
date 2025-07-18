import { SeedConfig } from './seed-data-loader';

export class SeedDataGenerator {
  private config: SeedConfig;

  constructor(config: SeedConfig) {
    this.config = config;
  }

  /**
   * Generate realistic video metrics based on video ID
   */
  generateVideoMetrics(videoId: string) {
    const hash = videoId.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
    const { minViews, maxViews, likeRateMin, likeRateMax, commentRateMin, commentRateMax } = 
      this.config.generation.videoMetrics;
    
    const views = Math.floor((hash % (maxViews - minViews)) + minViews);
    const likeRate = likeRateMin + (hash % 100) / 10000;
    const commentRate = commentRateMin + (hash % 50) / 10000;
    const likes = Math.floor(views * likeRate);
    const comments = Math.floor(likes * commentRate);
    
    return {
      views,
      likes,
      comments,
      publishedAt: new Date(Date.now() - (hash % 180) * 24 * 60 * 60 * 1000), // Random date in last 6 months
    };
  }

  /**
   * Generate project leadership status
   */
  generateProjectLeadership() {
    const random = Math.random();
    const { hasLeader, pendingRequest, lookingForLeader } = this.config.generation.projectLeadershipChance;
    
    if (random < hasLeader) {
      return { status: 'ativo', hasLeader: true, hasPendingRequest: false };
    } else if (random < hasLeader + pendingRequest) {
      return { status: 'buscando_lider', hasLeader: false, hasPendingRequest: true };
    } else {
      return { status: 'buscando_lider', hasLeader: false, hasPendingRequest: false };
    }
  }

  /**
   * Generate random participants for a project
   */
  generateProjectParticipants(availableUsers: any[], excludeIds: string[] = []): string[] {
    const maxParticipants = this.config.generation.maxParticipantsPerProject;
    const numParticipants = Math.floor(Math.random() * maxParticipants) + 1;
    
    const eligible = availableUsers.filter(user => 
      !excludeIds.includes(user._id.toString())
    );
    
    const participants: string[] = [];
    for (let i = 0; i < Math.min(numParticipants, eligible.length); i++) {
      const randomIndex = Math.floor(Math.random() * eligible.length);
      const participant = eligible[randomIndex];
      
      if (!participants.includes(participant._id.toString())) {
        participants.push(participant._id.toString());
        eligible.splice(randomIndex, 1); // Remove to avoid duplicates
      }
    }
    
    return participants;
  }

  /**
   * Generate random project status
   */
  generateProjectStatus(): string {
    const statuses = ['ativo', 'concluido', 'pausado'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  /**
   * Generate leadership request if needed
   */
  generateLeadershipRequest(candidateId: string) {
    const messages = [
      'Gostaria de liderar este projeto. Tenho experiência na área e estou motivado para contribuir!',
      'Tenho experiência em IA e machine learning. Gostaria de liderar este projeto inovador!',
      'Sou apaixonado por esta área e tenho as habilidades necessárias para liderar este projeto.',
      'Tenho experiência prática e gostaria de contribuir liderando este projeto.',
      'Acredito que posso agregar valor significativo como líder deste projeto.'
    ];
    
    return {
      candidato_id: candidateId,
      mensagem: messages[Math.floor(Math.random() * messages.length)],
      solicitado_em: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time within last week
      status: 'pendente'
    };
  }

  /**
   * Generate random boolean with probability
   */
  randomBoolean(probability: number = 0.5): boolean {
    return Math.random() < probability;
  }

  /**
   * Pick random element from array
   */
  randomElement<T>(array: T[]): T | undefined {
    if (!array || array.length === 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate random date within range
   */
  randomDateWithinDays(days: number): Date {
    const now = Date.now();
    const randomTime = Math.random() * days * 24 * 60 * 60 * 1000;
    return new Date(now - randomTime);
  }

  /**
   * Generate interaction data (likes, comments, views)
   */
  generateInteractionData(baseCount: number = 100) {
    const likes = Math.floor(Math.random() * baseCount * 2);
    const comments = Math.floor(Math.random() * baseCount * 0.5);
    const views = Math.floor(Math.random() * baseCount * 10);
    
    return { likes, comments, views };
  }

  /**
   * Get timeout value for operation
   */
  getTimeout(operation: keyof SeedConfig['database']['timeout']): number {
    return this.config.database.timeout[operation];
  }

  /**
   * Check if should create demo content
   */
  shouldCreateDemoContent(): boolean {
    return this.config.demo.createDemoContent;
  }

  /**
   * Check if should use real YouTube videos
   */
  shouldUseRealYouTubeVideos(): boolean {
    return this.config.demo.realYouTubeVideos;
  }

  /**
   * Check if should generate interactions
   */
  shouldGenerateInteractions(): boolean {
    return this.config.demo.generateInteractions;
  }

  /**
   * Get multiple random elements from array
   */
  randomElements<T>(array: T[], count: number): T[] {
    if (array.length === 0) return [];
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  }

  /**
   * Generate a realistic comment
   */
  generateComment(): string {
    const comments = [
      "Excelente trabalho! Muito inspirador.",
      "Adorei o conceito, muito criativo!",
      "Parabéns pelo projeto, está incrível!",
      "Muito interessante, gostaria de saber mais detalhes.",
      "Ótima iniciativa, sucesso!",
      "Projeto muito bem executado, parabéns!",
      "Adorei a ideia, muito inovadora!",
      "Excelente apresentação, muito clara.",
      "Projeto com grande potencial!",
      "Muito bem pensado, parabéns pela execução!",
      "Iniciativa fantástica, continuem assim!",
      "Projeto muito relevante para nossa área.",
      "Excelente uso da tecnologia!",
      "Muito criativo e bem estruturado.",
      "Parabéns pela dedicação e resultado!"
    ];
    return comments[Math.floor(Math.random() * comments.length)] as string;
  }

  /**
   * Generate a realistic message between users
   */
  generateMessage(): string {
    const messages = [
      "Olá! Vi seu projeto e achei muito interessante. Gostaria de conversar sobre uma possível colaboração.",
      "Parabéns pelo trabalho! Você tem experiência com React Native?",
      "Oi! Estou montando uma equipe para um projeto e gostaria de te convidar para participar.",
      "Adorei seu perfil! Você tem interesse em projetos de sustentabilidade?",
      "Olá! Podemos marcar um bate-papo sobre tecnologia e inovação?",
      "Oi! Vi que você tem expertise em IA. Tenho uma ideia que gostaria de compartilhar.",
      "Parabéns pela apresentação no último evento! Muito inspiradora.",
      "Olá! Você tem interesse em mentoria? Gostaria de trocar experiências.",
      "Oi! Vi seu projeto no GigaTalentos e gostaria de saber mais sobre a implementação.",
      "Parabéns pelo prêmio! Muito merecido. Podemos conversar sobre futuras parcerias?",
      "Olá! Estou organizando um workshop e gostaria de te convidar para participar.",
      "Oi! Vi que você domina Python. Você tem interesse em um projeto de machine learning?",
      "Parabéns pela iniciativa! Você tem experiência com startups?",
      "Olá! Gostaria de te convidar para uma conversa sobre empreendedorismo.",
      "Oi! Vi seu trabalho e fiquei impressionado. Podemos trocar uma ideia?"
    ];
    return messages[Math.floor(Math.random() * messages.length)] as string;
  }

  /**
   * Generate a realistic message subject
   */
  generateMessageSubject(): string {
    const subjects = [
      "Proposta de Colaboração",
      "Convite para Projeto",
      "Networking e Parcerias",
      "Troca de Experiências",
      "Oportunidade de Mentoria",
      "Convite para Workshop",
      "Discussão sobre Tecnologia",
      "Proposta de Parceria",
      "Compartilhamento de Ideias",
      "Convite para Evento",
      "Oportunidade de Crescimento",
      "Conexão Profissional",
      "Projeto Colaborativo",
      "Desenvolvimento de Talentos",
      "Inovação e Tecnologia"
    ];
    return subjects[Math.floor(Math.random() * subjects.length)] as string;
  }

  /**
   * Generate a participation request message
   */
  generateParticipationMessage(): string {
    const messages = [
      "Olá! Tenho muito interesse em participar deste projeto. Possuo experiência em desenvolvimento web e estou disponível para contribuir.",
      "Oi! Gostaria de me juntar à equipe. Tenho skills em design e UX que podem agregar valor ao projeto.",
      "Olá! Vi o projeto e me identifiquei muito com a proposta. Tenho experiência em marketing digital e gostaria de ajudar.",
      "Oi! Sou desenvolvedor Python e tenho interesse em contribuir com este projeto incrível.",
      "Olá! Possuo experiência em gestão de projetos e gostaria de participar desta iniciativa.",
      "Oi! Tenho background em análise de dados e acredito que posso contribuir significativamente.",
      "Olá! Sou designer gráfico e adoraria participar deste projeto inovador.",
      "Oi! Tenho experiência em mobile development e gostaria de fazer parte da equipe.",
      "Olá! Possuo conhecimento em inteligência artificial e machine learning. Gostaria de contribuir.",
      "Oi! Sou estudante de engenharia e tenho muito interesse em participar e aprender.",
      "Olá! Tenho experiência em e-commerce e acredito que posso agregar valor ao projeto.",
      "Oi! Sou especialista em cybersecurity e gostaria de contribuir com a segurança do projeto.",
      "Olá! Tenho experiência em blockchain e criptomoedas. Gostaria de participar.",
      "Oi! Sou desenvolvedor full-stack e tenho interesse em me juntar à equipe.",
      "Olá! Possuo experiência em IoT e automação. Gostaria de contribuir com o projeto."
    ];
    return messages[Math.floor(Math.random() * messages.length)] as string;
  }
}

export default SeedDataGenerator;
