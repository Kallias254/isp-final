"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusPill } from "@/components/routers/status-pill"
import { CreateRouterSheet, EditRouterSheet } from "@/components/routers/router-sheets"
import { RouterRowActions } from "@/components/routers/router-row-actions"
import type { RouterItem, RouterStatus } from "@/components/routers/data"
import { seedRouters } from "@/components/routers/data"
import { useToast } from "@/hooks/use-toast"

function nowISO() {
  return new Date().toISOString()
}

export default function RoutersPage() {
  const [rows, setRows] = React.useState<RouterItem[]>(seedRouters)
  const [query, setQuery] = React.useState("")
  const { toast } = useToast()

  const filtered = rows.filter((r) =>
    `${r.name} ${r.ip} ${r.apiUser} ${r.description ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  )

  function addRouter(values: {
    name: string
    ip: string
    apiUser: string
    apiPort: string
    apiPass: string
    description?: string
    location?: string
  }) {
    setRows((prev) => [
      {
        id: crypto.randomUUID(),
        name: values.name,
        ip: values.ip,
        apiUser: values.apiUser,
        apiPort: Number(values.apiPort || 8728),
        description: values.description,
        status: "ONLINE",
        lastChecked: nowISO(),
        location: values.location,
      },
      ...prev,
    ])
  }

  function editRouter(id: string, values: Partial<RouterItem>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...values } : r)))
  }

  function testRouter(id: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "DEGRADED" as RouterStatus, lastChecked: nowISO() } : r)),
    )
    toast({
      title: "Connection test triggered",
      description: "Simulated test complete. Update the UI with your backend result.",
    })
  }

  function deleteRouter(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

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
                <BreadcrumbPage>Routers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-xl font-semibold">Router Management</h1>
          <p className="text-sm text-muted-foreground">Manage all network routers for your ISP.</p>
        </div>
        <div className="mt-2 md:mt-0">
          <CreateRouterSheet onCreate={addRouter} />
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader className="pb-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Registered Routers</CardTitle>
            <Input
              placeholder="Type a keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:max-w-sm"
              aria-label="Search routers"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[220px]">Name</TableHead>
                  <TableHead className="min-w-[160px]">IP Address</TableHead>
                  <TableHead className="min-w-[160px]">API Username</TableHead>
                  <TableHead className="min-w-[120px]">API Port</TableHead>
                  <TableHead className="min-w-[220px]">Description</TableHead>
                  <TableHead className="min-w-[160px]">Status</TableHead>
                  <TableHead className="min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No routers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <Link href="#" className="hover:underline">
                          {r.name}
                        </Link>
                      </TableCell>
                      <TableCell>{r.ip}</TableCell>
                      <TableCell>{r.apiUser}</TableCell>
                      <TableCell>{r.apiPort}</TableCell>
                      <TableCell className="truncate" title={r.description}>
                        {r.description ?? "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <StatusPill status={r.status} />
                          <span className="mt-1 text-[10px] text-muted-foreground">
                            Last checked: {new Date(r.lastChecked).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <EditRouterSheet
                          router={r}
                          onSave={(vals) => editRouter(r.id, vals)}
                          trigger={
                            <RouterRowActions
                              onEdit={() => {}}
                              onTest={() => testRouter(r.id)}
                              onDelete={() => deleteRouter(r.id)}
                              onCopyIp={() => navigator.clipboard.writeText(r.ip)}
                            />
                          }
                        />
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
