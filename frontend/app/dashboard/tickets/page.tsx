"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SlidersHorizontal } from "lucide-react"
import { type Ticket, seedTickets } from "@/components/tickets/data"
import { CreateTicketDrawer } from "@/components/tickets/create-ticket-drawer"

function nextId(count: number) {
  return `TCK-${String(count + 1).padStart(4, "0")}`
}

export default function TicketsPage() {
  const [tickets, setTickets] = React.useState<Ticket[]>(seedTickets())
  const [query, setQuery] = React.useState("")

  const filtered = tickets.filter((t) =>
    `${t.id} ${t.subject} ${t.customer ?? ""} ${t.status} ${t.priority} ${t.assignedTo ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )

  function handleCreateTicket(newTicket: Omit<Ticket, "id" | "createdAt">) {
    setTickets((prev) => [{ ...newTicket, id: nextId(prev.length), createdAt: new Date().toISOString() }, ...prev])
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
                <BreadcrumbPage>Tickets</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-xl font-semibold">Tickets</h1>
        </div>
        <div className="mt-2 md:mt-0">
          {/* Optional link back to Leads List (from reference) */}
          <Button asChild variant="outline" className="hidden sm:inline-flex bg-transparent">
            <Link href="/dashboard/leads/list">Leads List</Link>
          </Button>
        </div>
      </div>

      {/* Tickets list card */}
      <Card className="mt-4">
        <CardHeader className="pb-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">All Tickets</CardTitle>
              <Badge variant="secondary" className="rounded">
                {filtered.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <CreateTicketDrawer onCreate={handleCreateTicket} />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Type a keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:max-w-sm"
              aria-label="Search tickets"
            />
            <Button variant="outline" size="sm" className="bg-transparent">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </div>

          <div className="mt-4 overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Ticket ID</TableHead>
                  <TableHead className="min-w-[240px]">Subject</TableHead>
                  <TableHead className="min-w-[160px]">Customer</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Priority</TableHead>
                  <TableHead className="min-w-[160px]">Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No matching records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.id}</TableCell>
                      <TableCell>{t.subject}</TableCell>
                      <TableCell>{t.customer ?? "-"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded">
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{t.priority}</TableCell>
                      <TableCell>{t.assignedTo ?? "-"}</TableCell>
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
