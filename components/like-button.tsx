"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LikeButton({ videoId, initialLikes = 0, initialLiked = false }) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const { data: session } = useSession();
  const router = useRouter();

  const handleLike = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch(`/api/videos/${videoId}/like`, {
        method: 'POST',
      });
      const data = await response.json();
      
      setLiked(data.liked);
      setLikes(prev => data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      className={`gap-2 ${liked ? 'text-[#ff1493]' : 'text-gray-400'}`}
    >
      <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
      <span>{likes}</span>
    </Button>
  );
}