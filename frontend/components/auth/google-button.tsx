"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GoogleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function GoogleButton({ children, className, ...props }: GoogleButtonProps) {
  const handleGoogleAuth = () => {
    window.location.href = "/api/auth/google"
  }

  return (
    <Button type="button" variant="outline" onClick={handleGoogleAuth} className={cn("w-full", className)} {...props}>
      {children}
    </Button>
  )
}
