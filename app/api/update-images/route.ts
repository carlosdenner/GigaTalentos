import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

const categoryImages = [
  {
    name: "Habilidade Cognitiva & Técnica",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center&auto=format&q=80"
  },
  {
    name: "Criatividade & Inovação", 
    thumbnail: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop&crop=center&auto=format&q=80"
  },
  {
    name: "Liderança & Colaboração",
    thumbnail: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop&crop=center&auto=format&q=80"
  },
  {
    name: "Resiliência & Adaptabilidade",
    thumbnail: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=800&h=600&fit=crop&crop=center&auto=format&q=80"
  },
  {
    name: "Consciência Social & Ética",
    thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&crop=center&auto=format&q=80"
  },
  {
    name: "Comunicação & Persuasão",
    thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center&auto=format&q=80"
  }
];

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const updatePromises = categoryImages.map(async (categoryData) => {
      return await Category.findOneAndUpdate(
        { name: categoryData.name },
        { thumbnail: categoryData.thumbnail },
        { new: true }
      );
    });

    const updatedCategories = await Promise.all(updatePromises);
    
    return NextResponse.json({
      message: "Category images updated successfully",
      categories: updatedCategories.filter(Boolean)
    });
  } catch (error) {
    console.error("Error updating category images:", error);
    return NextResponse.json(
      { error: "Failed to update category images" },
      { status: 500 }
    );
  }
}
