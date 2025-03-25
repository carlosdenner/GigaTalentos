"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function FeaturedChannels() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    async function fetchChannels() {
      const response = await fetch('/api/channels/featured');
      const data = await response.json();
      setChannels(data);
    }

    fetchChannels();
  }, []);

  return (
    <div className="space-y-4">
      {channels?.map((channel: any) => (
        <Link
          key={channel._id}
          href={`/channels/${channel._id}`}
          className="flex items-center gap-3 text-gray-300 hover:text-white py-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={channel.avatar} alt={channel.name} />
            <AvatarFallback>
              {channel.name.split(" ").map((n: string) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium">{channel.name}</span>
            <p className="text-sm text-gray-400">{channel.subscribers} subscribers</p>
          </div>
        </Link>
      ))}
    </div>
  );
}