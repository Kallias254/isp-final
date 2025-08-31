"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STATUSES, getLeads } from "./data"
import { cn } from "@/lib/utils"

type NewLeadForm = {
  name: string
  phone?: string
  email?: string
  location?: string
  apartment?: string
  assignedTo?: string
  notes?: string
  status: string
}

export function AddLeadSheet({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  // Build option lists from existing leads for a nice UX
  const base = React.useMemo(() => getLeads(), [])
  const agents = React.useMemo(() => Array.from(new Set(base.map((l) => l.assignedTo).filter(Boolean))), [base])
  const locations = React.useMemo(() => Array.from(new Set(base.map((l) => l.location).filter(Boolean))), [base])

  const [form, setForm] = React.useState<NewLeadForm>({
    name: "",
    phone: "",
    email: "",
    location: "",
    apartment: "",
    assignedTo: "",
    notes: "",
    status: STATUSES[0] ?? "New",
  })

  function onChange<K extends keyof NewLeadForm>(key: K, value: NewLeadForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name?.trim()) return

    setSaving(true)
    try {
      // Create a client-side lead object and broadcast it to the board
      const id = `l${Date.now()}`
      const followUpDate = undefined // optional; could set a default
      const lead: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
        id,
        name: form.name.trim(),
        phone: form.phone?.trim() || "",
        email: form.email?.trim() || "",
        location: form.location || "N/A",
        apartment: form.apartment?.trim() || "",
        assignedTo: form.assignedTo || "Unassigned",
        source: "N/A",
        notes: form.notes?.trim() || "",
        status: form.status,
        followUpDate,
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("lead:created", { detail: lead }))
      }
      setOpen(false)
      // Reset form
      setForm({
        name: "",
        phone: "",
        email: "",
        location: "",
        apartment: "",
        assignedTo: "",
        notes: "",
        status: STATUSES[0] ?? "New",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className={cn("whitespace-nowrap", className)}>+ Add New Lead</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-[520px] sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Add New Lead</SheetTitle>
        </SheetHeader>

        <form onSubmit={onSubmit} className="mt-4 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="lead-name">Lead Name *</Label>
            <Input
              id="lead-name"
              placeholder="e.g., Acme HQ Internet"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-phone">Phone</Label>
            <Input
              id="lead-phone"
              type="tel"
              placeholder="e.g., +1 555-123-4567"
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-email">Email</Label>
            <Input
              id="lead-email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Service Location</Label>
            <Select value={form.location || ""} onValueChange={(v) => onChange("location", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Service Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.length === 0 && <SelectItem value="N/A">N/A</SelectItem>}
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-apartment">Apartment/Unit #</Label>
            <Input
              id="lead-apartment"
              placeholder="e.g., A-203"
              value={form.apartment}
              onChange={(e) => onChange("apartment", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Assigned To Sales Agent</Label>
            <Select value={form.assignedTo || ""} onValueChange={(v) => onChange("assignedTo", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Sales Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
                {agents.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-notes">Notes</Label>
            <Textarea
              id="lead-notes"
              placeholder="Internal notes about this lead..."
              value={form.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label>Status *</Label>
            <Select value={form.status} onValueChange={(v) => onChange("status", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SheetFooter className="mt-2">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={saving || !form.name.trim()}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
