"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Staff, StaffRole } from "./data"

export function EditStaffSheet({
  staff,
  onSave,
  trigger,
}: {
  staff: Staff
  onSave: (patch: Partial<Staff>) => void
  trigger: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [first, setFirst] = React.useState(staff.firstName)
  const [last, setLast] = React.useState(staff.lastName)
  const [email, setEmail] = React.useState(staff.email)
  const [phone, setPhone] = React.useState(staff.phone ?? "")
  const [role, setRole] = React.useState<StaffRole>(staff.role)
  const [active, setActive] = React.useState(staff.status === "Active")

  function submit() {
    onSave({
      firstName: first,
      lastName: last,
      email,
      phone,
      role,
      status: active ? "Active" : "Inactive",
    })
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Staff Member</SheetTitle>
        </SheetHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="ed-first">First Name</Label>
              <Input id="ed-first" value={first} onChange={(e) => setFirst(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ed-last">Last Name</Label>
              <Input id="ed-last" value={last} onChange={(e) => setLast(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="ed-email">Email (Login ID)</Label>
            <Input id="ed-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="ed-phone">Phone (Optional)</Label>
            <Input id="ed-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
          <Button onClick={submit}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
