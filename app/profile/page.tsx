"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, MessageSquare, Settings, Share2, Upload, UserPlus, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { getYouTubeEmbedUrl } from "@/utils"

interface UserProfile {
  _id: string;
  name: string;
  username: string;
  avatar: string;
  videosCount: number;
  followersCount: number;
  followingCount: number;
  bio?: string;
  account_type: 'talent' | 'mentor' | 'fan';
  channels?: string[]; // Add channels array
  email?: string; // Add email property
  skills?: string[]; // Add skills property
  location?: string;
  experience?: string;
  portfolio?: string;
  categories?: string[];
  verified: boolean;
  projects_count: number;
}

interface Video {
  _id: string;
  title: string;
  video_url: string;
  views: number;
  likes: number;
  created_at: string;
  channel_id: {
    _id: string;
    name: string;
  };
}

interface Projeto {
  _id: string;
  nome: string;
  descricao: string;
  objetivo: string;
  video_apresentacao?: string;
  categoria: string;
  status: 'ativo' | 'concluido' | 'pausado';
  talento_lider_id: {
    _id: string;
    name: string;
  };
  criador_id: {
    _id: string;
    name: string;
    account_type: string;
  };
  sponsors: Array<{
    _id: string;
    name: string;
    avatar: string;
  }>;
  favoritos: string[];
  criado_em: string;
}

interface Desafio {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  status: string;
  participants: number;
  created_at: string;
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState<Video[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [portfolioVideos, setPortfolioVideos] = useState<Video[]>([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileRes, videosRes, projetosRes, desafiosRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/profile/videos'),
          fetch('/api/profile/projetos'), // Nova rota específica para projetos do usuário
          fetch('/api/desafios') // Busca desafios participados
        ]);
        
        const [profileData, videosData, projetosData, desafiosData] = await Promise.all([
          profileRes.json(),
          videosRes.json(),
          projetosRes.json(),
          desafiosRes.json()
        ]);

        setProfile(profileData);
        setVideos(videosData);
        setProjetos(projetosData); // Projetos já filtrados pela API
        
        // Filtrar vídeos para o portfólio (pode ser uma seleção especial)
        setPortfolioVideos(videosData.slice(0, 6)); // Primeiros 6 como showcase
        
        setDesafios(desafiosData.slice(0, 5)); // Últimos 5 desafios
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      loadProfile();
    }
  }, [session]);

  if (loading) {
    return <div className="flex min-h-screen bg-[#0a192f] items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  if (!profile) {
    return <div className="flex min-h-screen bg-[#0a192f] items-center justify-center">
      <div className="text-white">Profile not found</div>
    </div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a192f]">
      <div className="h-48 bg-gradient-to-r from-[#10b981] to-[#3b82f6] relative">
        <div className="absolute -bottom-16 left-8 flex items-end">
          <Avatar className="h-32 w-32 border-4 border-[#0a192f]">
            {/* <AvatarImage src={profile.avatar} alt={profile.name} /> */}
            <AvatarFallback>
                    {profile.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
          </Avatar>
          <div className="ml-4 mb-4">
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
            <p className="text-white/80">{profile.email}</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Link href="/profile/edit">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
          <Link href="/talents/add">
            <Button className="bg-[#10b981] hover:bg-[#10b981]/90 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-20 px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{videos.length}</div>
              <div className="text-sm text-gray-400">Vídeos</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{projetos.length}</div>
              <div className="text-sm text-gray-400">Projetos</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{profile.followersCount}</div>
              <div className="text-sm text-gray-400">Seguidores</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{profile.followingCount}</div>
              <div className="text-sm text-gray-400">Seguindo</div>
            </div>
          </div>
          {/* Keep sponsor section hardcoded */}
          <div className="flex gap-2">
            <Button variant="outline" className="border-[#1e90ff] text-[#1e90ff]">
              <MessageSquare className="h-4 w-4 mr-2" />
              Mensagem
            </Button>
            <Button className="bg-[#1e90ff] hover:bg-[#1e90ff]/90 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Seguir
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className={`px-3 py-1 rounded-full text-sm ${
              profile.account_type === 'mentor' 
                ? 'bg-blue-100 text-blue-800' 
                : profile.account_type === 'talent'
                ? 'bg-green-100 text-green-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {profile.account_type === 'mentor' ? '🎓 Mentor' : 
               profile.account_type === 'talent' ? '⭐ Talento' : '❤️ Admirador'}
            </div>
            {profile.verified && (
              <div className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                ✓ Verificado
              </div>
            )}
            {profile.location && (
              <div className="text-gray-400 text-sm">📍 {profile.location}</div>
            )}
          </div>
          <p className="text-gray-300 max-w-2xl">
            {profile.bio || "Empreendedor e inovador profissional baseado em São Paulo. Apaixonado por descobrir novos talentos e colaborar com empreendedores de todo o Brasil."}
          </p>
        </div>

        <Tabs defaultValue={profile.account_type === 'talent' ? 'portfolio' : 'projetos'} className="mt-8">
          <TabsList className="bg-[#1a2942]">
            {profile.account_type === 'talent' && (
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
                📁 Portfólio
              </TabsTrigger>
            )}
            <TabsTrigger value="projetos" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
              🚀 Projetos
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
              🎥 Vídeos
            </TabsTrigger>
            <TabsTrigger value="desafios" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
              🏆 Desafios
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
              📋 Sobre
            </TabsTrigger>
            {profile.account_type === 'talent' && (
              <TabsTrigger value="mentoria" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
                🎓 Mentoria
              </TabsTrigger>
            )}
          </TabsList>
          
          {/* Portfolio Tab - Showcase dos melhores vídeos */}
          {profile.account_type === 'talent' && (
            <TabsContent value="portfolio" className="mt-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">🎯 Meu Portfólio</h3>
                <p className="text-gray-400">Uma coleção cuidadosamente selecionada dos meus melhores trabalhos</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioVideos.length > 0 ? (
                  portfolioVideos.map((video) => (
                    <Link href={`/talents/${video._id}`} key={video._id} className="group">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800 border-2 border-[#10b981]/20 hover:border-[#10b981]/60 transition-colors">
                        <iframe
                          src={getYouTubeEmbedUrl(video.video_url)}
                          title={video.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
                          <Eye className="h-3 w-3 text-white" />
                          <span className="text-white text-xs">{video.views?.toLocaleString()}</span>
                        </div>
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
                          <Heart className="h-3 w-3 text-[#10b981]" />
                          <span className="text-white text-xs">{video.likes?.toLocaleString()}</span>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-black/80 px-2 py-1 rounded text-center">
                            <h4 className="text-white text-sm font-medium truncate">{video.title}</h4>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-6xl mb-4">📁</div>
                    <h3 className="text-white text-lg font-medium mb-2">Portfólio em construção</h3>
                    <p className="text-gray-400">Seus melhores vídeos aparecerão aqui</p>
                    <Link href="/talents/add">
                      <Button className="mt-4 bg-[#10b981] hover:bg-[#10b981]/90">
                        Adicionar Primeiro Vídeo
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          {/* Projetos Tab */}
          <TabsContent value="projetos" className="mt-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">🚀 Meus Projetos</h3>
                <p className="text-gray-400">
                  {profile.account_type === 'mentor' 
                    ? 'Projetos que criei e apoio como mentor' 
                    : 'Projetos que lidero ou participo'
                  }
                </p>
              </div>
              <Link href="/projetos/criar">
                <Button className="bg-[#10b981] hover:bg-[#10b981]/90">
                  + Novo Projeto
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projetos.length > 0 ? (
                projetos.map((projeto) => (
                  <Link href={`/projetos/${projeto._id}`} key={projeto._id} className="group">
                    <div className="bg-[#1a2942] border border-gray-800 rounded-lg p-6 hover:border-[#10b981]/50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-white font-medium group-hover:text-[#10b981] truncate pr-2">
                          {projeto.nome}
                        </h4>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          projeto.status === 'ativo' ? 'bg-green-100 text-green-800' :
                          projeto.status === 'concluido' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {projeto.status}
                        </div>
                      </div>
                      
                      {projeto.video_apresentacao && (
                        <div className="aspect-video bg-gray-800 rounded mb-4 relative overflow-hidden">
                          <iframe
                            src={getYouTubeEmbedUrl(projeto.video_apresentacao)}
                            title={`${projeto.nome} - Apresentação`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {projeto.descricao}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {projeto.categoria}
                        </span>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-[#10b981]" />
                          <span className="text-xs text-gray-400">{projeto.favoritos?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-white text-lg font-medium mb-2">Nenhum projeto ainda</h3>
                  <p className="text-gray-400 mb-4">
                    {profile.account_type === 'mentor' 
                      ? 'Crie projetos para apoiar talentos ou ofereça mentoria'
                      : 'Lidere projetos inovadores e mostre suas habilidades'
                    }
                  </p>
                  <Link href="/projetos/criar">
                    <Button className="bg-[#10b981] hover:bg-[#10b981]/90">
                      Criar Primeiro Projeto
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.length > 0 ? (
                videos.map((video) => (
                  <Link href={`/talents/${video._id}`} key={video._id} className="group">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                      <iframe
                        src={getYouTubeEmbedUrl(video.video_url)}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <Eye className="h-4 w-4 text-[#1e90ff]" />
                        <span className="text-white text-sm">{video.views?.toLocaleString()}</span>
                      </div>
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <Heart className="h-4 w-4 text-[#10b981]" />
                        <span className="text-white text-sm">{video.likes?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-white font-medium group-hover:text-[#1e90ff]">{video.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {video.channel_id.name} • {new Date(video.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-400">
                  Nenhum vídeo enviado ainda.
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Desafios Tab */}
          <TabsContent value="desafios" className="mt-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">🏆 Desafios</h3>
              <p className="text-gray-400">
                {profile.account_type === 'mentor' 
                  ? 'Desafios que criei e apoio'
                  : 'Desafios que participo ou completei'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {desafios.length > 0 ? (
                desafios.map((desafio) => (
                  <Link href={`/desafios/${desafio._id}`} key={desafio._id} className="group">
                    <div className="bg-[#1a2942] border border-gray-800 rounded-lg p-6 hover:border-[#10b981]/50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-white font-medium group-hover:text-[#10b981] truncate pr-2">
                          {desafio.title}
                        </h4>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          desafio.difficulty === 'Iniciante' ? 'bg-green-100 text-green-800' :
                          desafio.difficulty === 'Intermediário' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {desafio.difficulty}
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {desafio.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{desafio.category}</span>
                        <span>{desafio.participants} participantes</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-white text-lg font-medium mb-2">Nenhum desafio ainda</h3>
                  <p className="text-gray-400 mb-4">
                    {profile.account_type === 'mentor' 
                      ? 'Crie desafios para testar e desenvolver talentos'
                      : 'Participe de desafios para mostrar suas habilidades'
                    }
                  </p>
                  <Link href="/desafios">
                    <Button className="bg-[#10b981] hover:bg-[#10b981]/90">
                      Explorar Desafios
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#1a2942] border-gray-800 text-white">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        📝 Biografia
                      </h3>
                      <p className="text-gray-300">
                        {profile.bio || "Nenhuma biografia fornecida ainda."}
                      </p>
                    </div>

                    {profile.experience && (
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          💼 Experiência
                        </h3>
                        <p className="text-gray-300">{profile.experience}</p>
                      </div>
                    )}

                    {profile.skills && profile.skills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          🛠️ Habilidades
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill, index) => (
                            <span key={index} className="bg-[#0a192f] px-3 py-1 rounded-full text-sm border border-[#10b981]/20">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.categories && profile.categories.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          📂 Categorias de Interesse
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.categories.map((category, index) => (
                            <span key={index} className="bg-[#3b82f6]/10 text-[#3b82f6] px-3 py-1 rounded-full text-sm border border-[#3b82f6]/20">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1a2942] border-gray-800 text-white">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        📞 Contato
                      </h3>
                      <p className="text-gray-300">Para parcerias: {profile.email}</p>
                      {profile.portfolio && (
                        <p className="text-gray-300 mt-2">
                          <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-[#10b981] hover:underline">
                            🔗 Portfolio Externo
                          </a>
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        📊 Estatísticas
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a192f] p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-[#10b981]">{videos.length}</div>
                          <div className="text-sm text-gray-400">Vídeos</div>
                        </div>
                        <div className="bg-[#0a192f] p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-[#3b82f6]">{projetos.length}</div>
                          <div className="text-sm text-gray-400">Projetos</div>
                        </div>
                      </div>
                    </div>

                    {profile.account_type === 'talent' && (
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          🎯 Objetivos
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
                            Construir portfólio sólido
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
                            Liderar projetos inovadores
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-2 h-2 bg-[#f59e0b] rounded-full"></div>
                            Conectar com mentores
                          </div>
                        </div>
                      </div>
                    )}

                    {profile.account_type === 'mentor' && (
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          🎓 Como Mentor
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
                            Apoio projetos promissores
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
                            Orientação especializada
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-2 h-2 bg-[#f59e0b] rounded-full"></div>
                            Rede de contatos
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Mentoria Tab - apenas para talentos */}
          {profile.account_type === 'talent' && (
            <TabsContent value="mentoria" className="mt-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">🎓 Mentoria & Networking</h3>
                <p className="text-gray-400">Conecte-se com mentores e expanda sua rede profissional</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#1a2942] border-gray-800 text-white">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                      👥 Mentores Conectados
                    </h4>
                    <div className="space-y-4">
                      {/* Mock mentor data - em produção virá da API */}
                      <div className="flex items-center gap-4 bg-[#0a192f] p-4 rounded-lg">
                        <div className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center text-white font-bold">
                          M1
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium">Maria Santos</h5>
                          <p className="text-gray-400 text-sm">Especialista em Inovação</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-[#10b981] text-[#10b981]">
                          Conversar
                        </Button>
                      </div>
                      
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🔍</div>
                        <p className="text-gray-400 mb-4">Procurando por mentores?</p>
                        <Link href="/mentores">
                          <Button className="bg-[#10b981] hover:bg-[#10b981]/90">
                            Encontrar Mentores
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1a2942] border-gray-800 text-white">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                      📈 Crescimento Profissional
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-[#0a192f] p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Próximos Passos</h5>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#f59e0b] rounded-full"></div>
                            Completar perfil profissional
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
                            Adicionar mais projetos ao portfólio
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
                            Participar de desafios
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-[#0a192f] p-4 rounded-lg">
                        <h5 className="font-medium mb-2">Oportunidades</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Projetos Ativos</span>
                            <span className="text-[#10b981] font-medium">{projetos.filter(p => p.status === 'ativo').length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Vídeos no Portfólio</span>
                            <span className="text-[#3b82f6] font-medium">{portfolioVideos.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}

