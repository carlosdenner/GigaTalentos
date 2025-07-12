import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Eye, Heart, Plus, Users, Tag, Video as LucideVideo } from "lucide-react";
import Link from "next/link";
import { getYouTubeEmbedUrl } from "@/utils";
import connectDB from "@/lib/mongodb";
import Channel from "@/models/Channel";
import VideoModel from "@/models/Video";

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
        <h2 className="text-2xl font-bold text-white mb-4">Channel Not Found</h2>
        <p className="text-gray-400">The channel you're looking for doesn't exist.</p>
      </div>
    );
  }

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
                {channelData.subscribers?.toLocaleString() || 0} subscribers
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
            <Link href={`/talents/add?channelId=${channelData._id}`}>
              <Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Talent
              </Button>
            </Link>
            <Button className="bg-[#10b981] hover:bg-[#10b981]/90 text-white px-8">
              Subscribe
            </Button>
          </div>
        </div>

        {channelData.description && (
          <p className="text-gray-300 mt-6 max-w-3xl">{channelData.description}</p>
        )}
      </div>

      {/* Videos Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Videos</h2>
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
            No videos uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}