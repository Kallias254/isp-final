"use client"

import * as React from "react"
import { notFound, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { seedSubscribers } from "@/components/subscribers/data"
import { Save, Plus, X } from "lucide-react"

type Charge = { id: string; description: string; amount: string }

export default function EditSubscriberPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const subscriber = seedSubscribers.find((s) => s.id === params.id)

  if (!subscriber) {
    notFound()
  }

  const [formData, setFormData] = React.useState({
    firstName: subscriber.firstName,
    lastName: subscriber.lastName,
    mpesaPhone: subscriber.mpesaPhone,
    contactPhone: subscriber.contactPhone || "",
    email: subscriber.email || "",
    trial: false,
    charges: [] as Charge[],
    accountNumber: subscriber.accountNumber,
    plan: subscriber.plan,
    connection: subscriber.connection,
    router: subscriber.router,
    ipOrUsername: subscriber.ipOrUsername,
    status: subscriber.status,
    expiry: subscriber.expiry,
  })

  const [isSaving, setIsSaving] = React.useState(false)

  function addCharge() {
    setFormData((f) => ({
      ...f,
      charges: [...f.charges, { id: crypto.randomUUID(), description: "", amount: "" }],
    }))
  }

  function removeCharge(id: string) {
    setFormData((f) => ({ ...f, charges: f.charges.filter((c) => c.id !== id) }))
  }

  function updateCharge(id: string, patch: Partial<Charge>) {
    setFormData((f) => ({
      ...f,
      charges: f.charges.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    router.push(`/dashboard/subscribers/${params.id}`)
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl 2xl:max-w-[1800px] px-4 md:px-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/subscribers">Subscribers</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/subscribers/${params.id}`}>
                  {`${subscriber.firstName} ${subscriber.lastName}`}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-2xl font-semibold">Edit Subscriber</h1>
          <p className="text-sm text-muted-foreground">Update subscriber information and service details.</p>
        </div>

        <div className="mt-2 md:mt-0">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main Form - Similar to Create Page */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Subscriber Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="edit-first">First Name</Label>
                <Input
                  id="edit-first"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="edit-last">Last Name</Label>
                <Input
                  id="edit-last"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="edit-mpesa">MPESA Phone</Label>
              <div className="flex">
                <span className="inline-flex select-none items-center rounded-l-md border border-r-0 bg-muted px-2 text-sm text-muted-foreground">
                  +254
                </span>
                <Input
                  id="edit-mpesa"
                  type="tel"
                  inputMode="numeric"
                  placeholder="712345678"
                  className="rounded-l-none"
                  value={formData.mpesaPhone}
                  onChange={(e) => setFormData({ ...formData, mpesaPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="edit-contact">Contact Phone (Optional)</Label>
              <div className="flex">
                <span className="inline-flex select-none items-center rounded-l-md border border-r-0 bg-muted px-2 text-sm text-muted-foreground">
                  +254
                </span>
                <Input
                  id="edit-contact"
                  type="tel"
                  inputMode="numeric"
                  placeholder="712345678"
                  className="rounded-l-none"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="edit-email">Email Address (Optional)</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="subscriber@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-trial"
                checked={formData.trial}
                onCheckedChange={(v) => setFormData({ ...formData, trial: Boolean(v) })}
              />
              <Label htmlFor="edit-trial">Enable Trial Period</Label>
            </div>

            <Separator />

            <div className="grid gap-1.5">
              <Label htmlFor="edit-account">Account Number</Label>
              <Input
                id="edit-account"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="edit-expiry">Expiry Date</Label>
              <Input
                id="edit-expiry"
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-medium">Installation Charges (Optional)</div>
              {formData.charges.map((charge) => (
                <div key={charge.id} className="grid grid-cols-[1fr_120px_28px] items-center gap-2">
                  <Input
                    placeholder="Charge Description"
                    value={charge.description}
                    onChange={(e) => updateCharge(charge.id, { description: e.target.value })}
                  />
                  <Input
                    placeholder="Amount"
                    inputMode="decimal"
                    value={charge.amount}
                    onChange={(e) => updateCharge(charge.id, { amount: e.target.value })}
                  />
                  <button
                    type="button"
                    className="inline-flex h-9 w-7 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted"
                    onClick={() => removeCharge(charge.id)}
                    aria-label="Remove charge"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addCharge} className="w-fit bg-transparent">
                <Plus className="mr-2 h-4 w-4" />
                Add Charge
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Service Configuration - Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plan">Service Plan</Label>
                <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
                  <SelectTrigger>
                    <SelectValue />
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
                <Label htmlFor="edit-connection">Connection Type</Label>
                <Select
                  value={formData.connection}
                  onValueChange={(value) => setFormData({ ...formData, connection: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DIRECT STATIC">DIRECT STATIC</SelectItem>
                    <SelectItem value="PPPOE">PPPOE</SelectItem>
                    <SelectItem value="HOTSPOT">HOTSPOT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-router">Router</Label>
                <Select value={formData.router} onValueChange={(value) => setFormData({ ...formData, router: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local_router">Local Router</SelectItem>
                    <SelectItem value="main_router">Main Router</SelectItem>
                    <SelectItem value="backup_router">Backup Router</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-ip">IP/Username</Label>
                <Input
                  id="edit-ip"
                  value={formData.ipOrUsername}
                  onChange={(e) => setFormData({ ...formData, ipOrUsername: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
