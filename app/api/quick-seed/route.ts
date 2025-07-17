import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, Projeto } from "@/models";
import mongoose from "mongoose";

export async function POST() {
  try {
    console.log('🔧 Quick seed: Fixing project leadership...');
    await connectDB();
    
    // Get all users by type
    const talentUsers = await User.find({ account_type: 'talent' }).limit(10);
    const mentorUsers = await User.find({ account_type: 'mentor' }).limit(5);
    const adminUser = await User.findOne({ account_type: 'admin' });
    
    console.log(`Found ${talentUsers.length} talents, ${mentorUsers.length} mentors, admin: ${!!adminUser}`);
    
    if (talentUsers.length === 0) {
      return NextResponse.json({
        status: 'error',
        message: 'No talent users found. Please run full seed first.'
      }, { status: 400 });
    }
    
    // Update any projects that have non-talent leaders
    const projectsWithBadLeaders = await Projeto.find({
      talento_lider_id: { $exists: true }
    }).populate('talento_lider_id', 'account_type');
    
    console.log(`Found ${projectsWithBadLeaders.length} projects to check...`);
    
    let fixedCount = 0;
    
    for (const projeto of projectsWithBadLeaders) {
      const leader = projeto.talento_lider_id as any;
      if (leader && leader.account_type !== 'talent') {
        // Replace with a random talent
        const randomTalent = talentUsers[Math.floor(Math.random() * talentUsers.length)];
        await Projeto.findByIdAndUpdate(projeto._id, {
          talento_lider_id: randomTalent._id,
          lideranca_status: 'ativo'
        });
        fixedCount++;
        console.log(`Fixed project ${projeto.nome} - assigned to talent ${randomTalent.name}`);
      }
    }
    
    // Create a few mentor projects looking for leaders
    const mentorProjectsToCreate = [
      {
        nome: "🔍 AI Ethics Research Platform",
        descricao: "A platform for researching and documenting AI ethics guidelines and best practices.",
        objetivo: "Create comprehensive AI ethics documentation",
        criador_id: mentorUsers[0]?._id,
        lideranca_status: 'buscando_lider',
        status: 'ativo',
        categoria: new mongoose.Types.ObjectId(),
        portfolio_id: new mongoose.Types.ObjectId(),
        tecnologias: ['Python', 'Research', 'Ethics'],
        avatar: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
        imagem_capa: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: "🌱 Sustainable Tech Initiative",
        descricao: "Developing technology solutions for environmental sustainability.",
        objetivo: "Build tech tools for environmental monitoring",
        criador_id: mentorUsers[1]?._id,
        lideranca_status: 'buscando_lider',
        status: 'ativo',
        categoria: new mongoose.Types.ObjectId(),
        portfolio_id: new mongoose.Types.ObjectId(),
        tecnologias: ['IoT', 'Sensors', 'Green Tech'],
        avatar: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
        imagem_capa: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
        solicitacao_lideranca: {
          candidato_id: talentUsers[2]._id,
          mensagem: "I have experience with IoT and sustainability projects. Would love to lead this initiative!",
          solicitado_em: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          status: 'pendente'
        },
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    // Only create if we have mentors
    let createdProjects = 0;
    if (mentorUsers.length > 0) {
      for (const projectData of mentorProjectsToCreate) {
        if (projectData.criador_id) {
          try {
            await Projeto.create(projectData);
            createdProjects++;
            console.log(`Created mentor project: ${projectData.nome}`);
          } catch (error) {
            console.log(`Project ${projectData.nome} might already exist, skipping...`);
          }
        }
      }
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Quick seed completed!',
      results: {
        projectsFixed: fixedCount,
        projectsCreated: createdProjects,
        talentsAvailable: talentUsers.length,
        mentorsAvailable: mentorUsers.length
      }
    });
    
  } catch (error: any) {
    console.error('Quick seed error:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}
