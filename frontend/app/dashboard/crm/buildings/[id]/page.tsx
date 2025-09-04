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
import { buildings } from "../mock-data";

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
      <div className="my-4">
        <h1 className="text-2xl font-bold">{building.name}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Building Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Status:</p>
              <p>{building.status}</p>
            </div>
            <div>
              <p className="font-semibold">Address:</p>
              <p>{building.address}</p>
            </div>
            <div>
              <p className="font-semibold">Location:</p>
              <p>{location?.name || 'N/A'}</p>
            </div>
            {building.partner && (
              <div>
                <p className="font-semibold">Partner:</p>
                <p>{typeof building.partner === 'object' ? building.partner.fullName : building.partner}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
