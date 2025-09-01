"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { expenses } from "../mock-data";
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

export default function ExpenseDetailPage({ params }: { params: { id: string } }) {
  const expense = expenses.find((exp) => exp.id === params.id);

  if (!expense) {
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
            <BreadcrumbLink href="/dashboard/billing/expenses">Expenses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{expense.description}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between my-4">
        <div>
          <h1 className="text-2xl font-bold">{expense.description}</h1>
          <p className="text-muted-foreground">
            Details for expense.
          </p>
        </div>
        <div>
          <Link href={`/dashboard/billing/expenses/${expense.id}/edit`}>
            <Button>Edit Expense</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>Summary of the expense.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expense Date</p>
              <p>{expense.expenseDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <p>{expense.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vendor</p>
              <p>{expense.vendor || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p>{new Intl.NumberFormat("en-US", { style: "currency", currency: "KES" }).format(expense.amount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
