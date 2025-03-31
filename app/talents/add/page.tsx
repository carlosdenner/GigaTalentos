"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Link as LinkIcon } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getYouTubeEmbedUrl } from "@/utils"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

interface Category {
  _id: string;
  name: string;
}

// Create a wrapper component for the form content
function AddTalentForm() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("url")
  const channelId = searchParams?.get('channelId') || ""

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    channel_id: channelId || "", // Add channel_id to formData
  })

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      })
    }
  }

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!videoUrl && uploadMethod === "url") {
      toast({
        title: "Error",
        description: "Please provide a video URL",
        variant: "destructive"
      })
      return
    }

    if (!formData.channel_id) {
      toast({
        title: "Error",
        description: "Channel ID is required",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/talents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          video_url: videoUrl
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload talent')
      }

      toast({
        title: "Success",
        description: "Your talent has been uploaded successfully"
      })
      
      router.push('/talents')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload talent",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#0a192f] overflow-y-auto">
      <div className="container mx-auto px-4 py-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Add New Talent</h1>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto w-full pb-8">
          <Card className="bg-[#1a2942] border-gray-800 text-white mb-6">
            <CardHeader>
              <CardTitle>Video Upload</CardTitle>
              <CardDescription className="text-gray-400">Share your talent with the world</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="url" onValueChange={(value) => setUploadMethod(value as "file" | "url")}>
                <TabsList className="bg-[#0a192f] border-gray-700">
                  <TabsTrigger value="url" className="data-[state=active]:bg-[#1e90ff]">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Video URL
                  </TabsTrigger>
                  <TabsTrigger value="file" className="data-[state=active]:bg-[#1e90ff]">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="mt-4">
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
                    <div className="min-h-[300px] flex items-center justify-center bg-[#0a192f]/50 rounded-lg">
                      {previewUrl ? (
                        <div className="w-full aspect-video rounded-lg overflow-hidden">
                          <iframe
                            src={previewUrl}
                            title="Video preview"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div className="text-gray-400 text-center">
                          <p>Enter a YouTube URL to preview the video</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="file" className="mt-4">
                  <div className="min-h-[300px]">
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center h-full flex items-center justify-center ${
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
                        <Button type="button" className="bg-[#1e90ff] hover:bg-[#1e90ff]/90 text-white">
                          Select File
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a title for your talent"
                  className="bg-[#0a192f] border-gray-700"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your talent..."
                  className="bg-[#0a192f] border-gray-700 min-h-[120px]"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" value={formData.category} onValueChange={(value) => handleFormChange({ target: { name: 'category', value } } as any)}>
                  <SelectTrigger className="bg-[#0a192f] border-gray-700">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2942] border-gray-700 text-white">
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="Add tags separated by commas"
                  className="bg-[#0a192f] border-gray-700"
                  value={formData.tags}
                  onChange={handleFormChange}
                />
              </div> */}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">
          Upload Talent
        </Button>
      </form>
    </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function AddTalentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <AddTalentForm />
    </Suspense>
  )
}
