import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Eye, Heart, Plus, Users, Tag, Video as LucideVideo, UserPlus, UserMinus } from "lucide-react";
import Link from "next/link";
import { getYouTubeEmbedUrl } from "@/utils";
import connectDB from "@/lib/mongodb";
import Channel from "@/models/Channel";
import VideoModel from "@/models/Video";
import ChannelPageClient from "@/components/channel-page-client";

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


async function getChannelData(id: string): Promise<ChannelWithVideos | null> {
  await connectDB();

  // Get channel data with populated user information
  const channel = await Channel.findById(id)
    .populate("user_id", "name avatar")
    .lean<Channel>();

  if (!channel) return null;

  // Get channel videos
  const videos = await VideoModel.find({ channel_id: id })
    .sort({ created_at: -1 })
    .lean<Video[]>();

  return {
    _id: channel._id.toString(),
    name: channel.name,
    avatar: channel.avatar,
    cover_image: channel.cover_image,
    description: channel.description,
    subscribers: channel.subscribers,
    category: channel.category,
    user_id: {
      _id: channel.user_id._id.toString(),
      name: channel.user_id.name,
      avatar: channel.user_id.avatar,
    },
    videos: videos.map(video => ({
      _id: video._id.toString(),
      title: video.title,
      video_url: video.video_url,
      views: video.views || 0,
      likes: video.likes || 0,
      channel_id: video.channel_id.toString(),
      created_at: new Date(video.created_at),
    })) || [],
  };
}

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const channelData: ChannelWithVideos | null = await getChannelData(id);

  if (!channelData) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Canal Não Encontrado</h2>
        <p className="text-gray-400">O canal que você está procurando não existe.</p>
      </div>
    );
  }

  return <ChannelPageClient channelData={channelData} />;
}