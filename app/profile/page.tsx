import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Heart, MessageSquare, Settings, Share2, Upload, UserPlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a192f]">
      <div className="h-48 bg-gradient-to-r from-[#1e90ff] to-[#ff1493] relative">
        <div className="absolute -bottom-16 left-8 flex items-end">
          <Avatar className="h-32 w-32 border-4 border-[#0a192f]">
            <AvatarImage src="/placeholder.svg?height=128&width=128" alt="User Profile" />
            <AvatarFallback className="text-3xl">KO</AvatarFallback>
          </Avatar>
          <div className="ml-4 mb-4">
            <h1 className="text-2xl font-bold text-white">King Oreste</h1>
            <p className="text-white/80">@king_oreste</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button variant="outline" className="bg-white/10 border-white/20 text-white">
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <div className="mt-20 px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-white">42</div>
              <div className="text-sm text-gray-400">Videos</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">15.3K</div>
              <div className="text-sm text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">128</div>
              <div className="text-sm text-gray-400">Following</div>
            </div>
          </div>
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
            <TabsTrigger value="videos" className="data-[state=active]:bg-[#ff1493] data-[state=active]:text-white">
              Videos
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-[#ff1493] data-[state=active]:text-white">
              About
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="data-[state=active]:bg-[#ff1493] data-[state=active]:text-white">
              Sponsors
            </TabsTrigger>
          </TabsList>
          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Link href={`/talents/${index + 1}`} key={index} className="group">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src="/placeholder.svg?height=200&width=350"
                      alt="Talent video thumbnail"
                      width={350}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-sm">
                      02:34
                    </div>
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <Eye className="h-4 w-4 text-[#1e90ff]" />
                      <span className="text-white text-sm">300</span>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <Heart className="h-4 w-4 text-[#ff1493]" />
                      <span className="text-white text-sm">400</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-white font-medium group-hover:text-[#1e90ff]">Mater - I raise my voice</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">May 25, 2021</p>
                      <div className="flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="about" className="mt-6">
            <Card className="bg-[#1a2942] border-gray-800 text-white">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Biography</h3>
                    <p className="text-gray-300">
                      King Oreste is a multi-talented artist from Rwanda with over 10 years of experience in the music
                      industry. He has performed at major festivals across East Africa and collaborated with top artists
                      in the region.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#0a192f] px-3 py-1 rounded-full text-sm">Singing</span>
                      <span className="bg-[#0a192f] px-3 py-1 rounded-full text-sm">Songwriting</span>
                      <span className="bg-[#0a192f] px-3 py-1 rounded-full text-sm">Piano</span>
                      <span className="bg-[#0a192f] px-3 py-1 rounded-full text-sm">Guitar</span>
                      <span className="bg-[#0a192f] px-3 py-1 rounded-full text-sm">Music Production</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Contact</h3>
                    <p className="text-gray-300">For business inquiries: contact@kingoreste.com</p>
                  </div>
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

                  <Button className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white w-full">
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

