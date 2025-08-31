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
import type { TicketPriority, TicketStatus } from "./data"

type NewTicket = {
  subject: string
  customer?: string
  status: TicketStatus
  priority: TicketPriority
  assignedTo?: string
  initialMessage?: string
}

export function CreateTicketDrawer({ onCreate }: { onCreate: (t: NewTicket) => void }) {
  const [open, setOpen] = React.useState(false)
  const [subject, setSubject] = React.useState("")
  const [customer, setCustomer] = React.useState("")
  const [status, setStatus] = React.useState<TicketStatus>("Open")
  const [priority, setPriority] = React.useState<TicketPriority>("Low")
  const [assignedTo, setAssignedTo] = React.useState("")
  const [initialMessage, setInitialMessage] = React.useState("")

  function reset() {
    setSubject("")
    setCustomer("")
    setStatus("Open")
    setPriority("Low")
    setAssignedTo("")
    setInitialMessage("")
  }

  function handleCreate() {
    if (!subject.trim()) {
      // Simple required validation
      return
    }
    onCreate({
      subject: subject.trim(),
      customer: customer || undefined,
      status,
      priority,
      assignedTo: assignedTo || undefined,
      initialMessage: initialMessage || undefined,
    })
    reset()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="whitespace-nowrap">
          Create New Ticket
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Ticket</SheetTitle>
        </SheetHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="customer">Customer (Optional)</Label>
            <Input
              id="customer"
              placeholder="Select a customer (Optional)"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
            <p className="text-[0.8rem] text-muted-foreground">
              Select the customer this ticket is for, or leave blank for internal tickets.
            </p>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="grid gap-1">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TicketStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Open" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Low" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="assignee">Assignee (Optional)</Label>
              <Input
                id="assignee"
                placeholder="User ID or name"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="message">Initial Message</Label>
            <Textarea
              id="message"
              placeholder="Describe the issue..."
              className="min-h-[120px]"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button onClick={handleCreate}>Create Ticket</Button>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
