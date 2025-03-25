"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getYouTubeEmbedUrl } from "@/utils";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddTalentPage() {
  const { data: session } = useSession() as { data: { user: { id: string } } | null };
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [hasChannel, setHasChannel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUserChannel() {
      try {
        if (!session?.user?.id) {
          router.push("/auth/login");
          return;
        }

        const response = await fetch(`/api/channels?userId=${session.user.id}`);
        const data = await response.json();
        setHasChannel(!!data.length);
      } catch (error) {
        console.error("Error checking channel:", error);
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    }

    checkUserChannel();
  }, [session, router]);

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);

    if (url && mounted) {
      setTimeout(() => {
        const embedUrl = getYouTubeEmbedUrl(url);
        setPreviewUrl(embedUrl);
      }, 100);
    } else {
      setPreviewUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!session?.user?.id) {
        router.push("/auth/login");
        return;
      }

      // Get user's channel
      const channelResponse = await fetch(
        `/api/channels?userId=${session.user.id}`
      );
      const channelData = await channelResponse.json();

      if (!channelData.length) {
        toast({
          title: "Channel Required",
          description: "Please create a channel before adding talents",
          variant: "destructive",
        });
        router.push("/channel/create");
        return;
      }

      // Add video
      const response = await fetch("/api/talents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          channel_id: channelData[0]._id,
          video_url: videoUrl,
          category,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast({
        title: "Success!",
        description: "Your talent has been added successfully",
      });

      router.push(`/talents/${data._id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add talent",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || isLoading) {
    return <div>Loading...</div>;
  }

  if (!hasChannel) {
    router.push("/channel/create");
    return null;
  }

  // Modify the iframe rendering to avoid hydration issues
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Add Your Talent</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setTitle(e.target.value)
            }
            required
            className="bg-[#1a2942] border-gray-700 text-white"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setDescription(e.target.value)
            }
            required
            className="bg-[#1a2942] border-gray-700 text-white"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-[#1a2942] border-gray-700 text-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="singing">Singing</SelectItem>
              <SelectItem value="dancing">Dancing</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="art">Art</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="video">YouTube Video URL</Label>
          <Input
            id="video"
            type="url"
            value={videoUrl}
            onChange={handleVideoUrlChange}
            placeholder="https://www.youtube.com/watch?v=..."
            required
            className="bg-[#1a2942] border-gray-700 text-white"
          />
        </div>

        {previewUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
            <iframe
              key={previewUrl} // Add key to force re-render
              width="100%"
              height="100%"
              src={previewUrl}
              title="Video Preview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <Button
          type="submit"
          disabled={
            isSubmitting || !videoUrl || !title || !description || !category
          }
          className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Submitting...
            </>
          ) : (
            "Submit Talent"
          )}
        </Button>
      </form>
    </div>
  );
}
