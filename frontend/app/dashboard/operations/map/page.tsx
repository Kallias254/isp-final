"use client";

import * as React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { topologyNodes as initialTopologyNodes } from "./mock-topology";
import NetworkMap from "@/components/network-map";

export default function NetworkMapPage() {
  const [nodes, setNodes] = React.useState(initialTopologyNodes);

  const cycleStatus = () => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        let newStatus: 'online' | 'offline' | 'warning';
        switch (node.status) {
          case 'online':
            newStatus = 'offline';
            break;
          case 'offline':
            newStatus = 'warning';
            break;
          case 'warning':
            newStatus = 'online';
            break;
          default:
            newStatus = 'online';
        }
        return { ...node, status: newStatus };
      })
    );
  };

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
            <BreadcrumbPage>Network Map</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center my-4">
        <div>
          <h1 className="text-2xl font-bold">Network Map</h1>
          <p className="text-muted-foreground">Visual representation of your network topology.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={cycleStatus}>Cycle Status</Button>
          <Link href="/dashboard/operations">
            <Button variant="outline">Back to Operations</Button>
          </Link>
        </div>
      </div>

      <div className="w-full h-[600px] border rounded-lg flex items-center justify-center">
        <NetworkMap nodes={nodes} />
      </div>
    </div>
  );
}
