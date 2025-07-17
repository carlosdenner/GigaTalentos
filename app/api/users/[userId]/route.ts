import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();
    
    const user = await User.findById(params.userId).select(
      'name avatar bio account_type email skills location experience portfolio verified'
    );
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
