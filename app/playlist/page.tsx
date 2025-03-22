import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, SkipForward, SkipBack, Shuffle, Repeat } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import Link from "next/link"

async function getPlaylist() {
  // Get the current user's session
  const cookieStore = cookies()
  const supabaseToken = cookieStore.get("sb-access-token")?.value

  if (!supabaseToken) {
    // For anonymous users, return a sample playlist
    const { data: videos, error } = await supabase
      .from("videos")
      .select(`*, channels(*)`)
      .order("views", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching sample videos:", error)
      return { name: "Popular Videos", videos: [] }
    }

    return { name: "Popular Videos", videos }
  }

  // Get the user's ID from the session
  const {
    data: { user },
  } = await supabase.auth.getUser(supabaseToken)

  if (!user) {
    return { name: "Popular Videos", videos: [] }
  }

  // Get the user's first playlist
  const { data: playlists, error: playlistError } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)

  if (playlistError || !playlists || playlists.length === 0) {
    return { name: "Your Playlist", videos: [] }
  }

  // Get the playlist videos
  const { data: playlistVideos, error: videosError } = await supabase
    .from("playlist_videos")
    .select(`
      *,
      videos (*, channels(*))
    `)
    .eq("playlist_id", playlists[0].id)

  if (videosError) {
    return { ...playlists[0], videos: [] }
  }

  return { ...playlists[0], videos: playlistVideos.map((pv) => pv.videos) }
}

export default async function PlaylistPage() {
  const playlist = await getPlaylist()
  const cookieStore = cookies()
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
        <h1 className="text-4xl font-bold text-white">{isLoggedIn ? playlist.name : "Popular Videos"}</h1>
        {!isLoggedIn && (
          <Link href="/auth/login">
            <Button className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">Login to Create Playlists</Button>
          </Link>
        )}
      </div>

      <Card className="bg-[#1a2942] border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">{playlist.name}</h2>
              <p className="text-gray-400">
                {playlist.videos?.length || 0} videos • {formatDuration(totalDuration)}
              </p>
            </div>
            <Button className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">Play All</Button>
          </div>

          {playlist.videos?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">
                {isLoggedIn ? "Your playlist is empty. Add some videos!" : "Login to create and manage your playlists."}
              </p>
              <Link href="/categories">
                <Button variant="outline">Browse Videos</Button>
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
                      <p className="text-gray-400 text-sm">{item.channels?.name || "Unknown Artist"}</p>
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
        <Button className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white" size="icon">
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

