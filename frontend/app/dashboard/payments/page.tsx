"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Payment, PaymentMethod } from "@/components/payments/data"
import { seedPayments } from "@/components/payments/data"
import { RecordPaymentDrawer } from "@/components/payments/record-payment-drawer"

function nextTxnId(count: number) {
  return `PMT-${String(count + 1).padStart(6, "0")}`
}

export default function PaymentsPage() {
  const [rows, setRows] = React.useState<Payment[]>(seedPayments)
  const [query, setQuery] = React.useState("")
  const [method, setMethod] = React.useState<"all" | PaymentMethod>("all")
  const [start, setStart] = React.useState<string>("")
  const [end, setEnd] = React.useState<string>("")

  function handleCreate(p: {
    subscriber: string
    invoiceNumber?: string
    amount: number
    method: PaymentMethod
    reference?: string
    date: string
    notes?: string
  }) {
    setRows((prev) => [
      {
        id: crypto.randomUUID(),
        txnId: p.reference?.trim() ? p.reference.trim() : nextTxnId(prev.length),
        date: p.date,
        subscriber: p.subscriber,
        invoiceNumber: p.invoiceNumber,
        amount: p.amount,
        method: p.method,
        recordedBy: "Alpha Admin",
        notes: p.notes,
      },
      ...prev,
    ])
  }

  const filtered = rows.filter((r) => {
    const matchesQuery = `${r.txnId} ${r.subscriber} ${r.invoiceNumber ?? ""} ${r.notes ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
    const matchesMethod = method === "all" || r.method === method
    const matchesStart = !start || r.date >= start
    const matchesEnd = !end || r.date <= end
    return matchesQuery && matchesMethod && matchesStart && matchesEnd
  })

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Payments</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-xl font-semibold">Payment History</h1>
          <p className="text-sm text-muted-foreground">View and manage all payment records.</p>
        </div>
        <div className="mt-2 md:mt-0">
          <RecordPaymentDrawer onCreate={handleCreate} />
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader className="pb-0">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_180px_150px_150px]">
            <Input
              placeholder="Search subscriber, ref#, notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search payments"
            />
            <Select value={method} onValueChange={(v) => setMethod(v as "all" | PaymentMethod)}>
              <SelectTrigger>
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} aria-label="Start date" />
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} aria-label="End date" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">Transaction ID</TableHead>
                  <TableHead className="min-w-[140px]">Payment Date</TableHead>
                  <TableHead className="min-w-[200px]">Subscriber</TableHead>
                  <TableHead className="min-w-[120px]">Invoice #</TableHead>
                  <TableHead className="min-w-[120px]">Amount</TableHead>
                  <TableHead className="min-w-[140px]">Method</TableHead>
                  <TableHead className="min-w-[140px]">Recorded By</TableHead>
                  <TableHead className="min-w-[240px]">Notes</TableHead>
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
                  filtered.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <Link href="#">{p.txnId}</Link>
                      </TableCell>
                      <TableCell>{p.date}</TableCell>
                      <TableCell>{p.subscriber}</TableCell>
                      <TableCell>{p.invoiceNumber ?? "-"}</TableCell>
                      <TableCell>{"KES " + p.amount.toFixed(2)}</TableCell>
                      <TableCell>{p.method}</TableCell>
                      <TableCell>{p.recordedBy}</TableCell>
                      <TableCell className="max-w-[420px] truncate" title={p.notes}>
                        {p.notes ?? "-"}
                      </TableCell>
                    </TableRow>
                  ))
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
