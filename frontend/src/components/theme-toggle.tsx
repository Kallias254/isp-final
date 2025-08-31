"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

type Mode = "light" | "dark"

/**
 * Apply theme immediately to the <html> element as a resilient fallback,
 * and persist to localStorage so reloads pick it up even without a provider.
 */
function applyThemeToDocument(mode: Mode) {
  const root = document.documentElement
  // Avoid jarring transitions on toggle
  const body = document.body
  body.classList.add("[&_*]:!transition-none")
  root.classList.toggle("dark", mode === "dark")
  root.style.colorScheme = mode
  try {
    localStorage.setItem("theme", mode)
  } catch {}
  // Re-enable transitions on next frame
  requestAnimationFrame(() => {
    body.classList.remove("[&_*]:!transition-none")
  })
}

export function ThemeToggle({ className }: { className?: string }) {
  // If ThemeProvider is mounted, these will be populated.
  // If not, we'll still work via the fallback.
  const { resolvedTheme, setTheme, theme } = useTheme()

  const [mounted, setMounted] = React.useState(false)
  const [fallbackMode, setFallbackMode] = React.useState<Mode>("light")

  // On first mount, determine initial fallback from localStorage or media
  React.useEffect(() => {
    setMounted(true)
    // If next-themes isn't mounted, read persisted or media
    const persisted = (typeof window !== "undefined" && (localStorage.getItem("theme") as Mode | null)) || null
    if (persisted === "dark" || persisted === "light") {
      setFallbackMode(persisted)
      // Ensure document reflects the persisted value
      applyThemeToDocument(persisted)
    } else {
      // Respect system preference as a sensible default
      const prefersDark =
        typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      const initial: Mode = prefersDark ? "dark" : "light"
      setFallbackMode(initial)
      applyThemeToDocument(initial)
    }
  }, [])

  const isDark = mounted ? (resolvedTheme ?? theme ?? fallbackMode) === "dark" : false

  const toggle = () => {
    const next: Mode = isDark ? "light" : "dark"
    // Try next-themes first (if provider is mounted)
    try {
      setTheme?.(next)
    } catch {
      // ignore
    }
    // Always apply the resilient fallback to ensure immediate visual change
    applyThemeToDocument(next)
    setFallbackMode(next)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      onClick={toggle}
      className={className}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      {/* Render correct icon after mount to avoid hydration mismatch */}
      {mounted && isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
