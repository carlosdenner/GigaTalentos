import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";
import Channel from "@/models/Channel";
import User from "@/models/User";
import Projeto from "@/models/Projeto";
import Desafio from "@/models/Desafio";
import Category from "@/models/Category";

interface SearchResult {
  id: string;
  type: 'video' | 'channel' | 'user' | 'projeto' | 'desafio' | 'category' | 'skill';
  title: string;
  description?: string;
  avatar?: string;
  metadata?: any;
  score: number;
  category?: string;
  tags?: string[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "all";
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        results: [], 
        groupedResults: {},
        suggestions: [],
        totalCount: 0 
      });
    }

    await connectDB();
    
    const searchTerm = query.trim();
    const searchRegex = new RegExp(searchTerm, "i");
    const results: SearchResult[] = [];

    // 1. SEARCH VIDEOS
    if (type === "videos" || type === "all") {
      const videos = await Video.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { tags: { $in: [searchRegex] } },
          { category: searchRegex },
          { youtube_channel_title: searchRegex }
        ]
      })
      .populate('channel_id', 'name avatar user_id')
      .limit(type === "videos" ? limit : Math.ceil(limit * 0.3))
      .lean();

      videos.forEach((video: any) => {
        let score = 0;
        
        // Title exact match gets highest score
        if (video.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += video.title.toLowerCase() === searchTerm.toLowerCase() ? 100 : 80;
        }
        
        // Description match
        if (video.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += 40;
        }
        
        // Tags match
        if (video.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
          score += 60;
        }
        
        // Category match
        if (video.category?.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += 50;
        }
        
        // Popularity boost
        score += Math.min(video.view_count / 1000, 20);
        score += Math.min(video.like_count / 100, 10);
        
        // Featured content boost
        if (video.featured) score += 15;

        results.push({
          id: video._id.toString(),
          type: 'video',
          title: video.title,
          description: video.description,
          avatar: video.thumbnail || video.channel_id?.avatar,
          metadata: {
            duration: video.duration,
            views: video.view_count,
            likes: video.like_count,
            channel: video.channel_id?.name || video.youtube_channel_title,
            category: video.category,
            tags: video.tags,
            youtube_id: video.youtube_id
          },
          score,
          category: video.category,
          tags: video.tags
        });
      });
    }

    // 2. SEARCH PROJETOS
    if (type === "projetos" || type === "all") {
      const projetos = await Projeto.find({
        $or: [
          { nome: searchRegex },
          { descricao: searchRegex },
          { objetivo: searchRegex },
          { tecnologias: { $in: [searchRegex] } }
        ]
      })
      .populate('criador_id', 'name avatar account_type')
      .populate('talento_lider_id', 'name avatar')
      .populate('categoria', 'name')
      .limit(type === "projetos" ? limit : Math.ceil(limit * 0.25))
      .lean();

      projetos.forEach((projeto: any) => {
        let score = 0;
        
        // Title exact match
        if (projeto.nome.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += projeto.nome.toLowerCase() === searchTerm.toLowerCase() ? 100 : 85;
        }
        
        // Description match
        if (projeto.descricao?.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += 45;
        }
        
        // Technology match (high relevance)
        if (projeto.tecnologias?.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase()))) {
          score += 70;
        }
        
        // Engagement boost
        score += Math.min((projeto.likes?.length || 0) * 2, 20);
        score += Math.min((projeto.favoritos?.length || 0) * 3, 25);
        score += Math.min((projeto.participantes_aprovados?.length || 0) * 5, 30);
        
        // Status boost
        if (projeto.status === 'ativo') score += 20;
        if (projeto.verificado) score += 15;

        results.push({
          id: projeto._id.toString(),
          type: 'projeto',
          title: projeto.nome,
          description: projeto.descricao,
          avatar: projeto.avatar || projeto.imagem_capa,
          metadata: {
            creator: projeto.criador_id?.name,
            leader: projeto.talento_lider_id?.name,
            status: projeto.status,
            technologies: projeto.tecnologias,
            participants: projeto.participantes_aprovados?.length || 0,
            likes: projeto.likes?.length || 0,
            favorites: projeto.favoritos?.length || 0,
            category: projeto.categoria?.name,
            verified: projeto.verificado,
            demo_url: projeto.demo_url,
            repository_url: projeto.repositorio_url
          },
          score,
          category: projeto.categoria?.name,
          tags: projeto.tecnologias
        });
      });
    }

    // 3. SEARCH DESAFIOS
    if (type === "desafios" || type === "all") {
      const desafios = await Desafio.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { difficulty: searchRegex }
        ]
      })
      .populate('created_by', 'name avatar account_type')
      .limit(type === "desafios" ? limit : Math.ceil(limit * 0.2))
      .lean();

      desafios.forEach((desafio: any) => {
        let score = 0;
        
        // Title exact match
        if (desafio.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += desafio.title.toLowerCase() === searchTerm.toLowerCase() ? 100 : 85;
        }
        
        // Description match
        if (desafio.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += 40;
        }
        
        // Category match
        if (desafio.category?.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += 60;
        }
        
        // Difficulty match
        if (desafio.difficulty?.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += 30;
        }
        
        // Engagement boost
        score += Math.min((desafio.favoritos?.length || 0) * 2, 25);
        score += Math.min((desafio.projetos_vinculados?.length || 0) * 3, 20);
        
        // Status and timing boost
        if (desafio.status === 'ativo') score += 25;
        if (desafio.featured) score += 20;
        
        // Prize value boost
        const prizeMatch = desafio.prizes?.[0]?.value?.match(/\d+/);
        if (prizeMatch) {
          score += Math.min(parseInt(prizeMatch[0]) / 1000, 15);
        }

        results.push({
          id: desafio._id.toString(),
          type: 'desafio',
          title: desafio.title,
          description: desafio.description,
          avatar: `/categories/${desafio.category?.toLowerCase().replace(/\s+/g, '-')}.svg`,
          metadata: {
            creator: desafio.created_by?.name,
            category: desafio.category,
            difficulty: desafio.difficulty,
            status: desafio.status,
            duration: desafio.duration,
            favorites: desafio.favoritos?.length || 0,
            linked_projects: desafio.projetos_vinculados?.length || 0,
            prizes: desafio.prizes,
            featured: desafio.featured
          },
          score,
          category: desafio.category
        });
      });
    }

    // 4. SEARCH USERS (TALENTOS & MENTORES)
    if (type === "users" || type === "talentos" || type === "mentores" || type === "all") {
      const users = await User.find({
        $and: [
          {
            $or: [
              { name: searchRegex },
              { bio: searchRegex },
              { skills: { $in: [searchRegex] } },
              { experience: searchRegex }
            ]
          },
          type === "talentos" ? { account_type: 'talent' } :
          type === "mentores" ? { account_type: 'mentor' } :
          { account_type: { $in: ['talent', 'mentor'] } }
        ]
      })
      .limit(type === "users" || type === "talentos" || type === "mentores" ? limit : Math.ceil(limit * 0.15))
      .lean();

      users.forEach((user: any) => {
        let score = 0;
        
        // Name exact match
        if (user.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += user.name.toLowerCase() === searchTerm.toLowerCase() ? 100 : 90;
        }
        
        // Skills match (very relevant)
        if (user.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))) {
          score += 80;
        }
        
        // Bio match
        if (user.bio?.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += 35;
        }
        
        // Experience match
        if (user.experience?.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += 40;
        }
        
        // Social boost
        score += Math.min((user.followers?.length || 0) * 2, 30);
        score += Math.min((user.following?.length || 0), 15);
        
        // Account type boost
        if (user.account_type === 'mentor') score += 10;

        results.push({
          id: user._id.toString(),
          type: 'user',
          title: user.name,
          description: user.bio,
          avatar: user.avatar,
          metadata: {
            account_type: user.account_type,
            experience: user.experience,
            skills: user.skills,
            followers: user.followers?.length || 0,
            following: user.following?.length || 0,
            location: user.location,
            social_links: user.social_links
          },
          score,
          tags: user.skills
        });
      });
    }

    // 5. SEARCH CHANNELS
    if (type === "channels" || type === "all") {
      const channels = await Channel.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      })
      .populate('user_id', 'name account_type')
      .limit(type === "channels" ? limit : Math.ceil(limit * 0.1))
      .lean();

      channels.forEach((channel: any) => {
        let score = 0;
        
        // Name exact match
        if (channel.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += channel.name.toLowerCase() === searchTerm.toLowerCase() ? 100 : 85;
        }
        
        // Description match
        if (channel.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += 40;
        }
        
        // Popularity boost
        score += Math.min((channel.subscribers || 0) / 10, 25);
        score += Math.min((channel.video_count || 0) * 2, 20);

        results.push({
          id: channel._id.toString(),
          type: 'channel',
          title: channel.name,
          description: channel.description,
          avatar: channel.avatar,
          metadata: {
            owner: channel.user_id?.name,
            owner_type: channel.user_id?.account_type,
            subscribers: channel.subscribers || 0,
            video_count: channel.video_count || 0,
            created_at: channel.created_at
          },
          score
        });
      });
    }

    // 6. SEARCH CATEGORIES & SKILLS
    if (type === "habilidades" || type === "categories" || type === "all") {
      const categories = await Category.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      }).lean();

      categories.forEach((category: any) => {
        let score = 0;
        
        if (category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += category.name.toLowerCase() === searchTerm.toLowerCase() ? 100 : 80;
        }
        
        if (category.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
          score += 50;
        }

        results.push({
          id: category._id.toString(),
          type: 'category',
          title: category.name,
          description: category.description,
          avatar: category.thumbnail,
          metadata: {
            icon: category.icon,
            color: category.color
          },
          score,
          category: category.name
        });
      });

      // Also search for skills across users
      if (searchTerm.length >= 3) {
        const usersWithSkills = await User.find({
          skills: { $in: [searchRegex] }
        }).select('skills').lean();

        const skillCounts: { [key: string]: number } = {};
        usersWithSkills.forEach((user: any) => {
          user.skills?.forEach((skill: string) => {
            if (skill.toLowerCase().includes(searchTerm.toLowerCase())) {
              skillCounts[skill] = (skillCounts[skill] || 0) + 1;
            }
          });
        });

        Object.entries(skillCounts).forEach(([skill, count]) => {
          let score = 70;
          if (skill.toLowerCase() === searchTerm.toLowerCase()) score = 90;
          score += Math.min(count * 5, 20); // Boost based on how many users have this skill

          results.push({
            id: skill.toLowerCase().replace(/\s+/g, '-'),
            type: 'skill',
            title: skill,
            description: `${count} pessoa${count === 1 ? '' : 's'} com esta habilidade`,
            metadata: {
              user_count: count,
              related_users: count
            },
            score
          });
        });
      }
    }

    // Sort by score (highest first) and apply limit
    results.sort((a, b) => b.score - a.score);
    const limitedResults = results.slice(0, limit);

    // Generate search suggestions based on partial matches
    const suggestions: string[] = [];
    if (searchTerm.length >= 2) {
      // Get suggestions from existing content
      const suggestionSources: string[] = [
        ...limitedResults.slice(0, 5).map(r => r.title).filter((title): title is string => Boolean(title)),
        ...limitedResults.slice(0, 3).flatMap(r => r.tags || []).filter((tag): tag is string => Boolean(tag)),
        ...limitedResults.slice(0, 3).map(r => r.category).filter((cat): cat is string => Boolean(cat))
      ];
      
      const uniqueSuggestions = [...new Set(suggestionSources)]
        .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()) && s.toLowerCase() !== searchTerm.toLowerCase())
        .slice(0, 5);
      
      suggestions.push(...uniqueSuggestions);
    }

    // Group results by type for easier frontend handling
    const groupedResults = limitedResults.reduce((acc, result) => {
      if (!acc[result.type]) acc[result.type] = [];
      acc[result.type].push(result);
      return acc;
    }, {} as { [key: string]: SearchResult[] });

    return NextResponse.json({
      results: limitedResults,
      groupedResults,
      suggestions,
      totalCount: results.length,
      query: searchTerm,
      searchTime: Date.now()
    });

  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search", results: [], groupedResults: {}, suggestions: [], totalCount: 0 },
      { status: 500 }
    );
  }
}