"use client";

import * => React from "react";
import { notFound } from "next/navigation";

import { messages } from "../../mock-data";
import { MessageForm } from "../../message-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function MessageEditPage({ params }: { params: { id: string } }) {
  const message = messages.find((m) => m.id === params.id);

  if (!message) {
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
            <BreadcrumbLink href="/dashboard/support/messages">Messages</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/dashboard/support/messages/${message.id}`}>{message.recipient}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="my-4">
        <h1 className="text-2xl font-bold">Edit Message</h1>
        <p className="text-muted-foreground">Update the details of the message.</p>
      </div>

      <MessageForm initialData={message} />
    </div>
  );
}