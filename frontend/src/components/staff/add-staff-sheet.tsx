"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { StaffRole } from "./data"

export function AddStaffSheet({
  onCreate,
}: {
  onCreate: (payload: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    role: StaffRole
    password: string
    active: boolean
  }) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [first, setFirst] = React.useState("")
  const [last, setLast] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [role, setRole] = React.useState<StaffRole>("Support")
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [active, setActive] = React.useState(true)

  function submit() {
    if (!first.trim() || !last.trim() || !email.trim() || !password.trim() || password !== confirm) return
    onCreate({
      firstName: first.trim(),
      lastName: last.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      role,
      password,
      active,
    })
    setOpen(false)
    setFirst("")
    setLast("")
    setEmail("")
    setPhone("")
    setPassword("")
    setConfirm("")
    setRole("Support")
    setActive(true)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="whitespace-nowrap">+ Add Staff Member</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Staff Member</SheetTitle>
        </SheetHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="sf-first">First Name</Label>
              <Input id="sf-first" value={first} onChange={(e) => setFirst(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sf-last">Last Name</Label>
              <Input id="sf-last" value={last} onChange={(e) => setLast(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="sf-email">Email (Login ID)</Label>
            <Input id="sf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="sf-phone">Phone (Optional)</Label>
            <Input id="sf-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="grid gap-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as StaffRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
                <SelectItem value="Field">Field</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="sf-pass">Password</Label>
              <Input id="sf-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sf-confirm">Confirm Password</Label>
              <Input id="sf-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="grid">
              <span className="text-sm font-medium">Account Active</span>
              <span className="text-xs text-muted-foreground">Toggle to enable or disable the account</span>
            </div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Save Staff</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
