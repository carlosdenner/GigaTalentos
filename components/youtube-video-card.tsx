"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Eye, ThumbsUp, ExternalLink, Clock } from "lucide-react"
import Image from "next/image"

interface YouTubeVideoProps {
  video: {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    youtube_id: string;
    youtube_views: number;
    youtube_likes: number;
    youtube_channel_title: string;
    duration: string;
    category: string;
    featured: boolean;
    tags: string[];
  };
  showEmbed?: boolean;
  onPlay?: () => void;
}

export default function YouTubeVideoCard({ video, showEmbed = false, onPlay }: YouTubeVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  };

  const getYouTubeUrl = (videoId: string) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if (onPlay) onPlay();
  };

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="bg-[#1a2942] border-gray-800 hover:border-[#10b981] transition-all duration-300 group overflow-hidden">
      {/* Video Thumbnail or Embed */}
      <div className="relative aspect-video bg-gray-900">
        {isPlaying && showEmbed ? (
          <iframe
            src={getYouTubeEmbedUrl(video.youtube_id)}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full cursor-pointer" onClick={handlePlay}>
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-red-600 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>

            {/* Featured Badge */}
            {video.featured && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-yellow-500 text-yellow-900 border-yellow-600">
                  ⭐ Destaque
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-white text-lg leading-tight group-hover:text-[#10b981] transition-colors line-clamp-2">
              {video.title}
            </CardTitle>
            <p className="text-gray-400 text-sm mt-1">
              {video.youtube_channel_title}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{formatNumber(video.youtube_views)} visualizações</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{formatNumber(video.youtube_likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{video.duration}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Description */}
        <div>
          <CardDescription className="text-gray-400 text-sm leading-relaxed">
            {showFullDescription 
              ? video.description 
              : truncateDescription(video.description)
            }
            {video.description.length > 150 && (
              <button 
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-[#10b981] hover:underline ml-1 text-sm"
              >
                {showFullDescription ? "Ver menos" : "Ver mais"}
              </button>
            )}
          </CardDescription>
        </div>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-gray-600 text-gray-400 bg-gray-800/50"
              >
                {tag}
              </Badge>
            ))}
            {video.tags.length > 3 && (
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400 bg-gray-800/50">
                +{video.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={handlePlay}
          >
            <Play className="mr-2 h-4 w-4" />
            {isPlaying ? "Assistindo" : "Assistir"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => window.open(getYouTubeUrl(video.youtube_id), '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Category */}
        <div className="text-xs text-gray-500 pt-1 border-t border-gray-800">
          Categoria: {video.category}
        </div>
      </CardContent>
    </Card>
  );
}
