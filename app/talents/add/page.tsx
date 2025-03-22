"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUserType } from "@/hooks/useUserType";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getYouTubeEmbedUrl } from "@/utils";
import { toast } from "@/components/ui/use-toast";

export default function AddTalentPage() {
  const { userType } = useUserType();
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
    setMounted(true);
    
    const checkUserChannel = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push('/login');
          return;
        }

        const { data: channel } = await supabase
          .from("channels")
          .select("id")
          .eq("user_id", session.user.id)
          .single();

        if (!channel) {
          toast({
            title: "Channel Required",
            description: "You need to create a channel first",
            variant: "destructive",
          });
          router.push("/channel/create");
        } else {
          setHasChannel(true);
        }
      } catch (error) {
        console.error("Error checking channel:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted && userType === 'talent') {
      checkUserChannel();
    } else if (mounted) {
      setIsLoading(false);
    }
  }, [userType, router, mounted]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    // Return an empty div with the same structure to avoid layout shifts
    return <div className="container mx-auto py-8"></div>;
  }

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    setPreviewUrl(getYouTubeEmbedUrl(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userType !== "talent") {
      toast({
        title: "Access Denied",
        description: "Only talent accounts can upload performances",
        variant: "destructive",
      });
      return;
    }

    if (!videoUrl) {
      toast({
        title: "Missing Video",
        description: "Please provide a YouTube video URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        throw new Error("User not authenticated");
      }

      // Get channel ID
      const { data: channel } = await supabase
        .from("channels")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      let channelId = channel?.id;

      if (!channelId) {
        const { data: newChannel, error: channelError } = await supabase
          .from("channels")
          .insert({
            user_id: session.user.id,
            name: session.user.email?.split("@")[0] || "Anonymous",
          })
          .select()
          .single();

        if (channelError) throw channelError;
        channelId = newChannel.id;
      }

      // Save talent to database
      const { data, error } = await supabase
        .from("videos")
        .insert({
          title,
          description,
          video_url: videoUrl,
          category_id: category,
          channel_id: channelId,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your talent has been uploaded successfully.",
      });

      router.push(`/talents/${data.id}`);
    } catch (error: any) {
      console.error("Error saving talent:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to save talent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-16">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (userType !== "talent") {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">Only talent accounts can upload performances.</p>
        </div>
      </div>
    );
  }

  if (!hasChannel) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Channel Required</h2>
          <p className="text-gray-400 mb-4">You need to create a channel before uploading videos.</p>
          <Button onClick={() => router.push("/channel/create")}>
            Create Channel
          </Button>
        </div>
      </div>
    );
  }

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