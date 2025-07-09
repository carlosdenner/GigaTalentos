"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Heart, MessageSquare, Settings, Share2, Upload, UserPlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { getYouTubeEmbedUrl } from "@/utils"

interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  videosCount: number;
  followersCount: number;
  followingCount: number;
  bio?: string;
  channels?: string[]; // Add channels array
  email?: string; // Add email property
  skills?: string[]; // Add skills property
}

interface Video {
  _id: string;
  title: string;
  video_url: string;
  views: number;
  likes: number;
  created_at: string;
  channel_id: {
    _id: string;
    name: string;
  };
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileRes, videosRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/profile/videos') // New endpoint to fetch all videos from user's channels
        ]);
        
        const [profileData, videosData] = await Promise.all([
          profileRes.json(),
          videosRes.json()
        ]);

        setProfile(profileData);
        setVideos(videosData);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      loadProfile();
    }
  }, [session]);

  if (loading) {
    return <div className="flex min-h-screen bg-[#0a192f] items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  if (!profile) {
    return <div className="flex min-h-screen bg-[#0a192f] items-center justify-center">
      <div className="text-white">Profile not found</div>
    </div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a192f]">
      <div className="h-48 bg-gradient-to-r from-[#10b981] to-[#3b82f6] relative">
        <div className="absolute -bottom-16 left-8 flex items-end">
          <Avatar className="h-32 w-32 border-4 border-[#0a192f]">
            {/* <AvatarImage src={profile.avatar} alt={profile.name} /> */}
            <AvatarFallback>
                    {profile.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
          </Avatar>
          <div className="ml-4 mb-4">
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
            <p className="text-white/80">{profile.email}</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Link href="/profile/edit">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
          <Link href="/talents/add">
            <Button className="bg-[#10b981] hover:bg-[#10b981]/90 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-20 px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{profile.videosCount}</div>
              <div className="text-sm text-gray-400">Videos</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{profile.followersCount}</div>
              <div className="text-sm text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{profile.followingCount}</div>
              <div className="text-sm text-gray-400">Following</div>
            </div>
          </div>
          {/* Keep sponsor section hardcoded */}
          <div className="flex gap-2">
            <Button variant="outline" className="border-[#1e90ff] text-[#1e90ff]">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button className="bg-[#1e90ff] hover:bg-[#1e90ff]/90 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Follow
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-gray-300 max-w-2xl">
            Professional singer and songwriter based in Kigali. Passionate about discovering new talent and
            collaborating with artists across Africa.
          </p>
        </div>

        <Tabs defaultValue="videos" className="mt-8">
          <TabsList className="bg-[#1a2942]">
            <TabsTrigger value="videos" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
              Videos
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
              About
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
              Sponsors
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.length > 0 ? (
                videos.map((video) => (
                  <Link href={`/talents/${video._id}`} key={video._id} className="group">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                      <iframe
                        src={getYouTubeEmbedUrl(video.video_url)}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <Eye className="h-4 w-4 text-[#1e90ff]" />
                        <span className="text-white text-sm">{video.views?.toLocaleString()}</span>
                      </div>
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <Heart className="h-4 w-4 text-[#10b981]" />
                        <span className="text-white text-sm">{video.likes?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-white font-medium group-hover:text-[#1e90ff]">{video.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {video.channel_id.name} • {new Date(video.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-400">
                  No videos uploaded yet.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="mt-6">
            <Card className="bg-[#1a2942] border-gray-800 text-white">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Biography</h3>
                    <p className="text-gray-300">
                      {profile.bio || "No biography provided."}
                    </p>
                  </div>
  
                  {profile.skills && profile.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <span key={index} className="bg-[#0a192f] px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
  
                  {profile.email && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Contact</h3>
                      <p className="text-gray-300">For business inquiries: {profile.email}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sponsors" className="mt-6">
            <Card className="bg-[#1a2942] border-gray-800 text-white">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Current Sponsors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 bg-[#0a192f] p-4 rounded-lg">
                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🎵</span>
                        </div>
                        <div>
                          <h4 className="font-medium">AfriSound Studios</h4>
                          <p className="text-gray-400 text-sm">Music Production & Distribution</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 bg-[#0a192f] p-4 rounded-lg">
                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🎤</span>
                        </div>
                        <div>
                          <h4 className="font-medium">East Africa Talent</h4>
                          <p className="text-gray-400 text-sm">Talent Management Agency</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Looking For</h3>
                    <p className="text-gray-300 mb-4">
                      Currently seeking sponsorship opportunities in the following areas:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#0a192f] px-3 py-1 rounded-full text-sm">Tour Sponsorship</span>
                      <span className="bg-[#0a192f] px-3 py-1 rounded-full text-sm">Music Video Production</span>
                      <span className="bg-[#0a192f] px-3 py-1 rounded-full text-sm">Album Release</span>
                    </div>
                  </div>

                  <Button className="bg-[#10b981] hover:bg-[#10b981]/90 text-white w-full">
                    Contact for Sponsorship
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

