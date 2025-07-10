const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gigatalentos';

const categoriesWithImages = [
  {
    name: "Habilidade Cognitiva & Técnica",
    thumbnail: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop&crop=faces"
  },
  {
    name: "Criatividade & Inovação", 
    thumbnail: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center"
  },
  {
    name: "Liderança & Colaboração",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center"
  },
  {
    name: "Resiliência & Adaptabilidade",
    thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop&crop=center"
  },
  {
    name: "Consciência Social & Ética",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop&crop=center"
  },
  {
    name: "Comunicação & Persuasão",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop&crop=center"
  }
];

async function updateCategories() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('categories');
    
    for (const category of categoriesWithImages) {
      await collection.updateOne(
        { name: category.name },
        { $set: { thumbnail: category.thumbnail } }
      );
      console.log(`Updated ${category.name} with image: ${category.thumbnail}`);
    }
    
    console.log('All categories updated successfully!');
  } catch (error) {
    console.error('Error updating categories:', error);
  } finally {
    await client.close();
  }
}

updateCategories();
