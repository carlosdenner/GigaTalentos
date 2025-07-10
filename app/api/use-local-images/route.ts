import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function POST(request: Request) {
  try {
    await connectDB();

    // Mapping of category names to local image paths
    const imageMapping = {
      'Habilidade Cognitiva & Técnica': '/categories/category-1.jpg',
      'Criatividade & Inovação': '/categories/category-2.jpg', 
      'Liderança & Colaboração': '/categories/category-3.jpg',
      'Resiliência & Adaptabilidade': '/categories/category-4.jpg',
      'Consciência Social & Ética': '/categories/category-5.jpg',
      'Comunicação & Persuasão': '/categories/category-6.jpg'
    };

    const updatePromises = Object.entries(imageMapping).map(([name, thumbnail]) =>
      Category.findOneAndUpdate(
        { name },
        { thumbnail },
        { new: true }
      )
    );

    const updatedCategories = await Promise.all(updatePromises);
    
    return Response.json({ 
      message: 'Categories updated with local images successfully',
      categories: updatedCategories.filter(cat => cat !== null)
    });

  } catch (error) {
    console.error('Error updating categories with local images:', error);
    return Response.json(
      { error: 'Failed to update categories with local images' },
      { status: 500 }
    );
  }
}
