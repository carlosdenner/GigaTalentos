"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Heart, SearchIcon } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState("videos")
  const [videos, setVideos] = useState([])
  const [channels, setChannels] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)

    try {
      // Search videos
      const { data: videosData } = await supabase
        .from("videos")
        .select("*, channels(*)")
        .ilike("title", `%${query}%`)
        .order("views", { ascending: false })
        .limit(20)

      // Search channels
      const { data: channelsData } = await supabase
        .from("channels")
        .select("*")
        .ilike("name", `%${query}%`)
        .order("subscribers", { ascending: false })
        .limit(20)

      setVideos(videosData || [])
      setChannels(channelsData || [])
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      handleSearch()
    }
  }, [activeTab])

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-white mb-8">Search</h1>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="bg-[#1a2942] border-gray-700 text-white pl-10 h-12"
            placeholder="Search for videos, channels, or creators..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button
          className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white h-12 px-6"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {query && (
        <Tabs defaultValue="videos" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#1a2942]">
            <TabsTrigger value="videos" className="data-[state=active]:bg-[#ff1493] data-[state=active]:text-white">
              Videos
            </TabsTrigger>
            <TabsTrigger value="channels" className="data-[state=active]:bg-[#ff1493] data-[state=active]:text-white">
              Channels
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-6">
            {videos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No videos found matching "{query}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video: any) => (
                  <Link href={`/talents/${video.id}`} key={video.id} className="group">
                    <Card className="bg-[#1a2942] border-gray-800">
                      <CardContent className="p-4">
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                          <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/5zUyhX6Lp64"
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#ff1493]">
                          {video.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={video.channels?.avatar} alt={video.channels?.name} />
                            <AvatarFallback>{video.channels?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-[#9d4edd]">{video.channels?.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" /> {video.views.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" /> {video.likes.toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="channels" className="mt-6">
            {channels.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No channels found matching "{query}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {channels.map((channel: any) => (
                  <Card key={channel.id} className="bg-[#1a2942] border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={channel.avatar} alt={channel.name} />
                          <AvatarFallback>{channel.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{channel.name}</h3>
                          <p className="text-sm text-gray-400">{channel.category}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4 line-clamp-2">{channel.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">{channel.subscribers.toLocaleString()} subscribers</span>
                        <Link href={`/channels/${channel.id}`}>
                          <Button variant="outline">View Channel</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

