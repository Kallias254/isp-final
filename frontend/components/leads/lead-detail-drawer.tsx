"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Calendar, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { type Lead, STATUSES, getLeadById, updateLeadFields } from "./data"

type Props = {
  leadId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadDetailDrawer({ leadId, open, onOpenChange }: Props) {
  const { toast } = useToast()
  const [lead, setLead] = React.useState<Lead | null>(null)

  React.useEffect(() => {
    setLead(getLeadById(leadId) ?? null)
  }, [leadId, open])

  const [form, setForm] = React.useState({
    name: "",
    status: "" as Lead["status"],
    source: "",
    assignedTo: "",
    followUpDate: "",
    phone: "",
    email: "",
    location: "",
    apartment: "",
    notes: "",
  })

  React.useEffect(() => {
    if (!lead) return
    setForm({
      name: lead.name ?? "",
      status: lead.status ?? "New",
      source: lead.source ?? "",
      assignedTo: lead.assignedTo ?? "",
      followUpDate: lead.followUpDate ?? "",
      phone: lead.phone ?? "",
      email: lead.email ?? "",
      location: lead.location ?? "",
      apartment: lead.apartment ?? "",
      notes: lead.notes ?? "",
    })
  }, [lead])

  function onChange<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function save() {
    if (!lead) return
    updateLeadFields(lead.id, { ...form })
    toast({
      title: "Lead updated",
      description: "Your changes have been saved.",
    })
    onOpenChange(false)
  }

  if (!lead) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Lead</SheetTitle>
          <SheetDescription>Update details, assignment, status, and follow-up.</SheetDescription>
        </SheetHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Lead Name</Label>
            <Input id="name" value={form.name} onChange={(e) => onChange("name", e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={form.status} onValueChange={(v) => onChange("status", v as Lead["status"])}>
              <SelectTrigger id="status">
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

          <div className="grid gap-2">
            <Label htmlFor="source">Source</Label>
            <Input id="source" value={form.source} onChange={(e) => onChange("source", e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input id="assignedTo" value={form.assignedTo} onChange={(e) => onChange("assignedTo", e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="followUpDate">Follow-up Date</Label>
            <div className="flex items-center gap-2">
              <Input
                id="followUpDate"
                type="date"
                value={form.followUpDate ?? ""}
                onChange={(e) => onChange("followUpDate", e.target.value)}
                className="flex-1"
              />
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="location">Service Location</Label>
              <Input id="location" value={form.location} onChange={(e) => onChange("location", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apartment">Apartment/Unit</Label>
              <Input id="apartment" value={form.apartment} onChange={(e) => onChange("apartment", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={(e) => onChange("notes", e.target.value)} />
          </div>

          <div className="mt-1">
            <Button variant="link" asChild className="px-0 text-primary">
              <Link href={`/dashboard/leads/${lead.id}`} className="inline-flex items-center gap-1">
                View full page
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button variant="outline" className="bg-transparent">
              Cancel
            </Button>
          </SheetClose>
          <Button onClick={save}>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
