import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Updated images with more reliable URLs and better category matching
    const imageUpdates = [
      {
        name: "Habilidade Cognitiva & Técnica",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&auto=format&q=80"
      },
      {
        name: "Criatividade & Inovação", 
        thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop&auto=format&q=80"
      },
      {
        name: "Liderança & Colaboração",
        thumbnail: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop&auto=format&q=80"
      },
      {
        name: "Resiliência & Adaptabilidade",
        thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format&q=80"
      },
      {
        name: "Consciência Social & Ética",
        thumbnail: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&h=600&fit=crop&auto=format&q=80"
      },
      {
        name: "Comunicação & Persuasão",
        thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&auto=format&q=80"
      }
    ];

    const updatedCategories = [];

    for (const update of imageUpdates) {
      const category = await Category.findOneAndUpdate(
        { name: update.name },
        { thumbnail: update.thumbnail },
        { new: true }
      );
      
      if (category) {
        updatedCategories.push(category);
      }
    }

    return NextResponse.json({
      message: "Category images fixed successfully",
      categories: updatedCategories
    });

  } catch (error) {
    console.error('Error fixing category images:', error);
    return NextResponse.json(
      { error: 'Failed to fix category images' },
      { status: 500 }
    );
  }
}
