"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Plus, X } from "lucide-react"

interface QuickAddSubscriberDrawerProps {
  children: React.ReactNode
}

type Charge = { id: string; description: string; amount: string }

export function QuickAddSubscriberDrawer({ children }: QuickAddSubscriberDrawerProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mpesaPhone: "",
    contactPhone: "",
    email: "",
    trial: false,
    charges: [] as Charge[],
    accountNumber: "",
    plan: "",
    connection: "",
    router: "",
    ipOrUsername: "",
    status: "Active",
    expiry: "",
  })

  const addCharge = () => {
    setFormData((f) => ({
      ...f,
      charges: [...f.charges, { id: crypto.randomUUID(), description: "", amount: "" }],
    }))
  }

  const removeCharge = (id: string) => {
    setFormData((f) => ({ ...f, charges: f.charges.filter((c) => c.id !== id) }))
  }

  const updateCharge = (id: string, patch: Partial<Charge>) => {
    setFormData((f) => ({
      ...f,
      charges: f.charges.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating subscriber:", formData)
    setOpen(false)
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      mpesaPhone: "",
      contactPhone: "",
      email: "",
      trial: false,
      charges: [],
      accountNumber: "",
      plan: "",
      connection: "",
      router: "",
      ipOrUsername: "",
      status: "Active",
      expiry: "",
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Subscriber</SheetTitle>
          <SheetDescription>Create a new subscriber account with service details.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mpesaPhone">MPESA Phone</Label>
            <div className="flex">
              <span className="inline-flex select-none items-center rounded-l-md border border-r-0 bg-muted px-2 text-sm text-muted-foreground">
                +254
              </span>
              <Input
                id="mpesaPhone"
                type="tel"
                placeholder="712345678"
                className="rounded-l-none"
                value={formData.mpesaPhone}
                onChange={(e) => setFormData({ ...formData, mpesaPhone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
            <div className="flex">
              <span className="inline-flex select-none items-center rounded-l-md border border-r-0 bg-muted px-2 text-sm text-muted-foreground">
                +254
              </span>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="712345678"
                className="rounded-l-none"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="subscriber@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="trial"
              checked={formData.trial}
              onCheckedChange={(v) => setFormData({ ...formData, trial: Boolean(v) })}
            />
            <Label htmlFor="trial">Enable Trial Period</Label>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                type="date"
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Service Plan</Label>
              <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Connection Type</Label>
              <Select
                value={formData.connection}
                onValueChange={(value) => setFormData({ ...formData, connection: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select connection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIRECT STATIC">DIRECT STATIC</SelectItem>
                  <SelectItem value="PPPOE">PPPOE</SelectItem>
                  <SelectItem value="HOTSPOT">HOTSPOT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Router</Label>
              <Select value={formData.router} onValueChange={(value) => setFormData({ ...formData, router: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select router" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local_router">Local Router</SelectItem>
                  <SelectItem value="main_router">Main Router</SelectItem>
                  <SelectItem value="backup_router">Backup Router</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ipOrUsername">IP/Username</Label>
              <Input
                id="ipOrUsername"
                value={formData.ipOrUsername}
                onChange={(e) => setFormData({ ...formData, ipOrUsername: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Installation Charges (Optional)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addCharge}>
                <Plus className="mr-2 h-4 w-4" />
                Add Charge
              </Button>
            </div>
            {formData.charges.map((charge) => (
              <div key={charge.id} className="grid grid-cols-[1fr_120px_40px] items-center gap-2">
                <Input
                  placeholder="Charge Description"
                  value={charge.description}
                  onChange={(e) => updateCharge(charge.id, { description: e.target.value })}
                />
                <Input
                  placeholder="Amount"
                  value={charge.amount}
                  onChange={(e) => updateCharge(charge.id, { amount: e.target.value })}
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeCharge(charge.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Create Subscriber
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
