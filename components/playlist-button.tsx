"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ListPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function PlaylistButton({ videoId }: { videoId: string }) {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const fetchPlaylists = async () => {
    try {
      const response = await fetch('/api/playlists');
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const createPlaylist = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPlaylistName, videoId }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Playlist created and video added",
      });
      setNewPlaylistName("");
      fetchPlaylists();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create playlist",
        variant: "destructive",
      });
    }
  };

  const addToPlaylist = async (playlistId: string) => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Video added to playlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add video to playlist",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-gray-400 hover:text-white">
          <ListPlus className="h-6 w-6 mr-2" />
          <span>Add to Playlist</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a2942] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Add to Playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="bg-[#0a192f] border-gray-700 text-white"
            />
            <Button 
              onClick={createPlaylist}
              disabled={!newPlaylistName.trim()}
              className="bg-[#1e90ff]"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {playlists.map((playlist: any) => (
              <Button
                key={playlist._id}
                onClick={() => addToPlaylist(playlist._id)}
                variant="outline"
                className="w-full justify-start text-white"
              >
                {playlist.name}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}