import { NextResponse } from "next/server"


export async function POST(request: Request) {
  try {

    const body = await request.json()
    const { email, password } = body


    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }


    if (email === "user@example.com" && password === "password") {

      return NextResponse.json(
        {
          message: "Login successful",
          user: {
            id: "123",
            name: "Demo User",
            email: "user@example.com",
          },
        },
        { status: 200 },
      )
    }

   
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

