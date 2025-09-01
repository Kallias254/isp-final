"use client"

import { leads } from "../mock-data"
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

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = leads.find((l) => l.id === params.id)

  if (!lead) {
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
                    <BreadcrumbLink href="/dashboard/crm/leads">Leads</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{lead.subscriberName}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      <div className="flex justify-between items-center my-4">
        <div>
            <h1 className="text-2xl font-bold">
                {lead.subscriberName}
            </h1>
            <p className="text-muted-foreground">Lead Details</p>
        </div>
        <div className="flex gap-2">
            <Link href="/dashboard/crm/leads">
                <Button variant="outline">Back</Button>
            </Link>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button>Edit</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Edit Lead</DrawerTitle>
                        <DrawerDescription>
                            Update the lead's details.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="subscriberName">Subscriber Name</Label>
                            <Input id="subscriberName" defaultValue={lead.subscriberName} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subscriberPhone">Subscriber Phone</Label>
                            <Input id="subscriberPhone" defaultValue={lead.subscriberPhone} />
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
            <p>Status: {lead.status}</p>
            <p>Source: {lead.leadSource}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Phone: {lead.subscriberPhone}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{typeof lead.serviceLocation === 'object' && typeof lead.serviceLocation.building === 'object' ? `${lead.serviceLocation.building.name} - ${lead.serviceLocation.unitNumber}` : ''}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Notes about the lead will be displayed here.</p>
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
      </Tabs>
    </div>
  )
}