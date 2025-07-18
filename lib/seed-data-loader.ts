import fs from 'fs';
import path from 'path';

export interface SeedConfig {
  database: {
    clearExisting: boolean;
    timeout: {
      categoryCreation: number;
      userCreation: number;
      desafioCreation: number;
      projectCreation: number;
      videoCreation: number;
    };
  };
  generation: {
    maxParticipantsPerProject: number;
    projectLeadershipChance: {
      hasLeader: number;
      pendingRequest: number;
      lookingForLeader: number;
    };
    videoMetrics: {
      minViews: number;
      maxViews: number;
      likeRateMin: number;
      likeRateMax: number;
      commentRateMin: number;
      commentRateMax: number;
    };
  };
  demo: {
    createDemoContent: boolean;
    realYouTubeVideos: boolean;
    generateInteractions: boolean;
  };
  files: {
    categories: string;
    users: string;
    desafios: string;
    projectTemplates: string;
    adminProjects: string;
    youtubeVideos: string;
  };
}

export interface Category {
  name: string;
  code: string;
  description: string;
  thumbnail: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
  avatar: string;
  account_type: 'admin' | 'fan' | 'talent' | 'mentor' | 'sponsor';
  bio: string;
  location: string;
  portfolio?: string;
  experience: string;
  skills?: string[];
  verified?: boolean;
}

export interface UsersData {
  admin: User[];
  fans: User[];
  talents: User[];
  mentors: User[];
  sponsors: User[];
}

export interface Prize {
  position: string;
  description: string;
  value: string;
}

export interface Desafio {
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  category: string;
  creator: string;
  start_date: string;
  end_date: string;
  prizes: Prize[];
  requirements: string[];
}

export interface ProjectTemplate {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  demo_url: string;
  repository_url: string;
  image: string;
}

export interface AdminProject {
  nome: string;
  descricao: string;
  objetivo: string;
  categoria: string;
  video_apresentacao: string;
  status: string;
  lideranca_status: string;
  avatar: string;
  imagem_capa: string;
  tecnologias: string[];
  repositorio_url: string;
  demo_url: string;
  visibilidade: string;
  colaboradores_max: number;
  duracao_estimada: string;
  nivel_dificuldade: string;
  custo_estimado: string;
  desafio_vinculacao_status: string;
  verificado: boolean;
  demo: boolean;
  leadership_request?: {
    mensagem: string;
    days_ago: number;
    status: string;
  };
}

export interface YouTubeVideo {
  youtube_id: string;
  title: string;
  description: string;
  channel_name: string;
  category_name: string;
  featured: boolean;
  tags: string[];
  duration: string;
}

class SeedDataLoader {
  private basePath: string;

  constructor() {
    this.basePath = process.cwd();
  }

  /**
   * Load seed configuration
   */
  loadConfig(): SeedConfig {
    const configPath = path.join(this.basePath, 'data', 'seed', 'config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  }

  /**
   * Load categories data
   */
  loadCategories(): Category[] {
    const categoriesPath = path.join(this.basePath, 'data', 'seed', 'categories.json');
    const categoriesData = fs.readFileSync(categoriesPath, 'utf8');
    return JSON.parse(categoriesData);
  }

  /**
   * Load users data
   */
  loadUsers(): UsersData {
    const usersPath = path.join(this.basePath, 'data', 'seed', 'users.json');
    const usersData = fs.readFileSync(usersPath, 'utf8');
    return JSON.parse(usersData);
  }

  /**
   * Load desafios (challenges) data
   */
  loadDesafios(): Desafio[] {
    const desafiosPath = path.join(this.basePath, 'data', 'seed', 'desafios.json');
    const desafiosData = fs.readFileSync(desafiosPath, 'utf8');
    return JSON.parse(desafiosData);
  }

  /**
   * Load project templates data
   */
  loadProjectTemplates(): ProjectTemplate[] {
    const templatesPath = path.join(this.basePath, 'data', 'seed', 'project-templates.json');
    const templatesData = fs.readFileSync(templatesPath, 'utf8');
    return JSON.parse(templatesData);
  }

  /**
   * Load admin projects data
   */
  loadAdminProjects(): AdminProject[] {
    const adminProjectsPath = path.join(this.basePath, 'data', 'seed', 'admin-projects.json');
    const adminProjectsData = fs.readFileSync(adminProjectsPath, 'utf8');
    return JSON.parse(adminProjectsData);
  }

  /**
   * Load YouTube videos data
   */
  loadYouTubeVideos(): YouTubeVideo[] {
    const youtubeVideosPath = path.join(this.basePath, 'data', 'seed', 'youtube-videos.json');
    const youtubeVideosData = fs.readFileSync(youtubeVideosPath, 'utf8');
    return JSON.parse(youtubeVideosData);
  }

  /**
   * Load all seed data
   */
  loadAll() {
    return {
      config: this.loadConfig(),
      categories: this.loadCategories(),
      users: this.loadUsers(),
      desafios: this.loadDesafios(),
      projectTemplates: this.loadProjectTemplates(),
      adminProjects: this.loadAdminProjects(),
      youtubeVideos: this.loadYouTubeVideos()
    };
  }
}

export default SeedDataLoader;
