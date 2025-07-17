'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle, Users, Star, TrendingUp, ExternalLink, UserPlus, UserMinus } from "lucide-react";
import { useSession } from "next-auth/react";

interface Channel {
  _id: string;
  name: string;
  description: string;
  subscribers: number;
  avatar: string;
  cover_image: string;
  category: string;
  verified: boolean;
  user_id: {
    _id: string;
    name: string;
    avatar: string;
    account_type: string;
    portfolio?: string;
  };
  demo: boolean;
  created_at: string;
}

interface ChannelWithFollowState extends Channel {
  isFollowing?: boolean;
  isOwnChannel?: boolean;
}

function FollowButton({ channel, onFollowChange }: { 
  channel: ChannelWithFollowState;
  onFollowChange: (channelId: string, isFollowing: boolean) => void;
}) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFollowToggle = async () => {
    if (!session) {
      // Redirect to login or show login modal
      window.location.href = '/auth/signin';
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log('Attempting to toggle follow for channel:', channel._id);
      console.log('Session user ID:', session.user?.id);
      
      const response = await fetch(`/api/channels/${channel._id}/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Follow toggle response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Follow toggle response:', data);
        onFollowChange(channel._id, data.isSubscribed);
      } else {
        const errorData = await response.json();
        console.error('Failed to toggle follow:', response.status, errorData);
        setError(errorData.error || 'Erro ao seguir canal');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      setError('Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  };

  if (channel.isOwnChannel) {
    return null; // Don't show follow button for own channel
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        onClick={handleFollowToggle}
        disabled={isLoading}
        variant={channel.isFollowing ? "outline" : "default"}
        size="sm"
        className={`${
          channel.isFollowing 
            ? "border-gray-600 text-gray-300 hover:bg-red-500 hover:text-white hover:border-red-500" 
            : "bg-[#10b981] hover:bg-[#10b981]/90 text-white"
        }`}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
        ) : channel.isFollowing ? (
          <UserMinus className="h-3 w-3 mr-1" />
        ) : (
          <UserPlus className="h-3 w-3 mr-1" />
        )}
        {channel.isFollowing ? "Deixar de seguir" : "Seguir"}
      </Button>
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
    </div>
  );
}

export default function FeaturedChannelsPage() {
  const [channels, setChannels] = useState<ChannelWithFollowState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchFeaturedChannels() {
      try {
        const response = await fetch('/api/channels/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch channels');
        }
        
        const data = await response.json();
        
        // Sort channels by subscribers and verification status for "featured" display
        const featuredChannels = data
          .sort((a: Channel, b: Channel) => {
            const scoreA = (a.subscribers || 0) + (a.verified ? 1000 : 0);
            const scoreB = (b.subscribers || 0) + (b.verified ? 1000 : 0);
            return scoreB - scoreA;
          });
        
        // Add follow state for each channel
        const channelsWithFollowState = await Promise.all(
          featuredChannels.map(async (channel: Channel) => {
            let isFollowing = false;
            let isOwnChannel = false;

            if (session?.user?.id) {
              isOwnChannel = channel.user_id?._id === session.user.id;
              
              if (!isOwnChannel) {
                try {
                  const followResponse = await fetch(`/api/channels/${channel._id}/subscription`);
                  if (followResponse.ok) {
                    const followData = await followResponse.json();
                    isFollowing = followData.isSubscribed;
                  }
                } catch (err) {
                  console.error('Error checking follow status:', err);
                }
              }
            }

            return {
              ...channel,
              isFollowing,
              isOwnChannel
            };
          })
        );

        setChannels(channelsWithFollowState);
      } catch (err) {
        console.error('Error fetching channels:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch channels');
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedChannels();
  }, [session]);

  const handleFollowChange = (channelId: string, isFollowing: boolean) => {
    setChannels(prevChannels =>
      prevChannels.map(channel =>
        channel._id === channelId
          ? { 
              ...channel, 
              isFollowing,
              subscribers: channel.subscribers + (isFollowing ? 1 : -1)
            }
          : channel
      )
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <TrendingUp className="h-10 w-10 text-[#10b981]" />
            Canais em Destaque
          </h1>
          <p className="text-gray-400 text-lg">
            Descubra os canais mais populares da nossa comunidade de talentos e mentores
          </p>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <TrendingUp className="h-10 w-10 text-[#10b981]" />
            Canais em Destaque
          </h1>
        </div>
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-[#10b981] hover:bg-[#10b981]/90"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <TrendingUp className="h-10 w-10 text-[#10b981]" />
          Canais em Destaque
        </h1>
        <p className="text-gray-400 text-lg">
          Descubra os canais mais populares da nossa comunidade de talentos e mentores. 
          Conecte-se com criadores inspiradores e acompanhe seus portfólios.
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>Ordenados por popularidade (seguidores + verificação)</span>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum canal encontrado</h3>
            <p className="text-gray-500">Os canais em destaque aparecerão aqui em breve.</p>
          </div>
        ) : (
          channels.map((channel) => (
            <Card key={channel._id} className="bg-[#1a2942] border-gray-800 hover:border-[#10b981] transition-colors group">
              <CardContent className="p-0">
                {/* Cover Image */}
                <div className="relative h-32 bg-gradient-to-r from-[#10b981] to-[#3b82f6] overflow-hidden rounded-t-lg">
                  {channel.cover_image && channel.cover_image !== '/placeholder.jpg' ? (
                    <Image
                      src={channel.cover_image}
                      alt={`Capa do ${channel.name}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* Verification Badge */}
                  {channel.verified && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-blue-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Verificado
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Channel Avatar & Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16 border-2 border-[#10b981]">
                      <AvatarImage src={channel.avatar || '/placeholder-user.jpg'} alt={channel.name} />
                      <AvatarFallback className="bg-[#10b981] text-white text-lg font-bold">
                        {channel.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white mb-1 truncate">
                        {channel.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        por {channel.user_id?.name || 'Usuário'}
                      </p>
                      <Badge variant="outline" className="text-xs border-[#10b981] text-[#10b981]">
                        {channel.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {channel.description || 'Canal focado em conteúdo de qualidade para empreendedores e talentos.'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{channel.subscribers.toLocaleString()} seguidores</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-3">
                    <Link href={`/channels/${channel._id}`} className="flex-1">
                      <Button className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Visitar Canal
                      </Button>
                    </Link>
                    
                    <FollowButton channel={channel} onFollowChange={handleFollowChange} />
                  </div>

                  {/* Additional Links */}
                  <div className="flex gap-2">
                    {channel.user_id?._id && (
                      <Link href={`/profile/${channel.user_id._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                          Perfil
                        </Button>
                      </Link>
                    )}
                    
                    {channel.user_id?.portfolio && (
                      <Link href={channel.user_id.portfolio} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Portfólio
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
