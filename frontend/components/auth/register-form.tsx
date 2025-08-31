"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerAction } from "@/app/(auth)/register/actions"
import type { AuthActionState } from "@/app/(auth)/login/actions"
import GoogleButton from "./google-button"

const initialState: AuthActionState = { ok: false }

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState)

  return (
    <form action={formAction} className="space-y-4" aria-describedby="register-error">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" placeholder="Jane Smith" />
        {state?.fieldErrors?.name ? (
          <p id="name-error" className="text-xs text-destructive">
            {state.fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        {state?.fieldErrors?.email ? (
          <p id="email-error" className="text-xs text-destructive">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" placeholder="••••••••" />
        {state?.fieldErrors?.password ? (
          <p id="password-error" className="text-xs text-destructive">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm password</Label>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" placeholder="••••••••" />
        {state?.fieldErrors?.confirm ? (
          <p id="confirm-error" className="text-xs text-destructive">
            {state.fieldErrors.confirm}
          </p>
        ) : null}
      </div>

      {state?.message ? (
        <div id="register-error" className="text-sm text-destructive">
          {state.message}
        </div>
      ) : null}

      <Button type="submit" className="w-full h-10" disabled={isPending}>
        {isPending ? "Creating account…" : "Create Account"}
      </Button>

      <GoogleButton label="Continue with Google" />

      <p className="text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  )
}
