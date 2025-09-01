"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { invoices } from "../mock-data";
import { InvoicePreview } from "@/components/invoice-preview";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = invoices.find((inv) => inv.id === params.id);

  if (!invoice) {
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
            <BreadcrumbLink href="/dashboard/billing">Billing</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/billing/invoices">Invoices</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{invoice.invoiceNumber}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between my-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold">{invoice.invoiceNumber}</h1>
          <p className="text-muted-foreground">
            Details for invoice {invoice.invoiceNumber}.
          </p>
        </div>
        <div>
          <Link href={`/dashboard/billing/invoices/${invoice.id}/edit`}>
            <Button>Edit Invoice</Button>
          </Link>
        </div>
      </div>

      <InvoicePreview invoice={invoice} />
    </div>
  );
}
