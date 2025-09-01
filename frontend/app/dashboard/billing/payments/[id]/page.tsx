"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { payments } from "../mock-data";
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

export default function PaymentDetailPage({ params }: { params: { id: string } }) {
  const payment = payments.find((p) => p.id === params.id);

  if (!payment) {
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
            <BreadcrumbLink href="/dashboard/billing/payments">Payments</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{payment.paymentReference}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between my-4">
        <div>
          <h1 className="text-2xl font-bold">{payment.paymentReference}</h1>
          <p className="text-muted-foreground">
            Details for payment.
          </p>
        </div>
        <div>
          <Link href={`/dashboard/billing/payments/${payment.id}/edit`}>
            <Button>Edit Payment</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Summary of the payment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Invoice</p>
              <Link href={`/dashboard/billing/invoices/${payment.invoice.id}`} className="hover:underline">
                {payment.invoice.invoiceNumber}
              </Link>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount Paid</p>
              <p>{new Intl.NumberFormat("en-US", { style: "currency", currency: "KES" }).format(payment.amountPaid)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
              <p>{payment.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Date</p>
              <p>{payment.paymentDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
