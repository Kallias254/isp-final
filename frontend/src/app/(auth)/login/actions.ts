"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { PAYLOAD_API_URL } from "@/lib/api"

export type AuthActionState = {
  ok: boolean
  message?: string
  fieldErrors?: Record<string, string>
}

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email)
}

export async function loginAction(
  prevState: AuthActionState | undefined,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "").trim()
  const password = String(formData.get("password") || "")

  const errors: Record<string, string> = {}
  if (!validateEmail(email)) errors.email = "Enter a valid email."
  if (password.length < 1) errors.password = "Password cannot be empty."

  if (Object.keys(errors).length) {
    return { ok: false, fieldErrors: errors, message: "Please fix the errors and try again." }
  }

  try {
    const res = await fetch(`${PAYLOAD_API_URL}/api/staff/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      // Payload CMS often sends errors in an `errors` array
      const message = errorData.errors?.[0]?.message || "Invalid email or password."
      return { ok: false, message }
    }

    const data = await res.json()

    // Payload sends the token in a cookie, so we need to extract and set it.
    const resCookies = res.headers.get("set-cookie")
    if (resCookies) {
      // We'll just forward the cookie from the backend response to the browser.
      cookies().set("payload-token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
        path: "/",
      })
    } else {
      return { ok: false, message: "Login failed: No authentication token received." }
    }
  } catch (err) {
    console.error(err)
    return { ok: false, message: "An unexpected error occurred. Please try again." }
  }

  // On successful login, redirect to the dashboard.
  redirect("/dashboard")
}
