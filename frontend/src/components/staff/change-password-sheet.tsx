"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ChangePasswordSheet({
  trigger,
  onChange,
}: {
  trigger: React.ReactNode
  onChange: (newPassword: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [pwd, setPwd] = React.useState("")
  const [confirm, setConfirm] = React.useState("")

  function submit() {
    if (!pwd.trim() || pwd !== confirm) return
    onChange(pwd)
    setOpen(false)
    setPwd("")
    setConfirm("")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Change Password</SheetTitle>
        </SheetHeader>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="np-pass">New Password</Label>
            <Input id="np-pass" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="np-confirm">Confirm Password</Label>
            <Input id="np-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
        </div>
        <SheetFooter className="mt-6">
          <Button variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Update Password</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
