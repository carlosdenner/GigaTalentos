const { MongoClient } = require('mongodb');

const categories = [
  {
    name: "Habilidade Cognitiva & Técnica",
    description: "Capacidade de processar informações complexas, resolver problemas técnicos e dominar habilidades específicas necessárias para inovação e empreendedorismo.",
    thumbnail: "/placeholder.jpg"
  },
  {
    name: "Criatividade & Inovação", 
    description: "Habilidade para gerar ideias originais, pensar fora da caixa e criar soluções inovadoras para desafios existentes no mercado.",
    thumbnail: "/placeholder.jpg"
  },
  {
    name: "Liderança & Colaboração",
    description: "Capacidade de inspirar e guiar equipes, comunicar visões efetivamente e trabalhar colaborativamente para alcançar objetivos comuns.",
    thumbnail: "/placeholder.jpg"
  },
  {
    name: "Resiliência & Adaptabilidade",
    description: "Capacidade de se recuperar de contratempos, aprender com falhas e se adaptar rapidamente a mudanças no ambiente de negócios.",
    thumbnail: "/placeholder.jpg"
  },
  {
    name: "Consciência Social & Ética",
    description: "Compreensão do impacto social dos negócios e compromisso com práticas éticas e sustentáveis no empreendedorismo.",
    thumbnail: "/placeholder.jpg"
  },
  {
    name: "Visão Estratégica & Execução",
    description: "Habilidade para desenvolver estratégias de longo prazo, identificar oportunidades de mercado e executar planos efetivamente.",
    thumbnail: "/placeholder.jpg"
  }
];

async function updateCategories() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gigatalentos';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('categories');
    
    // Clear existing categories
    await collection.deleteMany({});
    console.log('Cleared existing categories');
    
    // Insert new categories
    await collection.insertMany(categories);
    console.log('Inserted new categories with local image paths');
    
    console.log('Categories updated successfully!');
  } catch (error) {
    console.error('Error updating categories:', error);
  } finally {
    await client.close();
  }
}

updateCategories();
