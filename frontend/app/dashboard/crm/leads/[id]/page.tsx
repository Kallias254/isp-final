'use client'

import { notFound } from "next/navigation";
import { Lead, BuildingUnit, Building, Plan, ServiceLocation } from "@/payload-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { leads } from "../mock-data";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = leads.find(l => l.id === params.id);

  if (!lead) {
    notFound();
  }

  const serviceLocation = lead.serviceLocation as BuildingUnit;
  const building = serviceLocation?.building as Building;
  const preferredPlan = lead.preferredPlan as Plan;

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
      <div className="my-4">
        <h1 className="text-2xl font-bold">{lead.subscriberName}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lead Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Status:</p>
              <p>{lead.status}</p>
            </div>
            <div>
              <p className="font-semibold">Lead Source:</p>
              <p>{lead.leadSource}</p>
            </div>
            <div>
              <p className="font-semibold">Phone:</p>
              <p>{lead.subscriberPhone}</p>
            </div>
            <div>
              <p className="font-semibold">Building:</p>
              <p>{building?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Unit:</p>
              <p>{serviceLocation?.unitNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Preferred Plan:</p>
              <p>{preferredPlan?.name || 'N/A'}</p>
            </div>
            {/* The location field in mock data is not a ServiceLocation type, so we can't access latitude/longitude directly */}
            {/* {building?.location && (
              <div>
                <p className="font-semibold">Coordinates:</p>
                <p>{(building.location as ServiceLocation).latitude}, {(building.location as ServiceLocation).longitude}</p>
              </div>
            )} */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
