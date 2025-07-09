import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Eye, Heart } from "lucide-react"
import { getYouTubeEmbedUrl } from "@/utils"

async function getFeaturedVideos() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/videos?featured=true`, { 
      cache: "no-store" 
    });
    
    if (!res.ok) {
      console.error("Failed to fetch featured videos:", res.status);
      return [];
    }
    
    const result = await res.json();
    return result.data ? result.data.slice(0, 6) : []; // Get data array from API response
  } catch (error) {
    console.error("Error fetching featured videos:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/categories`, { 
      cache: "no-store" 
    });
    
    if (!res.ok) {
      console.error("Failed to fetch categories:", res.status);
      return [];
    }
    
    const data = await res.json();
    console.log("Categories data type:", typeof data, "is array:", Array.isArray(data));
    return Array.isArray(data) ? data.slice(0, 3) : []; // Limit to 3 categories
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function Home() {
  const featuredVideos = await getFeaturedVideos()
  const categories = await getCategories()

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to Giga Talentos</h1>
        <p className="text-xl text-gray-400 mb-8">Discover Brazil's Rising Entrepreneurs</p>
        <Link href="/categories">
          <Button className="bg-[#10b981] hover:bg-[#10b981]/90 text-white text-lg px-8 py-4">Get Started</Button>
        </Link>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-white mb-6">Talent Identification Dimensions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category._id} className="bg-[#1a2942] border-gray-800">
              <CardContent className="p-6">
                <Zap className="h-8 w-8 text-[#3b82f6] mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-gray-400 mb-4">{category.description}</p>
                <Link href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}>
                  <Button variant="outline" className="w-full">
                    Explore {category.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-white mb-6">Featured Entrepreneurial Showcases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVideos.map((video: any) => (
            <Link href={`/talents/${video._id}`} key={video._id} className="group">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(video.video_url)}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-sm">
                  {video.duration || "N/A"}
                </div>
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
                <p className="text-[#1e90ff]">{video.channel_id?.name}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/categories">
            <Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white">Explore More Projects</Button>
          </Link>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to showcase your entrepreneurial talent?</h2>
        <p className="text-xl text-gray-400 mb-8">Join thousands of talented entrepreneurs across Brazil</p>
        <Link href="/talents/add">
          <Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white text-lg px-8 py-4">
            Submit Your Project
          </Button>
        </Link>
      </section>
    </div>
  )
}

