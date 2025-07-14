import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Category } from '@/models';

// Define category codes for our entrepreneurship skills
const categoryCodeMapping = {
  'Cognição & Competência Técnica': 'COGTECH',
  'Criatividade & Inovação': 'CRIINOV', 
  'Liderança & Colaboração': 'LIDCOL',
  'Comunicação & Persuasão': 'COMPER',
  'Consciência Social & Ética': 'SOCETI',
  'Resiliência & Adaptabilidade': 'RESADA'
};

export async function POST() {
  try {
    await connectDB();

    const categories = await Category.find({});
    const updatedCategories = [];

    for (const category of categories) {
      const code = categoryCodeMapping[category.name as keyof typeof categoryCodeMapping];
      
      if (code) {
        // Update the category with the code
        category.code = code;
        await category.save();
        updatedCategories.push({
          name: category.name,
          code: category.code,
          id: category._id
        });
        console.log(`Updated category "${category.name}" with code "${code}"`);
      } else {
        console.log(`No code mapping found for category: "${category.name}"`);
      }
    }

    return NextResponse.json({
      message: 'Categories updated with codes successfully',
      updated: updatedCategories.length,
      categories: updatedCategories,
      codeMapping: categoryCodeMapping
    });

  } catch (error) {
    console.error('Error updating categories with codes:', error);
    return NextResponse.json(
      { error: `Error updating categories: ${error}` },
      { status: 500 }
    );
  }
}
