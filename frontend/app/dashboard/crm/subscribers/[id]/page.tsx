'use client'

import { notFound } from "next/navigation";
import { Subscriber, ServiceLocation, Plan } from "@/payload-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { subscribers } from "../mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectionStatusTab } from "./ConnectionStatusTab";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubscriberDetailPage({ params }: { params: { id: string } }) {
  const subscriber = subscribers.find(s => s.id === params.id);

  if (!subscriber) {
    notFound();
  }

  const serviceAddress = subscriber.serviceAddress as ServiceLocation;
  const servicePlan = subscriber.servicePlan as Plan;

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
            <BreadcrumbLink href="/dashboard/crm/subscribers">Subscribers</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{subscriber.firstName} {subscriber.lastName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="my-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{subscriber.firstName} {subscriber.lastName}</h1>
        <Link href={`/dashboard/crm/subscribers/${subscriber.id}/edit`}>
          <Button>Edit Subscriber</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Subscriber Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8/10</p>
            <p className="text-xs text-muted-foreground">Loyalty: 80%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Service Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{serviceAddress?.name || 'N/A'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next Due Date</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{subscriber.nextDueDate ? new Date(subscriber.nextDueDate).toLocaleDateString() : 'N/A'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{subscriber.accountBalance ? `KES ${subscriber.accountBalance.toLocaleString()}` : '-'}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="connection-status">
        <TabsList>
          <TabsTrigger value="connection-status">Connection Status</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="connection-status">
          <ConnectionStatusTab subscriberId={subscriber.id} />
        </TabsContent>
        <TabsContent value="tickets">
          <p>Tickets tab content</p>
        </TabsContent>
        <TabsContent value="messages">
          <p>Messages tab content</p>
        </TabsContent>
        <TabsContent value="billing">
          <p>Billing tab content</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}