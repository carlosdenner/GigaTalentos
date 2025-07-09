"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Heart } from "lucide-react";
import { getYouTubeEmbedUrl } from "@/utils";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const response = await fetch('/api/favorites');
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchFavorites();
    }
  }, [session]);

  if (loading) return <div className="text-white">Carregando...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Meus Favoritos</h1>
      
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((video: any) => (
            <Link href={`/talents/${video._id}`} key={video._id} className="group">
              <Card className="bg-[#1a2942] border-gray-800 hover:bg-[#243555] transition">
                <CardContent className="p-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                    <iframe
                      width="100%"
                      height="100%"
                      src={getYouTubeEmbedUrl(video.video_url)}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
                  <p className="text-gray-400">{video.channel_id?.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {video.views?.toLocaleString() || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {video.likes?.toLocaleString() || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12">
          Nenhum vídeo favorito ainda
        </div>
      )}
    </div>
  );
}

