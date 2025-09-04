'use client'

import { notFound } from "next/navigation";
import { Lead, ServiceLocation, Plan } from "@/payload-types";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = leads.find(l => l.id === params.id);

  if (!lead) {
    notFound();
  }

  const location = lead.location as ServiceLocation;
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
      <div className="my-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{lead.subscriberName}</h1>
        <Link href={`/dashboard/crm/leads/${lead.id}/edit`}>
          <Button>Edit Lead</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{lead.status}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lead Source</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{lead.leadSource}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preferred Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{preferredPlan?.name || 'N/A'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{location?.name || 'N/A'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}