
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase"

export default async function ChannelsPage() {
  
  // Get current user and type
  const { data: { session } } = await supabase.auth.getSession();
  const { data: userData } = session ? await supabase
    .from('users')
    .select('account_type')
    .eq('id', session.user.id)
    .single() : { data: null };

  // Get user's channel if they are a talent
  const { data: userChannel } = userData?.account_type === 'talent' && session ? await supabase
    .from('channels')
    .select('*')
    .eq('user_id', session.user.id)
    .single() : { data: null };

  // Get popular channels
  const { data: popularChannels } = await supabase
    .from('channels')
    .select('*')
    .order('subscribers', { ascending: false })
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
            <Link href={`/channel/${userChannel.id}`} className="flex items-center gap-4">
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
          <Card key={channel.id} className="bg-[#1a2942] border-gray-800 text-white">
            <CardContent className="pt-6">
              <Link href={`/channel/${channel.id}`} className="flex items-center gap-4">
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

