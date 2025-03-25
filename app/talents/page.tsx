"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Medal, Clock, Star } from "lucide-react"

// Type definitions for videos
interface Video {
  _id: string;
  title: string;
  description: string;
  video_url: string;
  featured?: boolean;
  created_at: string;
  channel_id: {
    name: string;
    category: string;
    avatar: string;
  };
}

// Format date to be more readable
function formatDate(dateString: string | number | Date) {
  const options = { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export default function TalentsPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Group videos by category
  const categorizedVideos = videos.reduce((acc, video) => {
    const category = video.channel_id?.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(video);
    return acc;
  }, {} as Record<string, Video[]>);

  useEffect(() => {
    let isMounted = true;

    async function fetchTalents() {
      try {
        const response = await fetch('/api/talents');
        
        if (!response.ok) {
          throw new Error('Failed to fetch talents');
        }

        const data = await response.json();
        
        if (isMounted) {
          setVideos(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          setLoading(false);
        }
      }
    }

    fetchTalents();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 text-white">
        Loading talents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 text-red-500">
        Error: {error}
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">My Talents</h1>
          <p className="text-gray-400 mt-2">Showcase of my abilities across different categories</p>
        </div>
        
        <Link href="/add-talent">
          <Button className="bg-[#ff1493] hover:bg-[#ff1493]/80 text-white">
            Add New Talent
          </Button>
        </Link>
      </div>
      
      {Object.keys(categorizedVideos).length > 0 ? (
        <div className="space-y-16">
          {Object.entries(categorizedVideos).map(([category, categoryVideos]) => (
            <div key={category} className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                <Medal className="text-[#ff1493]" size={20} />
                <h2 className="text-2xl font-semibold text-white">{category}</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryVideos.map((video) => (
                  <Card 
                    key={video._id} 
                    className="bg-[#1a2942] border-gray-800 hover:shadow-lg hover:shadow-[#ff1493]/10 transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative aspect-video bg-[#0a192f] overflow-hidden">
                      <Image
                        src={video.video_url ? `https://img.youtube.com/vi/${new URL(video.video_url).searchParams.get('v')}/0.jpg` : '/placeholder.jpg'}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a2942] to-transparent opacity-60"></div>
                      {video.featured && (
                        <div className="absolute top-2 right-2 bg-[#ff1493]/90 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Star className="mr-1" size={12} /> Featured
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium text-white mb-2">{video.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" /> {formatDate(video.created_at)}
                        </span>
                        <Link href={`/talents/${video._id}`}>
                          <Button size="sm" variant="outline" className="border-[#ff1493] text-[#ff1493] hover:bg-[#ff1493]/10">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {categoryVideos.length > 3 && (
                <div className="flex justify-end">
                  <Link href={`/categories/${category.toLowerCase()}`}>
                    <Button variant="ghost" className="text-[#ff1493] hover:text-[#ff1493] hover:bg-[#ff1493]/10">
                      View all in {category} →
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#1a2942] rounded-lg border border-gray-800">
          <Medal className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-medium text-white mb-2">No talents added yet</h3>
          <p className="text-gray-400 mb-6">Start showcasing your abilities by adding your first talent</p>
          <Link href="/add-talent">
            <Button className="bg-[#ff1493] hover:bg-[#ff1493]/80 text-white">
              Add Your First Talent
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}