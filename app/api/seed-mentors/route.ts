import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
  try {
    await connectDB();

    const mentorsData = [
      {
        name: "Dr. Roberto Silva",
        email: "roberto.silva@example.com",
        account_type: "mentor",
        bio: "Especialista em startups e inovação tecnológica",
        avatar: "/placeholder-user.jpg"
      },
      {
        name: "Profa. Ana Martinez",
        email: "ana.martinez@example.com", 
        account_type: "mentor",
        bio: "Mentora em design e UX/UI",
        avatar: "/placeholder-user.jpg"
      },
      {
        name: "Carlos Denner",
        email: "carlos.denner@example.com",
        account_type: "mentor", 
        bio: "Mentor em desenvolvimento de software e empreendedorismo",
        avatar: "/placeholder-user.jpg"
      },
      {
        name: "Marcia Oliveira",
        email: "marcia.oliveira@example.com",
        account_type: "mentor",
        bio: "Especialista em marketing digital e crescimento",
        avatar: "/placeholder-user.jpg"
      },
      {
        name: "Pedro Santos",
        email: "pedro.santos@example.com",
        account_type: "mentor",
        bio: "Mentor em finanças e investimentos para startups",
        avatar: "/placeholder-user.jpg"
      }
    ];

    const mentorsCreated = [];
    
    for (const mentorData of mentorsData) {
      // Check if mentor already exists
      const existingMentor = await User.findOne({ email: mentorData.email });
      
      if (!existingMentor) {
        const mentor = await User.create(mentorData);
        mentorsCreated.push(mentor);
      }
    }

    return NextResponse.json({
      message: `${mentorsCreated.length} mentores criados com sucesso!`,
      mentors: mentorsCreated.map(m => ({
        _id: m._id,
        name: m.name,
        email: m.email,
        account_type: m.account_type
      }))
    });

  } catch (error: any) {
    console.error('Erro ao criar mentores:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
