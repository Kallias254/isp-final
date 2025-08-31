import Link from "next/link"
import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start your trial — no credit card required."
      footer={
        <div className="text-xs">
          {"By creating an account you agree to the "}
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
      <RegisterForm />
    </AuthShell>
  )
}
