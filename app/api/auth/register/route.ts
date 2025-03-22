import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { name, email, password, accountType } = await request.json()

    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 },
      )
    }

    if (!data.user) {
      return NextResponse.json(
        {
          success: false,
          error: "User creation failed",
        },
        { status: 500 },
      )
    }

    // Create user profile
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: data.user.id,
        email,
        name,
        account_type: accountType,
        avatar: `/placeholder.svg?height=100&width=100&text=${name.substring(0, 2).toUpperCase()}`,
      },
    ])

    if (profileError) {
      return NextResponse.json(
        {
          success: false,
          error: profileError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Registration failed",
      },
      { status: 500 },
    )
  }
}

