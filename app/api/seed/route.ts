import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { authOptions } from "../auth/[...nextauth]/route";

const initialCategories = [
  {
    name: "Cognitive & Technical Ability",
    description: "Above-average intellectual or domain-specific ability in STEM, problem-solving, and technical skills",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Creativity & Innovation",
    description: "Creative thinking, ability to generate novel ideas and solutions, pursuing tasks in original ways",
    thumbnail: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Motivation & Passion",
    description: "Intense intrinsic motivation, perseverance, grit, and sustained effort with enthusiasm for interests",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Leadership & Collaboration",
    description: "Leadership skills, ability to work in teams, take initiative, and guide projects effectively",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Social Consciousness & Integrity",
    description: "Empathy, ethics, strong moral principles, and drive to impact society positively through innovation",
    thumbnail: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Adaptability & Resilience",
    description: "Ability to adapt, bounce back from failure, cope with challenges, and iterate on setbacks",
    thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
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