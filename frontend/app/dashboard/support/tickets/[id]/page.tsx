"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { tickets } from "../mock-data";
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

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const ticket = tickets.find((t) => t.id === params.id);

  if (!ticket) {
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
            <BreadcrumbLink href="/dashboard/support">Support</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/support/tickets">Tickets</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{ticket.ticketID}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between my-4">
        <div>
          <h1 className="text-2xl font-bold">{ticket.ticketID} - {ticket.subject}</h1>
          <p className="text-muted-foreground">
            Details for ticket.
          </p>
        </div>
        <div>
          <Link href={`/dashboard/support/tickets/${ticket.id}/edit`}>
            <Button>Edit Ticket</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
          <CardDescription>Summary of the ticket.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subscriber</p>
              <Link href={`/dashboard/crm/subscribers/${ticket.subscriber.id}`} className="hover:underline">
                {ticket.subscriber.name}
              </Link>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge>{ticket.status}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Priority</p>
              <Badge>{ticket.priority}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
              {ticket.assignedTo ? (
                <Link href={`/dashboard/system/staff/${ticket.assignedTo.id}`} className="hover:underline">
                  {ticket.assignedTo.name}
                </Link>
              ) : (
                <span>Unassigned</span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subject</p>
              <p>{ticket.subject}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p>{ticket.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
