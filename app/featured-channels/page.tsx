import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"

async function getChannels() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/channels`, { cache: "no-store" })

  if (!res.ok) {
    throw new Error("Failed to fetch channels")
  }

  return res.json()
}

export default async function FeaturedChannelsPage() {
  const channels = await getChannels()

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-white mb-8">Featured Channels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels?.map((channel: any) => (
          <Card key={channel.id} className="bg-[#1a2942] border-gray-800">
            <CardContent className="p-6">
              <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                <Image
                  src={channel.coverImage || "/placeholder.svg"}
                  alt={`${channel.name} cover`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
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
    </div>
  )
}

