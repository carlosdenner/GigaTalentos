import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const initialCategories = [
  {
    name: "Habilidade Cognitiva & Técnica",
    description: "Habilidades excepcionais de resolução de problemas, competência técnica em STEM, solução de problemas e habilidades técnicas",
    thumbnail: "/placeholder.jpg",
  },
  {
    name: "Criatividade & Inovação", 
    description: "Pensamento criativo em soluções, capacidade de gerar ideias e soluções novas, buscar lacunas de formas originais",
    thumbnail: "/placeholder.jpg",
  },
  {
    name: "Motivação & Paixão",
    description: "Paixão intensa por empreendedorismo, motivação intrínseca para criar e inovar, dedicação a objetivos",
    thumbnail: "/placeholder.jpg",
  },
  {
    name: "Liderança & Colaboração",
    description: "Habilidades naturais de liderança, capacidade de trabalhar efetivamente em equipe, inspirar e motivar outros",
    thumbnail: "/placeholder.jpg",
  },
  {
    name: "Consciência Social & Integridade",
    description: "Consciência sobre questões sociais, integridade ética, compromisso com soluções que beneficiam a sociedade",
    thumbnail: "/placeholder.jpg",
  },
  {
    name: "Adaptabilidade & Resistência",
    description: "Capacidade de lidar com falhas, enfrentar desafios, se adaptar a mudanças e superar obstáculos",
    thumbnail: "/placeholder.jpg",
  }
];

async function seedCategories() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env.local');
    }

    await connectDB();
    
    // Clear existing categories
    await Category.deleteMany({});
    
    // Insert new categories
    await Category.insertMany(initialCategories);
    
    console.log('Categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();