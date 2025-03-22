import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Users } from "lucide-react"
import { supabase } from "@/lib/supabase"

async function getChannels() {
  const { data: channels, error } = await supabase
    .from("channels")
    .select("*")
    .order("subscribers", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching channels:", error)
    return []
  }

  return channels
}

export default async function ChannelsPage() {
  const channels = await getChannels()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Popular Channels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel) => (
          <Card key={channel.id} className="bg-[#1a2942] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={channel.avatar} alt={channel.name} />
                  <AvatarFallback>
                    {channel.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold text-white">{channel.name}</h2>
                  <p className="text-[#9d4edd]">{channel.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {channel.subscribers.toLocaleString()} subscribers
                </span>
              </div>
              <Link href={`/channels/${channel.id}`}>
                <Button className="w-full bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">View Channel</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

