"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { networkDevices } from "./mock-data";

export default function NetworkDeviceDetailPage({ params }: { params: { id: string } }) {
  const device = networkDevices.find((d) => d.id === params.id);

  if (!device) {
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
            <BreadcrumbLink href="/dashboard/operations/network-devices">Network Devices</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{device.deviceName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center my-4">
        <div>
          <h1 className="text-2xl font-bold">{device.deviceName}</h1>
          <p className="text-muted-foreground">Network Device Details</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/operations/network-devices">
            <Button variant="outline">Back</Button>
          </Link>
          <Link href={`/dashboard/operations/network-devices/${device.id}/edit`}>
            <Button>Edit</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Type:</strong> {device.deviceType}</p>
            <p><strong>Purchase Date:</strong> {device.purchaseDate}</p>
            <p><strong>Purchase Cost:</strong> ${device.purchaseCost}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Monitoring Type:</strong> {device.monitoringType}</p>
            <p><strong>SNMP Community:</strong> {device.snmpCommunity}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
