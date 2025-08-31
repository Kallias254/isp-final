"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function PlanPPPoEPage() {
  const { toast } = useToast()
  const [router, setRouter] = React.useState("local_router")
  const [profile, setProfile] = React.useState("Bronze")

  function save() {
    toast({ title: "PPPoE settings saved" })
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
          <CardTitle className="text-base">PPPoE Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label>Associate with MikroTik Router</Label>
            <Select value={router} onValueChange={setRouter}>
              <SelectTrigger>
                <SelectValue placeholder="Select router" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local_router">local_router (127.0.0.1)</SelectItem>
                <SelectItem value="core_router">core_router (10.0.0.1)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the primary MikroTik router for this plan's PPPoE services.
            </p>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="profile">MikroTik PPP Profile Name</Label>
            <Input id="profile" value={profile} onChange={(e) => setProfile(e.target.value)} />
            <p className="text-xs text-muted-foreground">Must match a PPP profile on the selected router.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" className="min-w-40">
          Save PPPoE Settings
        </Button>
      </div>
    </form>
  )
}
