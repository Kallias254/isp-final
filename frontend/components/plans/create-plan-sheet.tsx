"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BillingCycle } from "./data"

export function CreatePlanSheet({
  onCreate,
}: {
  onCreate: (payload: {
    name: string
    price: number
    currency: string
    billingCycle: BillingCycle
    rateLimit: string
    description?: string
  }) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [price, setPrice] = React.useState("")
  const [currency, setCurrency] = React.useState("KES")
  const [billingCycle, setBillingCycle] = React.useState<BillingCycle>("Monthly")
  const [rateLimit, setRateLimit] = React.useState("")
  const [description, setDescription] = React.useState("")

  function submit() {
    const p = Number.parseFloat(price)
    if (!name.trim() || isNaN(p) || !rateLimit.trim()) return
    onCreate({
      name: name.trim(),
      price: p,
      currency,
      billingCycle,
      rateLimit: rateLimit.trim(),
      description: description.trim() || undefined,
    })
    setOpen(false)
    setName("")
    setPrice("")
    setRateLimit("")
    setDescription("")
    setCurrency("KES")
    setBillingCycle("Monthly")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="whitespace-nowrap">+ Add New Plan</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Add New Commercial Plan</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Create a new plan shell. Technical details can be configured after creation.
          </p>
        </SheetHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="plan-name">Commercial Plan Name</Label>
            <Input id="plan-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                inputMode="decimal"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KES">KES</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Billing Cycle</Label>
            <Select value={billingCycle} onValueChange={(v) => setBillingCycle(v as BillingCycle)}>
              <SelectTrigger>
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="rate">Rate Limit</Label>
            <Input
              id="rate"
              placeholder="e.g., 10M/20M"
              value={rateLimit}
              onChange={(e) => setRateLimit(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Format: 10M or 5M/10M (use K, M, G).</p>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="desc">Description (Optional)</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[90px]"
            />
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Create Plan</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
