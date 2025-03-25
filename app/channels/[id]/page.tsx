import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Eye, Heart } from "lucide-react";
import Link from "next/link";
import { getYouTubeEmbedUrl } from "@/utils";
import connectDB from "@/lib/mongodb";
import Channel from "@/models/Channel";
import Video from "@/models/Video";

async function getChannelData(id: string) {
  await connectDB();

  // Get channel data with populated user information
  const channel = await Channel.findById(id)
    .populate("user_id", "name avatar")
    .lean();

  if (!channel) return null;

  // Get channel videos
  const videos = await Video.find({ channel_id: id })
    .sort({ created_at: -1 })
    .lean();

  return {
    ...channel,
    videos: videos || [],
  };
}

export default async function ChannelPage({
  params,
}: {
  params: { id: string };
}) {
  const channelData = await getChannelData(params.id);

  if (!channelData) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Channel Not Found
        </h2>
        <p className="text-gray-400">
          The channel you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
        <Image
          src={channelData.cover_image || "/placeholder.jpg"}
          alt={`${channelData.name} cover`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={channelData.avatar} alt={channelData.name} />
          <AvatarFallback>
            {channelData.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-white">{channelData.name}</h1>
          <p className="text-gray-400">
            {channelData.subscribers?.toLocaleString() || 0} subscribers
          </p>
          {channelData.category && (
            <p className="text-gray-400 text-sm">{channelData.category}</p>
          )}
        </div>
        <Button className="ml-auto bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">
          Subscribe
        </Button>
      </div>

      {channelData.description && (
        <p className="text-gray-300">{channelData.description}</p>
      )}

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Videos</h2>
        {channelData.videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channelData.videos.map((video: any) => (
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
