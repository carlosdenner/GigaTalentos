"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useUserType } from "@/hooks/useUserType"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function CreateChannelPage() {
  const { userType } = useUserType();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userType !== "talent") {
      toast({
        title: "Access Denied",
        description: "Only talent accounts can create channels",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        throw new Error("User not authenticated");
      }

      console.log("Session User ID:", session);

      // Check if user already has a channel
      const { data: existingChannel } = await supabase
        .from("channels")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

        console.log("Existing Channel:", existingChannel);

      if (existingChannel) {
        toast({
          title: "Channel Exists",
          description: "You already have a channel",
          variant: "destructive",
        });
        router.push(`/channel/${existingChannel.id}`);
        return;
      }

      // Create new channel
      const { data: channel, error } = await supabase
        .from("channels")
        .insert({
          name,
          description,
          category,
          avatar,
          user_id: session.user.id,
        })
        .select()
        .single();

        console.log("New Channel:", channel);

      if (error) throw error;
      console.log("Error:", error);

      toast({
        title: "Success!",
        description: "Your channel has been created.",
      });

      router.push(`/channel/${channel.id}`);
    } catch (error: any) {
      console.error("Error creating channel:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create channel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userType !== "talent") {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-gray-400">Only talent accounts can create channels.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Create Your Channel</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <Label htmlFor="name">Channel Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-[#1a2942] border-gray-700 text-white"
          />
        </div>
        <div>
          <Label htmlFor="description">Channel Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="bg-[#1a2942] border-gray-700 text-white"
          />
        </div>
        <div>
          <Label htmlFor="category">Channel Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="bg-[#1a2942] border-gray-700 text-white"
            placeholder="e.g., Music, Dance, Comedy"
          />
        </div>
        <div>
          <Label htmlFor="avatar">Avatar URL</Label>
          <Input
            id="avatar"
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="bg-[#1a2942] border-gray-700 text-white"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !name || !description || !category}
          className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Creating...
            </>
          ) : (
            "Create Channel"
          )}
        </Button>
      </form>
    </div>
  );
}