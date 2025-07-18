"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserType } from "@/hooks/useUserType";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import Category from "@/models/Category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function CreateChannelForm() {
  const { userType } = useUserType();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [avatar, setAvatar] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [categories, setCategories] = useState([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!['talent', 'admin'].includes(userType || '')) {
      toast({
        title: "Access Denied",
        description: "Only talent and admin accounts can create channels",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create new channel - remove user_id from payload
      const channelResponse = await axios.post("/api/channels", {
        name,
        description,
        category,
        avatar,
        cover_image: coverImage,
      });

      toast({
        title: "Success!",
        description: "Your channel has been created.",
      });

      // If user came from project creation flow, redirect to project creation
      if (returnTo === 'project-create') {
        router.push('/projetos/create');
      } else {
        router.push(`/channels/${channelResponse.data._id}`);
      }
    } catch (error: any) {
      console.error("Error creating channel:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.error ||
          "Failed to create channel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    }

    loadCategories();
  }, []);

  if (!['talent', 'admin'].includes(userType || '')) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-gray-400">
          Only talent and admin accounts can create channels.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-white mb-8">
        Create Your Channel
      </h1>
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
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-[#1a2942] border-gray-700 text-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat: any) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <div>
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="bg-[#1a2942] border-gray-700 text-white"
            placeholder="https://example.com/cover.jpg"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !name || !description || !category}
          className="bg-[#10b981] hover:bg-[#10b981]/90 text-white"
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

export default function CreateChannelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateChannelForm />
    </Suspense>
  );
}
