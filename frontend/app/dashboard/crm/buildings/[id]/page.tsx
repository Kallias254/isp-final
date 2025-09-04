'use client'

import { notFound } from "next/navigation";
import { Building, ServiceLocation } from "@/payload-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildings } from "@/app/dashboard/crm/buildings/mock-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BuildingDetailPage({ params }: { params: { id: string } }) {
  const building = buildings.find(b => b.id === params.id);

  if (!building) {
    notFound();
  }

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
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{building.status}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{location?.name || 'N/A'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}