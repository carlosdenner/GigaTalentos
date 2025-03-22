import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 401 },
      )
    }

    // Get user profile data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (userError) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch user data",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      user: userData,
      session: data.session,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Login failed",
      },
      { status: 500 },
    )
  }
}

