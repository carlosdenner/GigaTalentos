"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Eye, Heart, Plus, Users, Tag, Video as LucideVideo, UserPlus, UserMinus } from "lucide-react";
import Link from "next/link";
import { getYouTubeEmbedUrl } from "@/utils";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

// Define proper types for the Channel and Video models
interface User {
  _id: string;
  name: string;
  avatar: string;
}

interface Channel {
  _id: string;
  name: string;
  avatar?: string;
  cover_image?: string;
  description?: string;
  subscribers?: number;
  category?: string;
  user_id: User;
}

interface Video {
  _id: string;
  title: string;
  video_url: string;
  views?: number;
  likes?: number;
  channel_id: string;
  created_at: Date;
}

interface ChannelWithVideos extends Channel {
  videos: Video[];
}

interface ChannelPageClientProps {
  channelData: ChannelWithVideos;
}

function SubscribeButton({ channelId, isOwnChannel }: { channelId: string; isOwnChannel: boolean }) {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id && !isOwnChannel) {
      checkSubscriptionStatus();
    }
  }, [session, channelId, isOwnChannel]);

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch(`/api/channels/${channelId}/subscription`);
      if (response.ok) {
        const data = await response.json();
        setIsSubscribed(data.isSubscribed);
      } else {
        console.error('Failed to check subscription status:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const handleSubscribe = async () => {
    console.log('=== SUBSCRIBE DEBUG START ===');
    console.log('Session:', session);
    console.log('Session user:', session?.user);
    console.log('Session user ID:', session?.user?.id);
    console.log('Channel ID:', channelId);
    console.log('Is own channel:', isOwnChannel);
    
    if (!session) {
      console.log('No session found, redirecting to signin');
      window.location.href = '/auth/signin';
      return;
    }

    if (!session.user?.id) {
      console.log('Session exists but no user ID');
      setError('Erro de autenticação');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Making POST request to:', `/api/channels/${channelId}/subscription`);
      
      const response = await fetch(`/api/channels/${channelId}/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('Subscribe success:', data);
        setIsSubscribed(data.isSubscribed);
      } else {
        const errorData = await response.json();
        console.error('Subscribe error:', response.status, errorData);
        setError(errorData.error || 'Erro ao inscrever-se');
      }
    } catch (error) {
      console.error('Network error subscribing:', error);
      setError('Erro de conexão');
    } finally {
      setIsLoading(false);
      console.log('=== SUBSCRIBE DEBUG END ===');
    }
  };

  if (isOwnChannel) {
    return null; // Don't show subscribe button for own channel
  }

  return (
    <div className="flex flex-col gap-1">
      <Button 
        onClick={handleSubscribe}
        disabled={isLoading}
        className={`px-8 ${
          isSubscribed 
            ? "bg-gray-600 hover:bg-red-500 text-white" 
            : "bg-[#10b981] hover:bg-[#10b981]/90 text-white"
        }`}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        ) : isSubscribed ? (
          <UserMinus className="h-4 w-4 mr-2" />
        ) : (
          <UserPlus className="h-4 w-4 mr-2" />
        )}
        {isSubscribed ? "Cancelar Inscrição" : "Inscrever-se"}
      </Button>
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
    </div>
  );
}

export default function ChannelPageClient({ channelData }: ChannelPageClientProps) {
  const { data: session } = useSession();
  const isOwnChannel = session?.user?.id === channelData.user_id._id;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
        <Image
          src={channelData.cover_image || "/placeholder-cover.jpg"}
          alt={`${channelData.name} cover`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Channel Info Section */}
      <div className="relative -mt-20 px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-32 w-32 ring-4 ring-[#1a2942] bg-[#1a2942]">
            <AvatarImage src={channelData.avatar} alt={channelData.name} />
            <AvatarFallback className="text-4xl">
              {channelData.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{channelData.name}</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {channelData.subscribers?.toLocaleString() || 0} seguidores
              </span>
              {channelData.category && (
                <span className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  {channelData.category}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            {isOwnChannel && (
              <Link href={`/upload?channelId=${channelData._id}`}>
                <Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Novo Post
                </Button>
              </Link>
            )}
            <SubscribeButton 
              channelId={channelData._id} 
              isOwnChannel={isOwnChannel}
            />
          </div>
        </div>

        {channelData.description && (
          <p className="text-gray-300 mt-6 max-w-3xl">{channelData.description}</p>
        )}
      </div>

      {/* Videos Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Vídeos</h2>
        </div>
        
        {channelData.videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channelData.videos.map((video: Video) => (
              <Link href={`/talents/${video._id}`} key={video._id}>
                <Card className="bg-[#1a2942] border-gray-800 hover:bg-[#243555] transition">
                  <CardContent className="p-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                      <iframe
                        width="100%"
                        height="100%"
                        src={getYouTubeEmbedUrl(video.video_url)}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {video.views?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {video.likes?.toLocaleString() || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            Nenhum vídeo foi enviado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
