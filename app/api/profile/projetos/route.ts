import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { Projeto } from "@/models";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    await connectDB();

    // For testing - check if userId is provided in URL
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');
    
    let userEmail: string | undefined;
    
    if (userIdParam) {
      // Testing mode - use the provided user identifier
      userEmail = userIdParam.includes('@') ? userIdParam : `${userIdParam}@gmail.com`;
    } else {
      // Normal mode - get from session
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
      userEmail = session.user.email;
    }
    
    // Find the user by email to get their _id
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Buscar projetos onde o usuário é líder ou criador (usando ObjectId)
    const projetos = await Projeto.find({
      $or: [
        { talento_lider_id: user._id },
        { criador_id: user._id }
      ]
    })
    .populate('talento_lider_id', 'name avatar email')
    .populate('criador_id', 'name avatar email account_type')
    .populate('sponsors', 'name avatar')
    .populate('portfolio_id', 'name')
    .sort({ criado_em: -1 });

    return NextResponse.json(projetos);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
