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
import { plans } from "../../../billing/plans/mock-data"

export default function NewSubscriberPage() {
  const [accountNumber, setAccountNumber] = React.useState("")

  React.useEffect(() => {
    // Auto-generate a 6-digit account number
    const newAccountNumber = Math.floor(100000 + Math.random() * 900000).toString()
    setAccountNumber(newAccountNumber)
  }, [])

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
            <BreadcrumbLink href="/dashboard/crm/subscribers">Subscribers</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="my-4">
        <h1 className="text-2xl font-bold">Create a new subscriber</h1>
        <p className="text-muted-foreground">Fill in the form to create a new subscriber.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input id="accountNumber" value={accountNumber} disabled />
            </div>
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
              <Label htmlFor="mpesaNumber">M-Pesa Number</Label>
              <Input id="mpesaNumber" placeholder="Enter M-Pesa number" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="servicePlan">Service Plan</Label>
                    <Select>
                        <SelectTrigger id="servicePlan">
                            <SelectValue placeholder="Select service plan" />
                        </SelectTrigger>
                        <SelectContent>
                            {plans.map(plan => (
                                <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="billingCycle">Billing Cycle</Label>
                    <Select>
                        <SelectTrigger id="billingCycle">
                            <SelectValue placeholder="Select billing cycle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="nextDueDate">Next Due Date</Label>
                <Input id="nextDueDate" type="date" />
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Create Subscriber</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
