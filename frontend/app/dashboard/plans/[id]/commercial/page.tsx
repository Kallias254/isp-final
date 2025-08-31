"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function PlanCommercialPage() {
  const { toast } = useToast()
  const [name, setName] = React.useState("Bronze")
  const [price, setPrice] = React.useState("1000.00")
  const [currency, setCurrency] = React.useState("KES")
  const [cycle, setCycle] = React.useState("Monthly")
  const [rate, setRate] = React.useState("5M/5M")
  const [desc, setDesc] = React.useState("")
  const [signupActive, setSignupActive] = React.useState(true)
  const [overallEnabled, setOverallEnabled] = React.useState(true)

  function save() {
    toast({ title: "Plan updated", description: "Commercial details saved." })
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commercial Plan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Commercial Plan Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            <p className="text-xs text-muted-foreground">The user-facing name of the plan (e.g., "Home 10Mbps").</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_160px]">
            <div className="grid gap-1.5">
              <Label htmlFor="price">Price</Label>
              <Input id="price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Billing Cycle</Label>
              <Select value={cycle} onValueChange={setCycle}>
                <SelectTrigger>
                  <SelectValue placeholder="Cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="rate">Rate Limit (Upload/Download)</Label>
              <Input id="rate" value={rate} onChange={(e) => setRate(e.target.value)} />
              <p className="text-xs text-muted-foreground">Format: 10M or 5M/10M (use K, M, G).</p>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="desc">Description (Optional)</Label>
            <Textarea id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} className="min-h-[90px]" />
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <Checkbox id="sgn" checked={signupActive} onCheckedChange={(v) => setSignupActive(Boolean(v))} />
              <Label htmlFor="sgn">Active for New Signups</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="ovr" checked={overallEnabled} onCheckedChange={(v) => setOverallEnabled(Boolean(v))} />
              <Label htmlFor="ovr">Plan Enabled (Overall)</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" className="min-w-40">
          Save Details
        </Button>
      </div>
    </form>
  )
}
