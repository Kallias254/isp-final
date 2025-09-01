"use client"

import { buildings, buildingUnits } from "../mock-data"
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
import Image from "next/image"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"

export default function BuildingDetailPage({ params }: { params: { id: string } }) {
  const building = buildings.find((b) => b.id === params.id)

  if (!building) {
    notFound()
  }

  const unitsInBuilding = buildingUnits.filter(unit => typeof unit.building === 'object' && unit.building.id === building.id)

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
                    <BreadcrumbLink href="/dashboard/crm/buildings">Buildings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{building.name}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      <div className="flex justify-between items-center my-4">
        <div>
            <h1 className="text-2xl font-bold">
                {building.name}
            </h1>
            <p className="text-muted-foreground">Building Details</p>
        </div>
        <div className="flex gap-2">
            <Link href="/dashboard/crm/buildings">
                <Button variant="outline">Back</Button>
            </Link>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button>Edit</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Edit Building</DrawerTitle>
                        <DrawerDescription>
                            Update the building's details.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue={building.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" defaultValue={building.address} />
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
        <div className="md:col-span-2 grid gap-4">
            <Card>
            <CardHeader>
                <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Status: {building.status}</p>
                <p>Partner: {typeof building.partner === 'object' ? building.partner.fullName : '-'}</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{building.address}</p>
            </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Building Image</CardTitle>
                </CardHeader>
                <CardContent>
                    <Image src="/building-1.jpg" alt={building.name} width={1035} height={690} className="rounded-md" />
                </CardContent>
            </Card>
        </div>
    </div>

      <Tabs defaultValue="units">
        <TabsList>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="units">
          <Card>
            <CardHeader>
              <CardTitle>Units</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {unitsInBuilding.map(unit => (
                    <li key={unit.id}>{unit.unitNumber} - {unit.status}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Equipment data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Notes about the building will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}