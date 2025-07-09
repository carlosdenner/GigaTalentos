import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";
import Channel from "@/models/Channel";
import Category from "@/models/Category";
import User from "@/models/User";

const sampleVideos = [
  {
    title: "Amazing Singing Performance",
    description: "A beautiful vocal performance showcasing African talent",
    video_url: "https://www.youtube.com/watch?v=FDcRHfhWZvA",
    views: 125000,
    likes: 4500,
    category: "Singing"
  },
  {
    title: "Traditional Dance Performance",
    description: "Cultural dance performance from Rwanda",
    video_url: "https://www.youtube.com/watch?v=xvQoxkKIpbw",
    views: 98000,
    likes: 3200,
    category: "Dancing"
  },
  {
    title: "Comedy Show Highlights",
    description: "Funny moments from local comedy show",
    video_url: "https://www.youtube.com/watch?v=5Ym1YA0F3S0",
    views: 89000,
    likes: 2800,
    category: "Comedy"
  },
  {
    title: "Music Production Tutorial",
    description: "Learn beat making with local producer",
    video_url: "https://www.youtube.com/watch?v=Nt2xC8bm3mU",
    views: 75000,
    likes: 2100,
    category: "Music Production"
  },
  {
    title: "Acting Workshop",
    description: "Behind the scenes of acting workshop",
    video_url: "https://www.youtube.com/watch?v=8Uojy2vfawQ",
    views: 65000,
    likes: 1900,
    category: "Acting"
  },
  {
    title: "Digital Art Creation",
    description: "Time-lapse of digital art creation process",
    video_url: "https://www.youtube.com/watch?v=R0dZDDl9zvM",
    views: 55000,
    likes: 1600,
    category: "Art"
  }
];

export async function POST() {
  try {
    await connectDB();
    
    // Clear existing data
    await Video.deleteMany({});
    await Channel.deleteMany({});
    await User.deleteMany({});
    
    // Create sample user
    const sampleUser = await User.create({
      name: "Sample Creator",
      email: "creator@example.com",
      password: "hashedpassword123",
      account_type: "talent"
    });
    
    // Get categories
    const categories = await Category.find();
    
    // Create sample channels for each category
    const channels = [];
    for (const category of categories) {
      const channel = await Channel.create({
        name: `${category.name} Channel`,
        description: `Showcasing the best ${category.name.toLowerCase()} talents`,
        subscribers: Math.floor(Math.random() * 50000) + 10000,
        avatar: `https://images.unsplash.com/200x200?text=${category.name}`,
        cover_image: `https://images.unsplash.com/1200x300?text=${category.name}+Channel`,
        category: category._id,
        user_id: sampleUser._id
      });
      channels.push(channel);
    }
    
    // Create sample videos
    const videos = [];
    for (const videoData of sampleVideos) {
      // Find corresponding channel
      const channel = channels.find(c => c.name.includes(videoData.category));
      
      if (channel) {
        const video = await Video.create({
          title: videoData.title,
          description: videoData.description,
          channel_id: channel._id,
          views: videoData.views,
          likes: videoData.likes,
          video_url: videoData.video_url,
          category: videoData.category
        });
        videos.push(video);
      }
    }
    
    return NextResponse.json({ 
      message: "Sample data seeded successfully",
      user: sampleUser,
      channels: channels.length,
      videos: videos.length
    });
  } catch (error) {
    console.error("Error seeding sample data:", error);
    return NextResponse.json(
      { error: "Failed to seed sample data" },
      { status: 500 }
    );
  }
}
