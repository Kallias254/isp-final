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

type NewInvoice = {
  subscriber: string
  description: string
  amount: number
  dueDate: string
  notes?: string
}

export function GenerateInvoiceDrawer({ onCreate }: { onCreate: (inv: NewInvoice) => void }) {
  const [open, setOpen] = React.useState(false)
  const [subscriber, setSubscriber] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [dueDate, setDueDate] = React.useState(() => new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = React.useState("")

  function handleSubmit() {
    const amt = Number.parseFloat(amount)
    if (!subscriber.trim() || !description.trim() || isNaN(amt)) return
    onCreate({
      subscriber: subscriber.trim(),
      description: description.trim(),
      amount: amt,
      dueDate,
      notes: notes.trim() || undefined,
    })
    setOpen(false)
    setSubscriber("")
    setDescription("")
    setAmount("")
    setNotes("")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="whitespace-nowrap">+ Generate Manual Invoice</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Generate Manual Invoice</SheetTitle>
        </SheetHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="sub">Subscriber</Label>
            <Input
              id="sub"
              placeholder="Search by name or phone..."
              value={subscriber}
              onChange={(e) => setSubscriber(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="desc">Description</Label>
            <Input
              id="desc"
              placeholder="e.g., Custom Installation Fee"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="amt">Amount</Label>
            <Input
              id="amt"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="due">Due Date</Label>
            <Input id="due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any internal notes..."
              className="min-h-[110px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button onClick={handleSubmit}>Generate Invoice</Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
