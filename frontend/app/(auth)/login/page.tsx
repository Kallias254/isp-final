import Link from "next/link"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign In"
      subtitle="Welcome back! Please sign in to continue."
      footer={
        <div className="text-xs">
          {"By continuing you agree to the "}
          <Link href="/terms" className="underline underline-offset-4">
            Terms
          </Link>
          {" and "}
          <Link href="/privacy" className="underline underline-offset-4">
            Privacy Policy
          </Link>
          {"."}
        </div>
      }
    >
      <LoginForm />
    </AuthShell>
  )
}
