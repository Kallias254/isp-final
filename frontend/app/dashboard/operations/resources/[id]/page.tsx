"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { resources } from "../mock-data";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  const resource = resources.find((r) => r.id === params.id);

  if (!resource) {
    notFound();
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
            <BreadcrumbLink href="/dashboard/operations">Operations</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/operations/resources">Inventory (Resources)</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{resource.resourceName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between my-4">
        <div>
          <h1 className="text-2xl font-bold">{resource.resourceName}</h1>
          <p className="text-muted-foreground">
            Details for resource.
          </p>
        </div>
        <div>
          <Link href={`/dashboard/operations/resources/${resource.id}/edit`}>
            <Button>Edit Resource</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Details</CardTitle>
          <CardDescription>Summary of the resource.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Resource Type</p>
              <p>{resource.resourceType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge>{resource.status}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
              <p>{resource.serialNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">MAC Address</p>
              <p>{resource.macAddress}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
              {resource.assignedTo ? (
                <Link href={resource.assignedTo.relationTo === 'subscribers' ? `/dashboard/crm/subscribers/${resource.assignedTo.value.id}` : `/dashboard/crm/buildings/${resource.assignedTo.value.id}`} className="hover:underline">
                  {resource.assignedTo.value.name}
                </Link>
              ) : (
                <span>Unassigned</span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              {resource.location ? (
                <Link href={`/dashboard/crm/buildings/${resource.location.id}`} className="hover:underline">
                  {resource.location.name}
                </Link>
              ) : (
                <span>N/A</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
