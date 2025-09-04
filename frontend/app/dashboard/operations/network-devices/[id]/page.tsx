'use client'

import { notFound } from "next/navigation";
import { NetworkDevice, ServiceLocation } from "@/payload-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resources } from "../mock-data";

export default function NetworkDeviceDetailPage({ params }: { params: { id: string } }) {
  const device = resources.find(d => d.id === params.id);

  if (!device) {
    notFound();
  }

  const physicalLocation = device.physicalLocation as ServiceLocation;

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
            <BreadcrumbLink href="/dashboard/operations/network-devices">Device Inventory</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{device.deviceName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="my-4">
        <h1 className="text-2xl font-bold">{device.deviceName}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Device Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Device Type:</p>
              <p>{device.deviceType}</p>
            </div>
            <div>
              <p className="font-semibold">IP Address:</p>
              <p>{typeof device.ipAddress === 'object' && device.ipAddress?.ipAddress}</p>
            </div>
            <div>
              <p className="font-semibold">Physical Location:</p>
              <p>{physicalLocation?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Monitoring Type:</p>
              <p>{device.monitoringType}</p>
            </div>
            {device.purchaseDate && (
              <div>
                <p className="font-semibold">Purchase Date:</p>
                <p>{new Date(device.purchaseDate).toLocaleDateString()}</p>
              </div>
            )}
            {device.purchaseCost && (
                <div>
                    <p className="font-semibold">Purchase Cost:</p>
                    <p>{device.purchaseCost}</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}