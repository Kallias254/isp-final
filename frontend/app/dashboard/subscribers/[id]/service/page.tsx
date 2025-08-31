"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SubscriberServicePage() {
  return (
    <form className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Subscriber is currently active.</AlertTitle>
        <AlertDescription>To modify service details, please suspend their service first.</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Service Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Router / Connection */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Assigned Router</Label>
              <Select defaultValue="local_router">
                <SelectTrigger>
                  <SelectValue placeholder="Select router" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local_router">local_router (127.0.0.1)</SelectItem>
                  <SelectItem value="core_router">core_router (10.0.0.1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Connection Type</Label>
              <Select defaultValue="Static IP">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Static IP">Static IP</SelectItem>
                  <SelectItem value="PPPoE">PPPoE</SelectItem>
                  <SelectItem value="DHCP">DHCP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Plan */}
          <div className="grid gap-1.5">
            <Label>Service Plan</Label>
            <Select defaultValue="gold">
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="silver">Silver (2000.00 KES)</SelectItem>
                <SelectItem value="gold">Gold (3000.00 KES)</SelectItem>
                <SelectItem value="platinum">Platinum (4500.00 KES)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Price: 3000.00 / monthly | Rate: 15M/15M | Profile: Gold</p>
          </div>

          {/* Static IP configuration */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Assigned IP Subnet (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subnet (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="192-168-100">192.168.100.0/24</SelectItem>
                  <SelectItem value="10-0-0">10.0.0.0/24</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Select a subnet to suggest IPs from a specific range.</p>
            </div>
            <div className="grid gap-1.5">
              <Label>Static IP Address</Label>
              <div className="flex gap-2">
                <Input defaultValue="192.168.100.10" />
                <Button type="button" variant="outline" className="bg-transparent">
                  Suggest
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>MAC Address (for DHCP)</Label>
            <Input defaultValue="00:11:22:33:44:55" />
            <p className="text-xs text-muted-foreground">Fill this to use DHCP with a static lease.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="secondary" className="bg-amber-100 text-amber-900 hover:bg-amber-100">
          Suspend Service
        </Button>
      </div>
    </form>
  )
}
