"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { networkDevices } from "../mock-data";
import { notFound } from "next/navigation";

export default function EditNetworkDevicePage({ params }: { params: { id: string } }) {
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
            <BreadcrumbLink href={`/dashboard/operations/network-devices/${device.id}`}>{device.deviceName}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center my-4">
        <div>
          <h1 className="text-2xl font-bold">Edit {device.deviceName}</h1>
          <p className="text-muted-foreground">Update the details of this network device.</p>
        </div>
        <Link href={`/dashboard/operations/network-devices/${device.id}`}>
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="deviceName" className="text-right">
            Device Name
          </Label>
          <Input id="deviceName" defaultValue={device.deviceName} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="deviceType" className="text-right">
            Device Type
          </Label>
          <Select defaultValue={device.deviceType}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a device type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="core-router">Core Router</SelectItem>
              <SelectItem value="switch">Switch</SelectItem>
              <SelectItem value="access-point">Access Point (AP)</SelectItem>
              <SelectItem value="station">Station (Building Receiver)</SelectItem>
              <SelectItem value="cpe">Customer Premise Equipment (CPE)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="purchaseDate" className="text-right">
            Purchase Date
          </Label>
          <Input id="purchaseDate" type="date" defaultValue={device.purchaseDate} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="purchaseCost" className="text-right">
            Purchase Cost
          </Label>
          <Input id="purchaseCost" type="number" defaultValue={device.purchaseCost} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="monitoringType" className="text-right">
            Monitoring Type
          </Label>
          <Select defaultValue={device.monitoringType}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select monitoring type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="icmp">ICMP Only</SelectItem>
              <SelectItem value="icmp-snmp">ICMP + SNMP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="snmpCommunity" className="text-right">
            SNMP Community
          </Label>
          <Input id="snmpCommunity" defaultValue={device.snmpCommunity} className="col-span-3" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
