import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Channel from "@/models/Channel";
import Subscription from "@/models/Subscription";

export async function GET() {
  try {
    await connectDB();
    
    // Fetch channels with populated user information
    const channels = await Channel.find()
      .populate('user_id', 'name avatar account_type portfolio')
      .sort({ subscribers: -1, verified: -1 })
      .limit(12) // Show more channels
      .exec();

    // Get real follower counts from Subscription collection
    const channelsWithRealFollowers = await Promise.all(
      channels.map(async (channel) => {
        const realFollowerCount = await Subscription.countDocuments({ 
          channel_id: channel._id 
        });
        
        // Update the channel's subscriber count if it's different
        if (channel.subscribers !== realFollowerCount) {
          await Channel.findByIdAndUpdate(channel._id, { 
            subscribers: realFollowerCount 
          });
        }
        
        return {
          ...channel.toObject(),
          subscribers: realFollowerCount
        };
      })
    );

    return NextResponse.json(channelsWithRealFollowers);
  } catch (error) {
    console.error('Error fetching featured channels:', error);
    return NextResponse.json(
      { error: "Failed to fetch featured channels" },
      { status: 500 }
    );
  }
}
