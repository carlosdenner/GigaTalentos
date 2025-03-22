"use client"

import Link from "next/link"
import { Heart, ListMusic, Zap, LogIn, UserPlus, Users, Star, User, LogOut, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Sidebar() {
  const { user, signOut, isAuthenticated } = useAuth()
  const [channels, setChannels] = useState([])

  useEffect(() => {
    async function fetchChannels() {
      const { data } = await supabase.from("channels").select("*").order("subscribers", { ascending: false }).limit(3)

      if (data) {
        setChannels(data)
      }
    }

    fetchChannels()
  }, [])

  return (
    <div className="w-64 flex-shrink-0 bg-[#0a192f] text-white flex flex-col border-r border-gray-800 overflow-y-auto">
      <div className="p-4">
        <Link href="/" className="flex items-center">
          <span className="text-3xl font-bold">
            <span className="text-[#ff1493]">Rise</span>
            <span className="text-[#9d4edd]">Me</span>
            <span className="text-[#ff1493]">Up</span>
          </span>
        </Link>
        <div className="text-[#9d4edd] text-sm mt-1">Rise Your Potential</div>
      </div>

      <div className="mt-6 px-4">
        <Link href="/search">
          <Button variant="default" className="w-full bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">
            <Search className="h-4 w-4 mr-2" />
            Discover
          </Button>
        </Link>
      </div>

      <nav className="mt-6 flex flex-col gap-2 px-4">
        <Link href="/categories" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
          <Zap className="h-5 w-5 text-[#9d4edd]" />
          <span>Categories</span>
        </Link>
        <Link href="/channels" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
          <Users className="h-5 w-5 text-[#9d4edd]" />
          <span>Channels</span>
        </Link>
        <Link href="/favorites" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
          <Heart className="h-5 w-5 text-[#9d4edd]" />
          <span>{isAuthenticated ? "Your Favorites" : "Popular Videos"}</span>
        </Link>
        <Link href="/talents/add" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
          <Star className="h-5 w-5 text-[#9d4edd]" />
          <span>Add Talent</span>
        </Link>
      </nav>

      <div className="mt-8 px-4">
        <h3 className="text-[#9d4edd] mb-4">{isAuthenticated ? "Your Videos" : "Videos"}</h3>
        <nav className="flex flex-col gap-2">
          <Link href="/playlist" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
            <ListMusic className="h-5 w-5 text-gray-300" />
            <span>{isAuthenticated ? "Your Playlist" : "Popular Videos"}</span>
          </Link>
        </nav>
      </div>

      <div className="mt-8 px-4 flex-grow">
        <h3 className="text-[#9d4edd] mb-4">Featured Channels</h3>
        <div className="flex flex-col gap-3">
          {channels.map((channel: any) => (
            <Link
              key={channel.id}
              href={`/channels/${channel.id}`}
              className="flex items-center gap-3 text-gray-300 hover:text-white py-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={channel.avatar} alt={channel.name} />
                <AvatarFallback>
                  {channel.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span>{channel.name}</span>
            </Link>
          ))}
        </div>
        <Link href="/featured-channels" className="text-[#9d4edd] hover:underline text-sm block mt-2">
          View all featured channels
        </Link>
      </div>

      <div className="mt-auto p-4 space-y-2">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-3 text-gray-300 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span>{user?.name}</span>
            </div>
            <Button variant="outline" className="w-full border-[#9d4edd] text-[#9d4edd]" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full border-[#9d4edd] text-[#9d4edd]">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="w-full bg-[#9d4edd] hover:bg-[#9d4edd]/90 text-white">
                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>

      {isAuthenticated && (
        <div className="p-4 border-t border-gray-800">
          <Link href="/profile" className="flex items-center gap-3 text-gray-300 hover:text-white">
            <User className="h-5 w-5" />
            <span>Your Profile</span>
          </Link>
        </div>
      )}
    </div>
  )
}

