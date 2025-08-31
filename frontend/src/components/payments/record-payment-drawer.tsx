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
import type { PaymentMethod } from "./data"

type NewPayment = {
  subscriber: string
  invoiceNumber?: string
  amount: number
  method: PaymentMethod
  reference?: string
  date: string
  notes?: string
}

export function RecordPaymentDrawer({ onCreate }: { onCreate: (p: NewPayment) => void }) {
  const [open, setOpen] = React.useState(false)
  const [subscriber, setSubscriber] = React.useState("")
  const [invoice, setInvoice] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [method, setMethod] = React.useState<PaymentMethod>("M-Pesa")
  const [reference, setReference] = React.useState("")
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = React.useState("")

  function submit() {
    const amt = Number.parseFloat(amount)
    if (!subscriber.trim() || isNaN(amt)) return
    onCreate({
      subscriber: subscriber.trim(),
      invoiceNumber: invoice.trim() || undefined,
      amount: amt,
      method,
      reference: reference.trim() || undefined,
      date,
      notes: notes.trim() || undefined,
    })
    setOpen(false)
    setSubscriber("")
    setInvoice("")
    setAmount("")
    setReference("")
    setNotes("")
    setMethod("M-Pesa")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="whitespace-nowrap">+ Record Manual Payment</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Record Manual Payment</SheetTitle>
        </SheetHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="rp-subscriber">Subscriber</Label>
            <Input
              id="rp-subscriber"
              placeholder="Search by name or phone..."
              value={subscriber}
              onChange={(e) => setSubscriber(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="rp-invoice">Invoice # (Optional)</Label>
            <Input
              id="rp-invoice"
              placeholder="INV-00001"
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="rp-amount">Amount</Label>
              <Input
                id="rp-amount"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Method</Label>
              <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="rp-ref">Reference (Optional)</Label>
              <Input
                id="rp-ref"
                placeholder="Txn/Ref #"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="rp-date">Payment Date</Label>
              <Input id="rp-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="rp-notes">Notes (Optional)</Label>
            <Textarea
              id="rp-notes"
              placeholder="Any notes related to this payment..."
              className="min-h-[110px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button onClick={submit}>Save Payment</Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
