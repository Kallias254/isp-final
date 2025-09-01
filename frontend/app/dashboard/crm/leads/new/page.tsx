"use client"

import * as React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { partners } from "../../partners/mock-data"
import { buildingUnits } from "../../buildings/mock-data"

export default function NewLeadPage() {
  const [leadSource, setLeadSource] = React.useState<string | undefined>()

  return (
    <div className="container mx-auto py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/crm">CRM</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/crm/leads">Leads</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="my-4">
        <h1 className="text-2xl font-bold">Create a new lead</h1>
        <p className="text-muted-foreground">Fill in the form to create a new lead.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lead Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter first name" />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter last name" />
                </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subscriberPhone">Subscriber Phone</Label>
              <Input id="subscriberPhone" placeholder="Enter subscriber phone" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="leadSource">Lead Source</Label>
                <Select onValueChange={setLeadSource}>
                    <SelectTrigger id="leadSource">
                        <SelectValue placeholder="Select lead source" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="partner-referral">Partner Referral</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="direct-call">Direct Call</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {leadSource === 'partner-referral' && (
                <div className="grid gap-2">
                    <Label htmlFor="referredBy">Referred By</Label>
                    <Select>
                        <SelectTrigger id="referredBy">
                            <SelectValue placeholder="Select partner" />
                        </SelectTrigger>
                        <SelectContent>
                            {partners.map(partner => (
                                <SelectItem key={partner.id} value={partner.id}>{partner.fullName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
            <div className="grid gap-2">
                <Label htmlFor="serviceLocation">Service Location</Label>
                <Select>
                    <SelectTrigger id="serviceLocation">
                        <SelectValue placeholder="Select service location" />
                    </SelectTrigger>
                    <SelectContent>
                        {buildingUnits.map(unit => (
                            <SelectItem key={unit.id} value={unit.id}>{`${typeof unit.building === 'object' ? unit.building.name : ''} - ${unit.unitNumber}`}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Create Lead</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}