"use client"

import * as React from "react"
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
import { Badge } from "@/components/ui/badge"
import { InventoryAddSheet } from "@/components/resources/inventory-add-sheet"
import { InventoryRowActions } from "@/components/resources/inventory-row-actions"
import { ResourcesTabs } from "@/components/resources/resources-tabs"
import { seedInventory, type InventoryItem } from "@/components/resources/inventory-data"

export default function InventoryPage() {
  const [rows, setRows] = React.useState<InventoryItem[]>(seedInventory)
  const [query, setQuery] = React.useState("")

  const filtered = rows.filter((r) =>
    `${r.name} ${r.type} ${r.status} ${r.serial ?? ""} ${r.model ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  )

  function addItem(p: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    setRows((prev) => [
      {
        id: crypto.randomUUID(),
        name: p.name,
        type: p.type,
        status: p.status,
        serial: p.serial,
        model: p.model,
        purchaseDate: p.purchaseDate,
        warrantyEnd: p.warrantyEnd,
        notes: p.notes,
        serviceLocation: p.serviceLocation,
        assignedSubscriber: p.assignedSubscriber,
      },
      ...prev,
    ])
  }

  function deleteItem(id: string) {
    setRows((prev) => prev.filter((i) => i.id !== id))
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
                <BreadcrumbPage>Resources</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Inventory</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-xl font-semibold">Inventory Management</h1>
        </div>
        <div className="mt-2 md:mt-0">
          <InventoryAddSheet onCreate={addItem} />
        </div>
      </div>

      <div className="mt-4">
        <ResourcesTabs />
      </div>

      <Card className="mt-4">
        <CardHeader className="pb-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">All Inventory Items</CardTitle>
            <Input
              placeholder="Type a keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:max-w-sm"
              aria-label="Search inventory"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[220px]">Item</TableHead>
                  <TableHead className="min-w-[120px]">Type</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="min-w-[160px]">Serial</TableHead>
                  <TableHead className="min-w-[160px]">Model</TableHead>
                  <TableHead className="min-w-[140px]">Purchase</TableHead>
                  <TableHead className="min-w-[140px]">Warranty End</TableHead>
                  <TableHead className="min-w-[180px]">Service Location</TableHead>
                  <TableHead className="min-w-[200px]">Assigned Subscriber</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground">
                      No inventory items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((i) => (
                    <TableRow key={i.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{i.name}</TableCell>
                      <TableCell>{i.type}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded">
                          {i.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{i.serial ?? "-"}</TableCell>
                      <TableCell>{i.model ?? "-"}</TableCell>
                      <TableCell>{i.purchaseDate ?? "-"}</TableCell>
                      <TableCell>{i.warrantyEnd ?? "-"}</TableCell>
                      <TableCell>{i.serviceLocation ?? "-"}</TableCell>
                      <TableCell>{i.assignedSubscriber ?? "-"}</TableCell>
                      <TableCell>
                        <InventoryRowActions onView={() => {}} onEdit={() => {}} onDelete={() => deleteItem(i.id)} />
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
