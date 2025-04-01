

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Channel from "@/models/Channel";
import User from "@/models/User";
import { Plus } from "lucide-react";

export default async function ChannelsPage() {
  await connectDB();
  
  const session = await getServerSession();
  let userChannels = [];
  let userData = null;

  if (session?.user?.email) {
    // Get user data
    userData = await User.findOne({ email: session.user.email });
    
    if (userData) {
      // Get user's channels
      userChannels = await Channel.find({ user_id: userData._id })
        .sort({ created_at: -1 });
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">My Channels</h1>
        <Link href="/channel/create">
          <Button className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create New Channel
          </Button>
        </Link>
      </div>

      {!session ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Sign in to Create Channels</h2>
          <p className="text-gray-400 mb-8">Join RiseMeUp to showcase your talents</p>
          <Link href="/auth/login">
            <Button className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">
              Sign In
            </Button>
          </Link>
        </div>
      ) : userChannels.length === 0 ? (
        <Card className="bg-[#1a2942] border-gray-800 text-white">
          <CardContent className="py-16 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Create Your First Channel</h2>
            <p className="text-gray-400 mb-8">Start sharing your talents with the world</p>
            <Link href="/channel/create">
              <Button className="bg-[#ff1493] hover:bg-[#ff1493]/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Channel
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userChannels.map((channel) => (
            <Card key={channel._id} className="bg-[#1a2942] border-gray-800 text-white">
              <CardContent className="p-6">
                <Link href={`/channels/${channel._id}`} className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={channel.avatar} />
                    <AvatarFallback>
                      {channel.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{channel.name}</h3>
                    <p className="text-gray-400">
                      {channel.subscribers?.toLocaleString()} subscribers
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

