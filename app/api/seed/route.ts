import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { authOptions } from "../auth/[...nextauth]/route";

const initialCategories = [
  {
    name: "Habilidade Cognitiva & Técnica",
    description: "Capacidade de resolver problemas complexos, pensamento analítico e competências técnicas específicas necessárias para desenvolvimento de soluções inovadoras.",
    thumbnail: "/placeholder.jpg",
  },
  {
    name: "Criatividade & Inovação",
    description: "Capacidade de gerar ideias originais e implementar soluções inovadoras para desafios existentes, transformando conceitos em realidade.",
    thumbnail: "/placeholder.jpg",
  },
  {
    name: "Liderança & Colaboração",
    description: "Habilidade de inspirar equipes, facilitar colaboração efetiva e dirigir projetos multidisciplinares para o sucesso.",
    thumbnail: "/placeholder.jpg",
  },
  {
    name: "Resiliência & Adaptabilidade",
    description: "Capacidade de superar obstáculos, aprender com falhas e adaptar-se rapidamente a mudanças do mercado e tecnologia.",
    thumbnail: "/placeholder.jpg",
  },
  {
    name: "Consciência Social & Ética",
    description: "Compreensão do impacto social, responsabilidade ética e compromisso com desenvolvimento sustentável e inclusivo.",
    thumbnail: "/placeholder.jpg",
  },
  {
    name: "Comunicação & Persuasão",
    description: "Habilidade de comunicar ideias complexas de forma clara e influenciar stakeholders para ação e mudança positiva.",
    thumbnail: "/placeholder.jpg",
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
      message: "Categorias criadas com sucesso",
      categories 
    });
  } catch (error) {
    console.error("Erro ao criar categorias:", error);
    return NextResponse.json(
      { error: "Falha ao criar categorias" },
      { status: 500 }
    );
  }
}