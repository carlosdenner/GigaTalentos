import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Heart, Eye } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { getYouTubeEmbedUrl } from "@/utils"

async function getFavorites() {
  // Get the current user's session
  const cookieStore = cookies()
  const supabaseToken = cookieStore.get("sb-access-token")?.value

  if (!supabaseToken) {
    // For anonymous users, return sample favorites
    const { data: sampleVideos, error } = await supabase
      .from("videos")
      .select(`*, channels(*)`)
      .order("views", { ascending: false })
      .limit(6)

    if (error) {
      console.error("Error fetching sample videos:", error)
      return []
    }

    return sampleVideos
  }

  // Get the user's ID from the session
  const {
    data: { user },
  } = await supabase.auth.getUser(supabaseToken)

  if (!user) {
    return []
  }

  // Get the user's favorites
  const { data, error } = await supabase
    .from("favorites")
    .select(`
      *,
      videos (*, channels(*))
    `)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching favorites:", error)
    return []
  }

  return data.map((fav) => fav.videos)
}

export default async function FavoritesPage() {
  const favorites = await getFavorites()
  const cookieStore = cookies()
  const isLoggedIn = !!cookieStore.get("sb-access-token")?.value

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">{isLoggedIn ? "Your Favorites" : "Popular Videos"}</h1>
        {!isLoggedIn && (
          <Link href="/auth/login">
            <Button className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">Login to Save Favorites</Button>
          </Link>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">
            {isLoggedIn ? "You haven't added any favorites yet." : "Browse and discover amazing talents."}
          </p>
          <Link href="/categories">
            <Button className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">Explore Categories</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite: any) => (
            <Card key={favorite.id} className="bg-[#1a2942] border-gray-800">
              <CardContent className="p-4">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYouTubeEmbedUrl(favorite.video_url)}
                    title={favorite.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  {isLoggedIn && (
                    <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2">
                      <Heart className="h-5 w-5 text-[#ff1493]" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">{favorite.title}</h2>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" /> {favorite.views?.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" /> {favorite.likes?.toLocaleString()}
                  </span>
                </div>
                <Link href={`/talents/${favorite.id}`}>
                  <Button className="w-full mt-4 bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">Watch Now</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

