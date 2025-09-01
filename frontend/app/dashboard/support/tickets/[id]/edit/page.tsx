"use client";

import * as React from "react";
import { notFound } from "next/navigation";

import { tickets } from "../../mock-data";
import { TicketForm } from "../../ticket-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function TicketEditPage({ params }: { params: { id: string } }) {
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
            <BreadcrumbLink href={`/dashboard/support/tickets/${ticket.id}`}>{ticket.ticketID}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="my-4">
        <h1 className="text-2xl font-bold">Edit Ticket {ticket.ticketID}</h1>
        <p className="text-muted-foreground">Update the details of the ticket.</p>
      </div>

      <TicketForm initialData={ticket} />
    </div>
  );
}
