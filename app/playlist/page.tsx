import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, SkipForward, SkipBack, Shuffle, Repeat } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import Link from "next/link"

async function getPlaylist() {
  try {
    // For now, return sample videos from our MongoDB API
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/videos?featured=true&limit=10`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    
    const videos = await response.json();
    return { name: "Popular Videos", videos };
  } catch (error) {
    console.error("Error fetching sample videos:", error);
    return { name: "Popular Videos", videos: [] };
  }
}

export default async function PlaylistPage() {
  const playlist = await getPlaylist()
  const cookieStore = await cookies()
  const isLoggedIn = !!cookieStore.get("sb-access-token")?.value

  // Calculate total duration
  const totalDuration =
    playlist.videos?.reduce((total: number, video: any) => {
      if (!video.duration) return total
      const [minutes, seconds] = video.duration.split(":").map(Number)
      return total + minutes * 60 + seconds
    }, 0) || 0

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">{isLoggedIn ? playlist.name : "Vídeos Populares"}</h1>
        {!isLoggedIn && (
          <Link href="/auth/login">
            <Button className="bg-[#10b981] hover:bg-[#10b981]/90 text-white">Entrar para Criar Playlists</Button>
          </Link>
        )}
      </div>

      <Card className="bg-[#1a2942] border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">{playlist.name}</h2>
              <p className="text-gray-400">
                {playlist.videos?.length || 0} vídeos • {formatDuration(totalDuration)}
              </p>
            </div>
            <Button className="bg-[#10b981] hover:bg-[#10b981]/90 text-white">Reproduzir Todos</Button>
          </div>

          {playlist.videos?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">
                {isLoggedIn ? "Sua playlist está vazia. Adicione alguns vídeos!" : "Entre para criar e gerenciar suas playlists."}
              </p>
              <Link href="/categories">
                <Button variant="outline">Navegar Vídeos</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {playlist.videos?.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center">
                    <span className="text-gray-400 w-8">{index + 1}</span>
                    <div className="ml-4">
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.channels?.name || "Artista Desconhecido"}</p>
                    </div>
                  </div>
                  <span className="text-gray-400">{item.duration}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" size="icon">
          <Shuffle className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button className="bg-[#10b981] hover:bg-[#10b981]/90 text-white" size="icon">
          <Play className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <SkipForward className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Repeat className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

