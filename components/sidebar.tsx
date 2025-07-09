"use client"

import Link from "next/link"
import { Heart, ListMusic, Zap, LogIn, UserPlus, Users, Star, User, LogOut, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

export default function Sidebar() {
  const { user, signOut, isAuthenticated } = useAuth()
  const [channels, setChannels] = useState([])

  useEffect(() => {
    async function fetchChannels() {
      try {
        const response = await fetch('/api/channels/featured');
        const data = await response.json();
        setChannels(data || []);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    }

    fetchChannels()
  }, [])

  return (
    <aside className="w-64 bg-[#0a192f] border-r border-gray-800 h-screen sticky top-0 overflow-y-auto">
      <div className="w-64 flex-shrink-0 bg-[#0a192f] text-white flex flex-col border-r border-gray-800 overflow-y-auto">
        <div className="p-4">
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-bold">
              <span className="text-[#10b981]">Giga</span>
              <span className="text-[#3b82f6]">Talentos</span>
            </span>
          </Link>
          <div className="text-[#3b82f6] text-sm mt-1">Empreendedorismo & Talentos</div>
        </div>

        <div className="mt-6 px-4">
          <Link href="/search">
            <Button variant="default" className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-white">
              <Search className="h-4 w-4 mr-2" />
              Discover
            </Button>
          </Link>
        </div>

        <nav className="mt-6 flex flex-col gap-2 px-4">
          <Link href="/categories" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
            <Zap className="h-5 w-5 text-[#3b82f6]" />
            <span>Categories</span>
          </Link>
          <Link href="/channels" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
            <Users className="h-5 w-5 text-[#3b82f6]" />
            <span>Channels</span>
          </Link>
          <Link href="/favorites" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
            <Heart className="h-5 w-5 text-[#3b82f6]" />
            <span>{isAuthenticated ? "Your Favorites" : "Popular Videos"}</span>
          </Link>
        </nav>

        <div className="mt-8 px-4">
          <h3 className="text-[#3b82f6] mb-4">{isAuthenticated ? "Your Videos" : "Videos"}</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/playlist" className="flex items-center gap-3 text-gray-300 hover:text-white py-2">
              <ListMusic className="h-5 w-5 text-gray-300" />
              <span>{isAuthenticated ? "Your Playlist" : "Popular Videos"}</span>
            </Link>
          </nav>
        </div>

        <div className="mt-8 px-4 flex-grow">
          <h3 className="text-[#3b82f6] mb-4">Featured Channels</h3>
          <div className="flex flex-col gap-3">
            {channels.map((channel: any) => (
              <Link
                key={channel._id} // Changed from channel.id to channel._id
                href={`/channels/${channel._id}`} // Updated href to use _id
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
          <Link href="/featured-channels" className="text-[#3b82f6] hover:underline text-sm block mt-2">
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
              <Button variant="outline" className="w-full border-[#3b82f6] text-[#3b82f6]" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full border-[#3b82f6] text-[#3b82f6]">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white">
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
    </aside>
  )
}