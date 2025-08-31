"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function SubscriberProfilePage() {
  return (
    <form className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="Jane" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Smith" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="mpesa">M-Pesa Number (for STK Push & Notifications)</Label>
              <Input id="mpesa" defaultValue="254723456789" />
              <p className="text-xs text-muted-foreground">Used for STK Push & automated messages.</p>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="account">Account Number</Label>
              <Input id="account" defaultValue="848063" />
              <p className="text-xs text-muted-foreground">Unique identifier for M-Pesa Paybill payments.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="contact">General Contact Phone (Optional)</Label>
              <Input id="contact" defaultValue="254723456789" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email (Optional - for Portal Login & Notifications)</Label>
              <Input id="email" type="email" defaultValue="jane.smith@example.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location & Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Location & Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="serviceLocation">Service Location</Label>
              <Input id="serviceLocation" placeholder="Select a location (Optional)" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="apartment">Apartment / Unit # (Optional)</Label>
              <Input id="apartment" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="addressNotes">Address Notes / Description (Optional)</Label>
            <Textarea id="addressNotes" placeholder="e.g., Directions, specific details..." />
          </div>
        </CardContent>
      </Card>

      {/* Internal Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Internal Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="internalNotes"
            placeholder="Add any relevant notes about this subscriber..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="min-w-48">Save Profile & Location</Button>
      </div>
    </form>
  )
}
