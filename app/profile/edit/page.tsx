"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    avatar: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      const response = await fetch("/api/profile");
      const data = await response.json();
      if (data) {
        setFormData({
          name: data.name || "",
          username: data.username || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
        });
      }
    }

    if (session) {
      fetchProfile();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      router.push("/profile");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={formData.avatar} alt={formData.name} />
            <AvatarFallback>
              {formData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" className="text-white">
            Change Photo
          </Button>
        </div>

        <div>
          <label className="text-white mb-2 block">Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-[#1a2942] border-gray-700 text-white"
          />
        </div>

        <div>
          <label className="text-white mb-2 block">Username</label>
          <Input
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="bg-[#1a2942] border-gray-700 text-white"
          />
        </div>

        <div>
          <label className="text-white mb-2 block">Bio</label>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="bg-[#1a2942] border-gray-700 text-white"
            rows={4}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white"
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            className="text-white"
            onClick={() => router.push("/profile")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
