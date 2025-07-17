"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, MessageSquare, Settings, Share2, Upload, UserPlus, Play, MapPin, Globe, Star } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

interface UserProfile {
  _id: string;
  name: string;
  avatar: string;
  bio?: string;
  account_type: 'talent' | 'mentor' | 'fan' | 'admin';
  email?: string;
  skills?: string[];
  location?: string;
  experience?: string;
  portfolio?: string;
  verified: boolean;
  followersCount?: number;
  followingCount?: number;
  followers?: string[];
  following?: string[];
}

interface Projeto {
  _id: string;
  nome: string;
  descricao: string;
  imagem_capa: string;
  status: string;
  tecnologias: string[];
  seguidores: number;
  favoritos: string[];
  likes: string[];
  criado_em: string;
}

export default function UserProfilePage() {
  const { data: session } = useSession();
  const params = useParams();
  const userId = params.userId as string;
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserProjects();
      checkFollowStatus();
    }
  }, [userId]);

  const checkFollowStatus = async () => {
    if (!session?.user) return;
    
    try {
      const response = await fetch(`/api/users/${userId}/follow`);
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!session?.user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para seguir usuários",
        variant: "destructive",
      });
      return;
    }

    setFollowLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        toast({
          title: data.isFollowing ? "Usuário seguido!" : "Deixou de seguir",
          description: data.isFollowing 
            ? `Você agora está seguindo ${userProfile?.name}`
            : `Você deixou de seguir ${userProfile?.name}`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Erro",
          description: errorData.error || "Erro ao seguir/deixar de seguir usuário",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Erro",
        description: "Erro ao seguir/deixar de seguir usuário",
        variant: "destructive",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else {
        toast({
          title: "Erro",
          description: "Usuário não encontrado",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar perfil do usuário",
        variant: "destructive",
      });
    }
  };

  const fetchUserProjects = async () => {
    try {
      const response = await fetch(`/api/projetos?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProjetos(data);
      }
    } catch (error) {
      console.error('Error fetching user projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Carregando perfil...</h1>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Usuário não encontrado</h1>
          <p className="text-gray-600 mt-2">Este perfil não existe ou foi removido.</p>
          <Button asChild className="mt-4">
            <Link href="/projetos">Voltar aos Projetos</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === userId;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header do Perfil */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src={userProfile.avatar} />
            <AvatarFallback className="text-2xl bg-white text-gray-800">
              {userProfile.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <h1 className="text-3xl font-bold">{userProfile.name}</h1>
              {userProfile.verified && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Star className="h-3 w-3 mr-1" />
                  Verificado
                </Badge>
              )}
            </div>
            
            <Badge variant="secondary" className="mb-3 bg-white/20 text-white">
              {userProfile.account_type === 'talent' ? 'Talento' : 
               userProfile.account_type === 'mentor' ? 'Mentor' : 
               userProfile.account_type === 'admin' ? 'Administrador' : 'Fã'}
            </Badge>
            
            {userProfile.bio && (
              <p className="text-lg opacity-90 mb-3">{userProfile.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm opacity-90 justify-center md:justify-start">
              {userProfile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {userProfile.location}
                </div>
              )}
              {userProfile.experience && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {userProfile.experience}
                </div>
              )}
              {userProfile.portfolio && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <a href={userProfile.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Portfólio
                  </a>
                </div>
              )}
            </div>
            
            {/* Follower/Following Stats */}
            <div className="flex gap-6 mt-4 justify-center md:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold">{userProfile.followersCount || 0}</div>
                <div className="text-sm opacity-75">Seguidores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userProfile.followingCount || 0}</div>
                <div className="text-sm opacity-75">Seguindo</div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isOwnProfile && (
              <Button 
                variant="secondary" 
                className="bg-white/20 text-white hover:bg-white/30"
                onClick={handleFollowToggle}
                disabled={followLoading}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {followLoading ? 'Carregando...' : (isFollowing ? 'Seguindo' : 'Seguir')}
              </Button>
            )}
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            {isOwnProfile && (
              <Button asChild variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                <Link href="/profile/edit">
                  <Settings className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Skills */}
      {userProfile.skills && userProfile.skills.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Habilidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userProfile.skills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projetos */}
      <Card>
        <CardHeader>
          <CardTitle>Projetos ({projetos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {projetos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projetos.map((projeto) => (
                <Card key={projeto._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {projeto.imagem_capa && (
                      <img
                        src={projeto.imagem_capa}
                        alt={projeto.nome}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <h3 className="font-semibold mb-2 line-clamp-1">{projeto.nome}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{projeto.descricao}</p>
                    
                    {projeto.tecnologias && projeto.tecnologias.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {projeto.tecnologias.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {projeto.tecnologias.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{projeto.tecnologias.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {projeto.seguidores}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {projeto.likes?.length || 0}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {projeto.status}
                      </Badge>
                    </div>
                    
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/projetos/${projeto._id}`}>
                        Ver Projeto
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {isOwnProfile ? 'Você ainda não tem projetos.' : 'Este usuário não tem projetos públicos.'}
              </p>
              {isOwnProfile && (
                <Button asChild className="mt-4">
                  <Link href="/projetos/create">
                    <Upload className="h-4 w-4 mr-2" />
                    Criar Primeiro Projeto
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
