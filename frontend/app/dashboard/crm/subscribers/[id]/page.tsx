"use client"

import { subscribers } from "../mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"

export default function SubscriberDetailPage({ params }: { params: { id: string } }) {
  const subscriber = subscribers.find((s) => s.id === params.id)

  if (!subscriber) {
    notFound()
  }

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
                    <BreadcrumbPage>{subscriber.firstName} {subscriber.lastName}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      <div className="flex justify-between items-center my-4">
        <div>
            <h1 className="text-2xl font-bold">
                {subscriber.firstName} {subscriber.lastName}
            </h1>
            <p className="text-muted-foreground">Subscriber Details</p>
        </div>
        <div className="flex gap-2">
            <Link href="/dashboard/crm/subscribers">
                <Button variant="outline">Back</Button>
            </Link>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button>Edit</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Edit Subscriber</DrawerTitle>
                        <DrawerDescription>
                            Update the subscriber's details.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue={subscriber.firstName} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue={subscriber.lastName} />
                        </div>
                    </div>
                    <DrawerFooter>
                        <Button>Save Changes</Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Status: {subscriber.status}</p>
            <p>Plan: {typeof subscriber.servicePlan === 'object' ? subscriber.servicePlan.name : subscriber.servicePlan}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Phone: {subscriber.contactPhone ?? subscriber.mpesaNumber}</p>
            <p>Email: {subscriber.email ?? '-'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Standing</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Account Balance: {subscriber.accountBalance ? `KES ${subscriber.accountBalance.toLocaleString()}` : "-"}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="service">Service Details</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Invoice data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Payment data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ticket data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Message data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Activity log data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="service">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Service details will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}