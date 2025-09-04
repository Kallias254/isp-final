'use client'

import { notFound } from "next/navigation";
import { Building, ServiceLocation, BuildingUnit } from "@/payload-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitsDataTable } from "./units-data-table";
import { buildings } from "@/app/dashboard/crm/buildings/mock-data"; // Using mock data
import React from "react";

// MOCK DATA for units
const mockUnits: BuildingUnit[] = [
  { id: 'unit1', unitNumber: 'A101', status: 'active-subscriber', building: '1', subscriber: 'sub1', lead: null, ispOwner: '1', createdAt: '', updatedAt: '' },
  { id: 'unit2', unitNumber: 'A102', status: 'lead', building: '1', lead: 'lead1', subscriber: null, ispOwner: '1', createdAt: '', updatedAt: '' },
  { id: 'unit3', unitNumber: 'B201', status: 'vacant-unsurveyed', building: '1', lead: null, subscriber: null, ispOwner: '1', createdAt: '', updatedAt: '' },
  { id: 'unit4', unitNumber: 'C301', status: 'former-subscriber', building: '1', lead: null, subscriber: null, ispOwner: '1', createdAt: '', updatedAt: '' },
  { id: 'unit5', unitNumber: '101', status: 'active-subscriber', building: '2', subscriber: 'sub2', lead: null, ispOwner: '1', createdAt: '', updatedAt: '' },
];


export default function BuildingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = React.use(params);
  const building = buildings.find(b => b.id === awaitedParams.id);

  if (!building) {
    notFound();
  }
  
  const units = mockUnits.filter(u => u.building === awaitedParams.id);
  const totalUnits = units.length;
  const activeSubscribers = units.filter(u => u.status === 'active-subscriber').length;
  const leads = units.filter(u => u.status === 'lead').length;
  const occupancyRate = totalUnits > 0 ? ((activeSubscribers / totalUnits) * 100).toFixed(0) : 0;

  const location = building.location as ServiceLocation;

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
      <div className="my-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{building.name}</h1>
        <Link href={`/dashboard/crm/buildings/${building.id}/edit`}>
          <Button>Edit Building</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <Card>
          <CardHeader><CardTitle>Total Units</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{totalUnits}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Subscribers</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{activeSubscribers}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Leads</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{leads}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Occupancy Rate</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{occupancyRate}%</p></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="units">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="units">Units</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
            <Card>
                <CardHeader><CardTitle>Building Details</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <p><strong>Status:</strong> {building.status}</p>
                    <p><strong>Location:</strong> {location?.name || 'N/A'}</p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="units">
          <UnitsDataTable data={units} />
        </TabsContent>
      </Tabs>
    </div>
  );
}