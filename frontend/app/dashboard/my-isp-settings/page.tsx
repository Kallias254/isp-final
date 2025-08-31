"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"

export default function MyIspSettingsPage() {
  const { toast } = useToast()

  const [orgName, setOrgName] = React.useState("SeedISP Alpha")
  const [orgEmail, setOrgEmail] = React.useState("admin@alpha.isp")
  const [contactPerson, setContactPerson] = React.useState("")
  const [contactPhone, setContactPhone] = React.useState("")
  const [address, setAddress] = React.useState("")

  const [paybill, setPaybill] = React.useState("600986")
  const [darajaKey, setDarajaKey] = React.useState("")
  const [darajaSecret, setDarajaSecret] = React.useState("")
  const [darajaPasskey, setDarajaPasskey] = React.useState("")

  const [pppoeMethod, setPppoeMethod] = React.useState<"auto" | "manual">("auto")
  const [pppoePrefix, setPppoePrefix] = React.useState("alpha")

  const [emailEnabled, setEmailEnabled] = React.useState(true)
  const [defaultSender, setDefaultSender] = React.useState("")
  const [smsSenderId, setSmsSenderId] = React.useState("")
  const [brevoKey, setBrevoKey] = React.useState("")
  const [celcomKey, setCelcomKey] = React.useState("")
  const [celcomSenderId, setCelcomSenderId] = React.useState("")

  const [currency, setCurrency] = React.useState("KES")

  function saved(msg: string) {
    toast({ title: "Saved", description: msg })
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>My ISP Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-xl font-semibold">My ISP Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your ISP&apos;s profile, payment, provisioning, and notification settings.
          </p>
        </div>
      </div>

      {/* Organization header summary (no tabs) */}
      <div className="mt-4 flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded bg-muted" aria-hidden />
        <div className="min-w-0">
          <div className="text-lg font-semibold">{orgName}</div>
          <div className="text-sm text-muted-foreground">{orgEmail}</div>
        </div>
      </div>

      {/* Profile & Branding */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Company Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="company-name">ISP Name</Label>
              <Input id="company-name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="contact-person">Contact Person</Label>
              <Input
                id="contact-person"
                placeholder="Full name"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="company-email">Contact Email</Label>
              <Input id="company-email" type="email" value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="company-phone">Contact Phone</Label>
              <Input
                id="company-phone"
                placeholder="e.g., +254 7..."
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="company-address">Physical Address</Label>
            <Textarea
              id="company-address"
              placeholder="e.g., 123 Main St, City, Country"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={() => saved("Company contact information saved.")}>Save Contact Info</Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateway */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">M-Pesa Payment Gateway</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="paybill">Paybill / Till Number</Label>
            <Input id="paybill" value={paybill} onChange={(e) => setPaybill(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="grid gap-1.5">
              <Label htmlFor="daraja-key">Daraja Consumer Key</Label>
              <Input
                id="daraja-key"
                placeholder="Enter new key only to update"
                value={darajaKey}
                onChange={(e) => setDarajaKey(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="daraja-secret">Daraja Consumer Secret</Label>
              <Input
                id="daraja-secret"
                placeholder="Enter new secret only to update"
                value={darajaSecret}
                onChange={(e) => setDarajaSecret(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="daraja-passkey">Daraja Passkey</Label>
              <Input
                id="daraja-passkey"
                placeholder="Enter new passkey only to update"
                value={darajaPasskey}
                onChange={(e) => setDarajaPasskey(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => saved("Payment gateway settings saved.")}>Save M-Pesa Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Provisioning */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">PPPoE Provisioning Defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Password Method</Label>
              <Select value={pppoeMethod} onValueChange={(v) => setPppoeMethod(v as "auto" | "manual")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-Generate (Prefix + Random)</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pppoe-prefix">Password Prefix</Label>
              <Input
                id="pppoe-prefix"
                placeholder="Used if method is Auto-Generate"
                value={pppoePrefix}
                onChange={(e) => setPppoePrefix(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => saved("Provisioning defaults saved.")}>Save Provisioning Defaults</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Customer Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="grid">
              <span className="text-sm font-medium">Email Notifications</span>
              <span className="text-xs text-muted-foreground">Enable email notifications to customers.</span>
            </div>
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="default-sender">Default Sender Email</Label>
            <Input
              id="default-sender"
              placeholder="e.g., billing@yourisp.com"
              value={defaultSender}
              onChange={(e) => setDefaultSender(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="sms-sender">SMS Sender ID</Label>
            <Input
              id="sms-sender"
              placeholder="e.g., YourISPName"
              value={smsSenderId}
              onChange={(e) => setSmsSenderId(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="brevo">Brevo API Key</Label>
              <Input
                id="brevo"
                placeholder="Enter new key only to update"
                value={brevoKey}
                onChange={(e) => setBrevoKey(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="celcom-key">Celcom Africa API Key</Label>
              <Input
                id="celcom-key"
                placeholder="Enter new key only to update"
                value={celcomKey}
                onChange={(e) => setCelcomKey(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="celcom-sender">Celcom Africa Sender ID</Label>
            <Input
              id="celcom-sender"
              placeholder="Enter new ID only to update"
              value={celcomSenderId}
              onChange={(e) => setCelcomSenderId(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={() => saved("Notification settings saved.")}>Save Notification Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Defaults */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Billing Defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5 md:max-w-xs">
            <Label>Default Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KES">KES</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => saved("Billing defaults saved.")}>Save Billing Defaults</Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <p>{"© 2025. Your Company Name. All Rights Reserved."}</p>
        <p>{"Created by: Your Name/Company"}</p>
      </div>
    </div>
  )
}
