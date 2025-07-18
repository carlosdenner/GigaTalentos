import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";
import Projeto from "@/models/Projeto";
import Desafio from "@/models/Desafio";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    await connectDB();
    
    const searchTerm = query.trim();
    const searchRegex = new RegExp(searchTerm, "i");
    const suggestions: string[] = [];

    // Get quick suggestions from titles and names
    const [videos, projetos, desafios, users] = await Promise.all([
      Video.find({ title: searchRegex }).select('title').limit(3).lean(),
      Projeto.find({ nome: searchRegex }).select('nome').limit(3).lean(),
      Desafio.find({ title: searchRegex }).select('title').limit(3).lean(),
      User.find({ 
        name: searchRegex,
        account_type: { $in: ['talent', 'mentor'] }
      }).select('name').limit(2).lean()
    ]);

    // Add video titles
    videos.forEach((video: any) => {
      if (!suggestions.includes(video.title)) {
        suggestions.push(video.title);
      }
    });

    // Add project names
    projetos.forEach((projeto: any) => {
      if (!suggestions.includes(projeto.nome)) {
        suggestions.push(projeto.nome);
      }
    });

    // Add challenge titles
    desafios.forEach((desafio: any) => {
      if (!suggestions.includes(desafio.title)) {
        suggestions.push(desafio.title);
      }
    });

    // Add user names
    users.forEach((user: any) => {
      if (!suggestions.includes(user.name)) {
        suggestions.push(user.name);
      }
    });

    // Get technology suggestions from projects
    const techMatches = await Projeto.find({
      tecnologias: { $in: [searchRegex] }
    }).select('tecnologias').limit(5).lean();

    techMatches.forEach((projeto: any) => {
      projeto.tecnologias?.forEach((tech: string) => {
        if (tech.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !suggestions.includes(tech) && 
            suggestions.length < 10) {
          suggestions.push(tech);
        }
      });
    });

    return NextResponse.json({ 
      suggestions: suggestions.slice(0, 8) // Limit to 8 suggestions
    });

  } catch (error) {
    console.error("Suggestions error:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
