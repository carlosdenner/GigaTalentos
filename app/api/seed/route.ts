import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { authOptions } from "../auth/[...nextauth]/route";

const initialCategories = [
  {
    name: "Singing",
    description: "Vocal performances and singing talents",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dancing",
    description: "Dance performances and choreography",
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Comedy",
    description: "Stand-up comedy, sketches, and humorous performances",
    thumbnail: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Music Production",
    description: "Beat making, music composition, and production",
    thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Acting",
    description: "Dramatic performances and acting talents",
    thumbnail: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Art",
    description: "Visual arts, drawing, painting, and digital art",
    thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  }
];

export async function POST() {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.email) {
    //   return NextResponse.json(
    //     { error: "Not authorized to seed data" },
    //     { status: 401 }
    //   );
    // }

    await connectDB();
    
    // Clear existing categories
    await Category.deleteMany({});
    
    // Insert new categories
    const categories = await Category.insertMany(initialCategories);
    
    return NextResponse.json({ 
      message: "Categories seeded successfully",
      categories 
    });
  } catch (error) {
    console.error("Error seeding categories:", error);
    return NextResponse.json(
      { error: "Failed to seed categories" },
      { status: 500 }
    );
  }
}