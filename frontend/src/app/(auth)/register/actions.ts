"use server"

import { redirect } from "next/navigation"
import type { AuthActionState } from "../login/actions"

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email)
}

export async function registerAction(prev: AuthActionState | undefined, formData: FormData): Promise<AuthActionState> {
  const name = String(formData.get("name") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const password = String(formData.get("password") || "")
  const confirm = String(formData.get("confirm") || "")

  const errors: Record<string, string> = {}
  if (name.length < 2) errors.name = "Please enter your full name."
  if (!validateEmail(email)) errors.email = "Enter a valid email."
  if (password.length < 6) errors.password = "Password must be at least 6 characters."
  if (confirm !== password) errors.confirm = "Passwords do not match."

  if (Object.keys(errors).length) {
    return { ok: false, fieldErrors: errors, message: "Please fix the errors and try again." }
  }

  const AUTH_API_URL = process.env.AUTH_API_URL
  try {
    if (AUTH_API_URL) {
      const res = await fetch(`${AUTH_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        cache: "no-store",
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        return { ok: false, message: data?.message || "Registration failed." }
      }
      // Some backends auto-login on register; if not, you might redirect to /login
      redirect("/dashboard")
    } else {
      // Local fallback demo
      redirect("/dashboard")
    }
  } catch (e) {
    return { ok: false, message: "Unable to create account. Please try again." }
  }

  return { ok: true }
}
