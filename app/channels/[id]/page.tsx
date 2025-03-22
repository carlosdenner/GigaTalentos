import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Eye, Heart } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

async function getChannelData(id: string) {
  // Get channel data
  const { data: channel, error: channelError } = await supabase.from("channels").select("*").eq("id", id).single()

  if (channelError) {
    console.error("Error fetching channel:", channelError)
    return null
  }

  // Get channel videos
  const { data: videos, error: videosError } = await supabase
    .from("videos")
    .select("*")
    .eq("channel_id", id)
    .order("views", { ascending: false })

  if (videosError) {
    console.error("Error fetching videos:", videosError)
    return { ...channel, videos: [] }
  }

  return { ...channel, videos }
}

export default async function ChannelPage({ params }: { params: { id: string } }) {
  const channelData = await getChannelData(params.id)

  if (!channelData) {
    return <div className="text-white">Channel not found</div>
  }

  return (
    <div className="space-y-8">
      <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
        <Image
          src={channelData.cover_image || "/placeholder.svg?height=300&width=1200&text=" + channelData.name}
          alt={`${channelData.name} cover`}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={channelData.avatar} alt={channelData.name} />
          <AvatarFallback>
            {channelData.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-white">{channelData.name}</h1>
          <p className="text-gray-400">{channelData.subscribers?.toLocaleString()} subscribers</p>
        </div>
        <Button className="ml-auto bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">Subscribe</Button>
      </div>

      <p className="text-white">{channelData.description}</p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channelData.videos?.map((video: any) => (
          <Link href={`/talents/${video.id}`} key={video.id}>
            <Card className="bg-[#1a2942] border-gray-800">
              <CardContent className="p-4">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <iframe
                    width="100%"
                    height="100%"
                    src={video.video_url}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" /> {video.views?.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" /> {video.likes?.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

