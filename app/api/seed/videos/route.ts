import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";
import Channel from "@/models/Channel";
import Category from "@/models/Category";
import User from "@/models/User";

const sampleVideos = [
  {
    title: "Solução Tecnológica Inovadora",
    description: "Uma apresentação técnica brilhante mostrando habilidades de resolução de problemas e pensamento inovador",
    video_url: "https://www.youtube.com/watch?v=FDcRHfhWZvA",
    views: 125000,
    likes: 4500,
    category: "Habilidade Cognitiva & Técnica"
  },
  {
    title: "Demo de Conceito Criativo de Startup",
    description: "Demonstração de ideia de negócio original com abordagem inovadora para desafios de mercado",
    video_url: "https://www.youtube.com/watch?v=xvQoxkKIpbw",
    views: 98000,
    likes: 3200,
    category: "Criatividade & Inovação"
  },
  {
    title: "História da Jornada Empreendedora",
    description: "História pessoal de perseverança, determinação e esforço sustentado na construção de uma startup",
    video_url: "https://www.youtube.com/watch?v=5Ym1YA0F3S0",
    views: 89000,
    likes: 2800,
    category: "Motivação & Paixão"
  },
  {
    title: "Liderança de Equipe em Hackathon",
    description: "Demonstrando habilidades de liderança e trabalho em equipe colaborativo durante desafio intensivo de hackathon",
    video_url: "https://www.youtube.com/watch?v=Nt2xC8bm3mU",
    views: 75000,
    likes: 2100,
    category: "Liderança & Colaboração"
  },
  {
    title: "Pitch de Startup de Impacto Social",
    description: "Projeto de inovação ética focado no progresso social sustentável e impacto comunitário",
    video_url: "https://www.youtube.com/watch?v=8Uojy2vfawQ",
    views: 65000,
    likes: 1900,
    category: "Consciência Social & Integridade"
  },
  {
    title: "História de Pivot: Do Fracasso ao Sucesso",
    description: "Como se adaptar a contratempos e iterar com base no feedback levou à inovação revolucionária",
    video_url: "https://www.youtube.com/watch?v=R0dZDDl9zvM",
    views: 55000,
    likes: 1600,
    category: "Adaptabilidade & Resistência"
  }
];

export async function POST() {
  try {
    await connectDB();
    
    // Clear existing data
    await Video.deleteMany({});
    await Channel.deleteMany({});
    await User.deleteMany({});
    
    // Create sample user
    const sampleUser = await User.create({
      name: "Criador de Exemplo",
      email: "criador@exemplo.com",
      password: "hashedpassword123",
      account_type: "talent"
    });
    
    // Get categories
    const categories = await Category.find();
    
    // Create sample channels for each category
    const channels = [];
    for (const category of categories) {
      const channel = await Channel.create({
        name: `Canal ${category.name}`,
        description: `Apresentando os melhores talentos em ${category.name.toLowerCase()}`,
        subscribers: Math.floor(Math.random() * 50000) + 10000,
        avatar: `https://images.unsplash.com/200x200?text=${category.name}`,
        cover_image: `https://images.unsplash.com/1200x300?text=${category.name}+Canal`,
        category: category._id,
        user_id: sampleUser._id
      });
      channels.push(channel);
    }
    
    // Create sample videos
    const videos = [];
    for (const videoData of sampleVideos) {
      // Find corresponding channel
      const channel = channels.find(c => c.name.includes(videoData.category));
      
      if (channel) {
        const video = await Video.create({
          title: videoData.title,
          description: videoData.description,
          channel_id: channel._id,
          views: videoData.views,
          likes: videoData.likes,
          video_url: videoData.video_url,
          category: videoData.category
        });
        videos.push(video);
      }
    }
    
    return NextResponse.json({ 
      message: "Dados de exemplo inseridos com sucesso",
      user: sampleUser,
      channels: channels.length,
      videos: videos.length
    });
  } catch (error) {
    console.error("Erro ao inserir dados de exemplo:", error);
    return NextResponse.json(
      { error: "Falha ao inserir dados de exemplo" },
      { status: 500 }
    );
  }
}
