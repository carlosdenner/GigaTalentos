
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Channel from "@/models/Channel";
import User from "@/models/User";

export default async function ChannelsPage() {
  await connectDB();
  
  // Get current user and type
  const session = await getServerSession();
  const userData = session ? await User.findById(session.user.id).select('account_type') : null;

  // Get user's channel if they are a talent
  const userChannel = userData?.account_type === 'talent' && session ? 
    await Channel.findOne({ user_id: session.user.id }) : null;

  // Get popular channels
  const popularChannels = await Channel.find()
    .sort({ subscribers: -1 })
    .limit(12);

  if (userData?.account_type === 'talent' && !userChannel) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Create Your Channel</h1>
        <p className="text-gray-400 mb-8">Start sharing your talents with the world</p>
        <Button asChild>
          <Link href="/channel/create">Create Channel</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {userData?.account_type === 'talent' && userChannel && (
        <Card className="bg-[#1a2942] border-gray-800 text-white mb-8">
          <CardHeader>
            <CardTitle>Your Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/channels/${userChannel._id}`} className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userChannel.avatar} />
                <AvatarFallback>{userChannel.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{userChannel.name}</h2>
                <p className="text-gray-400">{userChannel.subscribers?.toLocaleString()} subscribers</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      )}

      <h2 className="text-2xl font-bold text-white mb-6">Popular Channels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularChannels?.map((channel) => (
          <Card key={channel._id} className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="pt-6">
              <Link href={`/channels/${channel._id}`} className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={channel.avatar} />
                  <AvatarFallback>{channel.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{channel.name}</h3>
                  <p className="text-sm text-gray-400">
                    {channel.subscribers?.toLocaleString()} subscribers
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

