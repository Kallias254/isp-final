"use client"

import { partners } from "../mock-data"
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

export default function PartnerDetailPage({ params }: { params: { id: string } }) {
  const partner = partners.find((p) => p.id === params.id)

  if (!partner) {
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
                    <BreadcrumbLink href="/dashboard/crm/partners">Partners</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{partner.fullName}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      <div className="flex justify-between items-center my-4">
        <div>
            <h1 className="text-2xl font-bold">
                {partner.fullName}
            </h1>
            <p className="text-muted-foreground">Partner Details</p>
        </div>
        <div className="flex gap-2">
            <Link href="/dashboard/crm/partners">
                <Button variant="outline">Back</Button>
            </Link>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button>Edit</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Edit Partner</DrawerTitle>
                        <DrawerDescription>
                            Update the partner's details.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" defaultValue={partner.fullName} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" defaultValue={partner.phoneNumber} />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Status: {partner.status}</p>
            <p>Commission Rate: {partner.commissionRate ? `${partner.commissionRate}%` : '-'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Phone: {partner.phoneNumber}</p>
            <p>M-Pesa: {partner.mpesaNumber}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="referred-subscribers">
        <TabsList>
          <TabsTrigger value="referred-subscribers">Referred Subscribers</TabsTrigger>
          <TabsTrigger value="buildings">Buildings</TabsTrigger>
        </TabsList>
        <TabsContent value="referred-subscribers">
          <Card>
            <CardHeader>
              <CardTitle>Referred Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Referred subscribers data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="buildings">
          <Card>
            <CardHeader>
              <CardTitle>Buildings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Buildings data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
