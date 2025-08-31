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
import { AddLocationSheet } from "@/components/locations/add-location-sheet"
import { seedLocations, type ServiceLocation } from "@/components/locations/data"
import { LocationRowActions } from "@/components/locations/location-row-actions"

export default function ServiceLocationsPage() {
  const [rows, setRows] = React.useState<ServiceLocation[]>(seedLocations)
  const [query, setQuery] = React.useState("")

  const filtered = rows.filter((r) =>
    `${r.name} ${r.address ?? ""} ${r.caretaker ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  )

  function handleCreate(payload: {
    name: string
    address?: string
    lat?: number
    lng?: number
    notes?: string
    contacts: { name: string; role?: string; phone?: string }[]
  }) {
    setRows((prev) => [
      {
        id: crypto.randomUUID(),
        name: payload.name,
        address: payload.address,
        lat: payload.lat,
        lng: payload.lng,
        caretaker: payload.contacts[0]?.name,
        notes: payload.notes,
        contacts: payload.contacts.map((c) => ({ id: crypto.randomUUID(), ...c })),
      },
      ...prev,
    ])
  }

  function deleteLoc(id: string) {
    setRows((prev) => prev.filter((l) => l.id !== id))
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
                <BreadcrumbPage>Service Locations</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-xl font-semibold">Service Locations</h1>
          <p className="text-sm text-muted-foreground">
            Manage physical service locations (e.g., apartment buildings, estates).
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <AddLocationSheet onCreate={handleCreate} />
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader className="pb-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">All Locations</CardTitle>
            <Input
              placeholder="Type a keyword..."
              className="w-full sm:max-w-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search locations"
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="mt-4 overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[240px]">Name</TableHead>
                  <TableHead className="min-w-[280px]">Address</TableHead>
                  <TableHead className="min-w-[120px]">Latitude</TableHead>
                  <TableHead className="min-w-[120px]">Longitude</TableHead>
                  <TableHead className="min-w-[180px]">Caretaker</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
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
                  filtered.map((l) => (
                    <TableRow key={l.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <Link href="#">{l.name}</Link>
                      </TableCell>
                      <TableCell className="truncate" title={l.address}>
                        {l.address ?? "-"}
                      </TableCell>
                      <TableCell>{typeof l.lat === "number" ? l.lat.toFixed(6) : "-"}</TableCell>
                      <TableCell>{typeof l.lng === "number" ? l.lng.toFixed(6) : "-"}</TableCell>
                      <TableCell>{l.caretaker ?? "-"}</TableCell>
                      <TableCell>
                        <LocationRowActions
                          onEdit={() => {}}
                          onCenter={() => {
                            // placeholder: center the map on /dashboard/network-map if you maintain shared state
                          }}
                          onDelete={() => deleteLoc(l.id)}
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
