'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  Search, 
  Play, 
  Heart, 
  Users, 
  Clock, 
  PlayCircle,
  ListMusic,
  User,
  Plus,
  Filter,
  TrendingUp
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Playlist {
  _id: string;
  name: string;
  description?: string;
  user_id: {
    _id: string;
    name: string;
    avatar?: string;
    account_type: string;
  };
  videos: any[];
  followers?: string[];
  isFollowing?: boolean;
  created_at: string;
  total_duration?: number;
}

export default function PlaylistsPage() {
  const { data: session } = useSession();
  const [allPlaylists, setAllPlaylists] = useState<Playlist[]>([]);
  const [myPlaylists, setMyPlaylists] = useState<Playlist[]>([]);
  const [followedPlaylists, setFollowedPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("discover");

  useEffect(() => {
    fetchPlaylists();
  }, [session]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      
      // Fetch all public playlists
      const allResponse = await fetch('/api/playlists/public');
      if (allResponse.ok) {
        const allData = await allResponse.json();
        setAllPlaylists(allData);
      }

      // Fetch user's playlists if authenticated
      if (session?.user?.id) {
        const myResponse = await fetch('/api/playlists');
        if (myResponse.ok) {
          const myData = await myResponse.json();
          setMyPlaylists(myData);
        }

        // Fetch followed playlists
        const followedResponse = await fetch('/api/playlists/followed');
        if (followedResponse.ok) {
          const followedData = await followedResponse.json();
          setFollowedPlaylists(followedData);
        }
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar playlists",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollowPlaylist = async (playlistId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Login necessário",
        description: "Faça login para seguir playlists",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/playlists/${playlistId}/follow`, {
        method: 'POST'
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Playlist seguida!"
        });
        fetchPlaylists(); // Refresh data
      } else {
        throw new Error('Failed to follow playlist');
      }
    } catch (error) {
      console.error("Error following playlist:", error);
      toast({
        title: "Erro",
        description: "Falha ao seguir playlist",
        variant: "destructive"
      });
    }
  };

  const handleUnfollowPlaylist = async (playlistId: string) => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}/follow`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Playlist não seguida"
        });
        fetchPlaylists(); // Refresh data
      } else {
        throw new Error('Failed to unfollow playlist');
      }
    } catch (error) {
      console.error("Error unfollowing playlist:", error);
      toast({
        title: "Erro",
        description: "Falha ao deixar de seguir playlist",
        variant: "destructive"
      });
    }
  };

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getFilteredPlaylists = (playlists: Playlist[]) => {
    if (!searchTerm) return playlists;
    return playlists.filter(playlist =>
      playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playlist.user_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playlist.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const PlaylistCard = ({ playlist, showFollowButton = true }: { playlist: Playlist; showFollowButton?: boolean }) => (
    <Card className="bg-[#1a2942] border-gray-800 hover:border-[#10b981] transition-colors group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#10b981] to-[#3b82f6] rounded-lg flex items-center justify-center">
                <ListMusic className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10b981] rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{playlist.videos.length}</span>
              </div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-white text-lg line-clamp-1">{playlist.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={playlist.user_id.avatar} />
                  <AvatarFallback className="text-xs">
                    {playlist.user_id.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span>{playlist.user_id.name}</span>
                <Badge variant="outline" className="text-xs">
                  {playlist.user_id.account_type}
                </Badge>
              </div>
            </div>
          </div>
          {showFollowButton && session?.user?.id !== playlist.user_id._id && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => playlist.isFollowing ? handleUnfollowPlaylist(playlist._id) : handleFollowPlaylist(playlist._id)}
              className={playlist.isFollowing ? "border-green-600 text-green-600" : "border-gray-600 text-gray-400"}
            >
              <Heart className={`h-4 w-4 mr-1 ${playlist.isFollowing ? 'fill-current' : ''}`} />
              {playlist.isFollowing ? 'Seguindo' : 'Seguir'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {playlist.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{playlist.description}</p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <PlayCircle className="h-4 w-4" />
              <span>{playlist.videos.length} vídeos</span>
            </div>
            {playlist.total_duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(playlist.total_duration)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{playlist.followers?.length || 0} seguidores</span>
            </div>
          </div>
          <span>{new Date(playlist.created_at).toLocaleDateString('pt-BR')}</span>
        </div>

        <div className="flex gap-2">
          <Link href={`/playlists/${playlist._id}`} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-[#10b981] to-[#3b82f6] hover:from-[#059669] hover:to-[#2563eb] text-white">
              <Play className="h-4 w-4 mr-2" />
              Reproduzir
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🎵 Playlists</h1>
          <p className="text-gray-400 text-lg">
            Descubra coleções curadas de vídeos da nossa comunidade
          </p>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">🎵 Playlists</h1>
        <p className="text-gray-400 text-lg">
          Descubra coleções curadas de vídeos da nossa comunidade
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar playlists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1a2942] border-gray-800 text-white"
          />
        </div>
        {session?.user && (
          <Link href="/playlists/create">
            <Button className="bg-[#10b981] hover:bg-[#059669] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nova Playlist
            </Button>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-[#1a2942] border border-gray-800">
          <TabsTrigger 
            value="discover" 
            className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Descobrir ({allPlaylists.length})
          </TabsTrigger>
          <TabsTrigger 
            value="mine" 
            className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white"
            disabled={!session?.user}
          >
            <User className="h-4 w-4 mr-2" />
            Minhas ({myPlaylists.length})
          </TabsTrigger>
          <TabsTrigger 
            value="following" 
            className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white"
            disabled={!session?.user}
          >
            <Heart className="h-4 w-4 mr-2" />
            Seguindo ({followedPlaylists.length})
          </TabsTrigger>
          <TabsTrigger 
            value="popular" 
            className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Populares
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Todas as Playlists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredPlaylists(allPlaylists).map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              ))}
            </div>
            {getFilteredPlaylists(allPlaylists).length === 0 && (
              <div className="text-center py-12">
                <ListMusic className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma playlist encontrada</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Tente outros termos de busca.' : 'Seja o primeiro a criar uma playlist!'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="mine" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Minhas Playlists</h2>
              <Link href="/playlists/create">
                <Button className="bg-[#10b981] hover:bg-[#059669] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Playlist
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredPlaylists(myPlaylists).map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist} showFollowButton={false} />
              ))}
            </div>
            {myPlaylists.length === 0 && (
              <div className="text-center py-12">
                <ListMusic className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Você ainda não criou nenhuma playlist</h3>
                <p className="text-gray-500 mb-4">
                  Organize seus vídeos favoritos em coleções personalizadas
                </p>
                <Link href="/playlists/create">
                  <Button className="bg-[#10b981] hover:bg-[#059669] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Playlist
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="following" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Playlists que Sigo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredPlaylists(followedPlaylists).map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              ))}
            </div>
            {followedPlaylists.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Você não está seguindo nenhuma playlist</h3>
                <p className="text-gray-500 mb-4">
                  Explore playlists interessantes e siga as que mais gostar
                </p>
                <Button 
                  onClick={() => setActiveTab('discover')}
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Descobrir Playlists
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Playlists Populares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredPlaylists(
                [...allPlaylists].sort((a, b) => (b.followers?.length || 0) - (a.followers?.length || 0))
              ).map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
