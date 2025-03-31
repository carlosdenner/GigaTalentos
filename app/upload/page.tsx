"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Link as LinkIcon } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getYouTubeEmbedUrl } from "@/utils"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file")

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setVideoUrl(url)
    if (url) {
      const embedUrl = getYouTubeEmbedUrl(url)
      setPreviewUrl(embedUrl)
    } else {
      setPreviewUrl("")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a192f] p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Upload Your Talent</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Video Upload</CardTitle>
              <CardDescription className="text-gray-400">Share your talent with the world</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="file" className="mb-8" onValueChange={(value) => setUploadMethod(value as "file" | "url")}>
                <TabsList className="bg-[#0a192f] border-gray-700">
                  <TabsTrigger value="file" className="data-[state=active]:bg-[#1e90ff]">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </TabsTrigger>
                  <TabsTrigger value="url" className="data-[state=active]:bg-[#1e90ff]">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Video URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="file">
                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center ${
                      dragActive ? "border-[#ff1493] bg-[#ff1493]/10" : "border-gray-700"
                    }`}
                    onDragEnter={() => setDragActive(true)}
                    onDragLeave={() => setDragActive(false)}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragActive(true)
                    }}
                    onDrop={() => setDragActive(false)}
                  >
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Upload className="h-12 w-12 text-gray-400" />
                      <div className="space-y-2">
                        <h3 className="text-xl font-medium">Drag and drop your video file</h3>
                        <p className="text-gray-400">or click to browse files</p>
                      </div>
                      <Button className="bg-[#1e90ff] hover:bg-[#1e90ff]/90 text-white">
                        Select File
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="url">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">Video URL</Label>
                      <Input
                        id="videoUrl"
                        placeholder="Enter YouTube video URL"
                        className="bg-[#0a192f] border-gray-700"
                        value={videoUrl}
                        onChange={handleVideoUrlChange}
                      />
                    </div>
                    {previewUrl && (
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={previewUrl}
                          title="Video preview"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter a title for your video"
                    className="bg-[#0a192f] border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your talent..."
                    className="bg-[#0a192f] border-gray-700 min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger className="bg-[#0a192f] border-gray-700">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2942] border-gray-700 text-white">
                      <SelectItem value="singing">Singing</SelectItem>
                      <SelectItem value="dancing">Dancing</SelectItem>
                      <SelectItem value="comedy">Comedy</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Add tags separated by commas"
                    className="bg-[#0a192f] border-gray-700"
                  />
                </div>

                <div className="pt-4">
                  <Button className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white w-full">Upload Video</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-[#1a2942] border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Upload Guidelines</CardTitle>
              <CardDescription className="text-gray-400">Follow these rules for a successful upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Accepted Formats</h3>
                <p className="text-gray-400 text-sm">MP4, MOV, AVI (max 100MB)</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Content Policy</h3>
                <p className="text-gray-400 text-sm">
                  All content must be appropriate and follow our community guidelines
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Copyright</h3>
                <p className="text-gray-400 text-sm">Only upload content you own or have permission to use</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Processing Time</h3>
                <p className="text-gray-400 text-sm">Videos may take up to 30 minutes to process after upload</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2942] border-gray-800 text-white mt-6">
            <CardHeader>
              <CardTitle>Sponsor Connections</CardTitle>
              <CardDescription className="text-gray-400">Get discovered by sponsors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400 text-sm">
                By uploading your talent, you agree to be discoverable by verified sponsors on our platform.
              </p>

              <div className="bg-[#0a192f] p-4 rounded-lg">
                <h3 className="font-medium mb-1">Sponsor Verification</h3>
                <p className="text-gray-400 text-sm">All sponsors are verified to ensure legitimacy and safety</p>
              </div>

              <Button className="bg-[#1e90ff] hover:bg-[#1e90ff]/90 text-white w-full">
                Learn More About Sponsors
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

