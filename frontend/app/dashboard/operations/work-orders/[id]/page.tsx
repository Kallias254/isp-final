"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { workOrders } from "../mock-data";
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

export default function WorkOrderDetailPage({ params }: { params: { id: string } }) {
  const workOrder = workOrders.find((wo) => wo.id === params.id);

  if (!workOrder) {
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
            <BreadcrumbLink href="/dashboard/operations/work-orders">Work Orders</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{workOrder.orderType}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between my-4">
        <div>
          <h1 className="text-2xl font-bold">{workOrder.orderType}</h1>
          <p className="text-muted-foreground">
            Details for work order.
          </p>
        </div>
        <div>
          <Link href={`/dashboard/operations/work-orders/${workOrder.id}/edit`}>
            <Button>Edit Work Order</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Order Details</CardTitle>
          <CardDescription>Summary of the work order.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subscriber</p>
              <Link href={`/dashboard/crm/subscribers/${workOrder.subscriber.id}`} className="hover:underline">
                {workOrder.subscriber.name}
              </Link>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge>{workOrder.status}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
              {workOrder.assignedTo ? (
                <Link href={`/dashboard/system/staff/${workOrder.assignedTo.id}`} className="hover:underline">
                  {workOrder.assignedTo.name}
                </Link>
              ) : (
                <span>Unassigned</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
