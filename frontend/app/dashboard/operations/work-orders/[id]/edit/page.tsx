"use client";

import * as React from "react";
import { notFound } from "next/navigation";

import { workOrders } from "../../mock-data";
import { WorkOrderForm } from "../../work-order-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function WorkOrderEditPage({ params }: { params: { id: string } }) {
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
            <BreadcrumbLink href={`/dashboard/operations/work-orders/${workOrder.id}`}>{workOrder.orderType}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="my-4">
        <h1 className="text-2xl font-bold">Edit Work Order</h1>
        <p className="text-muted-foreground">Update the details of the work order.</p>
      </div>

      <WorkOrderForm initialData={workOrder} />
    </div>
  );
}
