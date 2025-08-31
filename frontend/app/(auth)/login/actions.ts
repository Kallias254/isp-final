"use server"

import { redirect } from "next/navigation"

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
  if (password.length < 6) errors.password = "Password must be at least 6 characters."

  if (Object.keys(errors).length) {
    return { ok: false, fieldErrors: errors, message: "Please fix the errors and try again." }
  }

  // If you have a backend, set AUTH_API_URL and POST to it.
  const AUTH_API_URL = process.env.AUTH_API_URL
  try {
    if (AUTH_API_URL) {
      const res = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Forward cookies if needed; in App Router, cookies are managed server-side
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        return { ok: false, message: data?.message || "Invalid credentials." }
      }

      // On success, you may want to set cookies/headers here based on your backend response.
      // After successful auth, redirect to dashboard:
      redirect("/dashboard")
    } else {
      // Local fallback demo: accept anything that "looks valid"
      redirect("/dashboard")
    }
  } catch (_err: any) { // eslint-disable-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    return { ok: false, message: "Unable to sign in. Please try again." }
  }

  return { ok: true }
}
