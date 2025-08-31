"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Invoice } from "@/components/invoices/data"
import { seedInvoices } from "@/components/invoices/data"
import { GenerateInvoiceDrawer } from "@/components/invoices/generate-invoice-drawer"

function nextNumber(count: number) {
  return `INV-${String(count + 1).padStart(5, "0")}`
}

export default function InvoicesPage() {
  const [rows, setRows] = React.useState<Invoice[]>(seedInvoices)
  const [query, setQuery] = React.useState("")

  const filtered = rows.filter((r) =>
    `${r.number} ${r.subscriber} ${r.status}`.toLowerCase().includes(query.toLowerCase()),
  )

  function handleCreate(newInv: { subscriber: string; description: string; amount: number; dueDate: string }) {
    setRows((prev) => [
      {
        id: crypto.randomUUID(),
        number: nextNumber(prev.length),
        subscriber: newInv.subscriber,
        issuedDate: new Date().toISOString().slice(0, 10),
        dueDate: newInv.dueDate,
        total: newInv.amount,
        paid: 0,
        status: "Open",
      },
      ...prev,
    ])
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Invoices</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-xl font-semibold">Invoice Management</h1>
          <p className="text-sm text-muted-foreground">Manage all invoices for your ISP.</p>
        </div>
        <div className="mt-2 md:mt-0">
          <GenerateInvoiceDrawer onCreate={handleCreate} />
        </div>
      </div>

      {/* Table card */}
      <Card className="mt-4">
        <CardHeader className="pb-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Type a keyword..."
              className="w-full sm:max-w-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search invoices"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">Invoice #</TableHead>
                  <TableHead className="min-w-[220px]">Subscriber</TableHead>
                  <TableHead className="min-w-[130px]">Issued Date</TableHead>
                  <TableHead className="min-w-[130px]">Due Date</TableHead>
                  <TableHead className="min-w-[100px]">Total</TableHead>
                  <TableHead className="min-w-[100px]">Paid</TableHead>
                  <TableHead className="min-w-[100px]">Balance</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No matching records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((inv) => {
                    const balance = Math.max(inv.total - inv.paid, 0)
                    const statusVariant =
                      inv.status === "Paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : inv.status === "Overdue"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    return (
                      <TableRow key={inv.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <Link href="#">{inv.number}</Link>
                        </TableCell>
                        <TableCell>{inv.subscriber}</TableCell>
                        <TableCell>{inv.issuedDate}</TableCell>
                        <TableCell>{inv.dueDate}</TableCell>
                        <TableCell>{"KES " + inv.total.toFixed(2)}</TableCell>
                        <TableCell>{"KES " + inv.paid.toFixed(2)}</TableCell>
                        <TableCell>{"KES " + balance.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={statusVariant + " hover:opacity-90"}>{inv.status}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <p>{"© 2025. Your Company Name. All Rights Reserved."}</p>
            <p>{"Created by: Your Name/Company"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
