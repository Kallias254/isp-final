import Image from "next/image"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type AuthShellProps = {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

/**
 * Two-column auth shell:
 * - Left: content
 * - Right: blueprint/hero image, hidden on small screens
 */
export function AuthShell({ title, subtitle, children, footer, className }: AuthShellProps) {
  return (
    <main className={cn("min-h-screen grid grid-cols-1 lg:grid-cols-2", className)}>
      {/* Left column */}
      <section className="relative flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="text-2xl font-semibold tracking-tight">{"Vantage ISP."}</div>
          </div>

          <header className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          </header>

          <div className="space-y-4">{children}</div>

          {footer ? <div className="mt-6 text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </section>

      {/* Right column illustration */}
      <section className="relative hidden lg:block">
        <div className="absolute inset-0">
          {/* Local image fills parent responsively [^1] */}
          <Image
            src="/images/auth-hero.png"
            alt="Abstract technical blueprint background"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            style={{ objectFit: "cover" }}
          />
          {/* Overlay gradient for depth and brand tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/60 via-blue-700/50 to-indigo-700/60 mix-blend-multiply" />
          {/* Soft vignette */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </section>
    </main>
  )
}
