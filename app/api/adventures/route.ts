import { type NextRequest, NextResponse } from "next/server"
import { UserProfileService } from "@/lib/services/user-profile.service"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const profile = await UserProfileService.createProfile(data)
    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error("Error creating profile:", error)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}
