import { NextResponse } from "next/server"

// Starts the Google OAuth flow by redirecting to your backend.
// Set AUTH_GOOGLE_START_URL to your backend's "begin Google auth" URL.
// Example: https://api.yourdomain.com/auth/google/start
export async function GET() {
  const url = process.env.AUTH_GOOGLE_START_URL
  if (!url) {
    return NextResponse.json(
      {
        error:
          "AUTH_GOOGLE_START_URL is not configured. Set it to your backend OAuth start URL to enable Google Sign-In.",
      },
      { status: 500 },
    )
  }
  return NextResponse.redirect(url)
}
