import { createClient } from "@supabase/supabase-js"

// Define types for our database tables
export type Channel = {
  id: string
  name: string
  description: string
  subscribers: number
  avatar: string
  cover_image: string
  category: string
  created_at: string
  updated_at: string
  user_id: string
}

export type Video = {
  id: string
  title: string
  description: string
  channel_id: string
  views: number
  likes: number
  thumbnail: string
  duration: string
  video_url: string
  created_at: string
  updated_at: string
}

export type Favorite = {
  id: string
  user_id: string
  video_id: string
  created_at: string
}

export type Playlist = {
  id: string
  name: string
  user_id: string
  created_at: string
  updated_at: string
}

export type PlaylistVideo = {
  id: string
  playlist_id: string
  video_id: string
  created_at: string
}

export type User = {
  id: string
  email: string
  name: string
  avatar: string
  account_type: string
  created_at: string
}

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://comqeoxjtpxautycwvuk.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvbXFlb3hqdHB4YXV0eWN3dnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMzQzNTgsImV4cCI6MjA1NzYxMDM1OH0.jIJW4qDFkcFyxCCfO64goypbJ2CMKIpNdVouTFciPJY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for common operations
export async function getChannels() {
  const { data, error } = await supabase.from("channels").select("*").order("subscribers", { ascending: false })

  if (error) {
    console.error("Error fetching channels:", error)
    return []
  }

  return data
}

export async function getChannel(id: string) {
  const { data, error } = await supabase.from("channels").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching channel:", error)
    return null
  }

  return data
}

export async function getChannelVideos(channelId: string) {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching channel videos:", error)
    return []
  }

  return data
}

export async function getVideo(id: string) {
  const { data, error } = await supabase
    .from("videos")
    .select(`
      *,
      channels (*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching video:", error)
    return null
  }

  return data
}

export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select(`
      *,
      videos (*)
    `)
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching favorites:", error)
    return []
  }

  return data.map((fav) => fav.videos)
}

export async function addFavorite(userId: string, videoId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .insert([{ user_id: userId, video_id: videoId }])
    .select()

  if (error) {
    console.error("Error adding favorite:", error)
    return null
  }

  return data[0]
}

export async function removeFavorite(userId: string, videoId: string) {
  const { error } = await supabase.from("favorites").delete().match({ user_id: userId, video_id: videoId })

  if (error) {
    console.error("Error removing favorite:", error)
    return false
  }

  return true
}

export async function getUserPlaylists(userId: string) {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching playlists:", error)
    return []
  }

  return data
}

export async function getPlaylist(id: string) {
  const { data, error } = await supabase.from("playlists").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching playlist:", error)
    return null
  }

  return data
}

export async function getPlaylistVideos(playlistId: string) {
  const { data, error } = await supabase
    .from("playlist_videos")
    .select(`
      *,
      videos (*)
    `)
    .eq("playlist_id", playlistId)

  if (error) {
    console.error("Error fetching playlist videos:", error)
    return []
  }

  return data.map((item) => item.videos)
}

export async function createPlaylist(userId: string, name: string) {
  const { data, error } = await supabase
    .from("playlists")
    .insert([{ user_id: userId, name }])
    .select()

  if (error) {
    console.error("Error creating playlist:", error)
    return null
  }

  return data[0]
}

export async function addVideoToPlaylist(playlistId: string, videoId: string) {
  const { data, error } = await supabase
    .from("playlist_videos")
    .insert([{ playlist_id: playlistId, video_id: videoId }])
    .select()

  if (error) {
    console.error("Error adding video to playlist:", error)
    return null
  }

  return data[0]
}

export async function removeVideoFromPlaylist(playlistId: string, videoId: string) {
  const { error } = await supabase
    .from("playlist_videos")
    .delete()
    .match({ playlist_id: playlistId, video_id: videoId })

  if (error) {
    console.error("Error removing video from playlist:", error)
    return false
  }

  return true
}

