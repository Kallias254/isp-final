"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ResourcesTabs } from "@/components/resources/resources-tabs"
import { IpamSubtabs } from "@/components/resources/ipam-subtabs"
import { IpamAddSubnetSheet } from "@/components/resources/ipam-add-subnet-sheet"
import { seedSubnets, type Subnet } from "@/components/resources/ipam-data"

export default function IpamSubnetsPage() {
  const [rows, setRows] = React.useState<Subnet[]>(seedSubnets)
  const [query, setQuery] = React.useState("")

  const filtered = rows.filter((r) =>
    `${r.name} ${r.cidr} ${r.router ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  )

  function addSubnet(p: { name: string; cidr: string; gateway?: string; dns?: string; router?: string }) {
    setRows((prev) => [
      {
        id: crypto.randomUUID(),
        name: p.name,
        cidr: p.cidr,
        gateway: p.gateway,
        dns: p.dns,
        router: p.router,
        used: 0,
        capacity: 254,
      },
      ...prev,
    ])
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
                <BreadcrumbLink href="/dashboard/resources/inventory">Resources</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>IPAM</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-xl font-semibold">IP Address Management</h1>
        </div>
        <div className="mt-2 md:mt-0">
          <IpamAddSubnetSheet onCreate={addSubnet} />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <ResourcesTabs />
        <IpamSubtabs />
      </div>

      <Card className="mt-2">
        <CardHeader className="pb-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">IP Subnets</CardTitle>
            <Input
              placeholder="Type a keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:max-w-sm"
              aria-label="Search subnets"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[320px]">Name</TableHead>
                  <TableHead className="min-w-[160px]">Network</TableHead>
                  <TableHead className="min-w-[140px]">Gateway</TableHead>
                  <TableHead className="min-w-[200px]">DNS Servers</TableHead>
                  <TableHead className="min-w-[160px]">Router</TableHead>
                  <TableHead className="min-w-[160px]">Usage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No subnets found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => {
                    const pct = s.capacity ? Math.round((s.used / s.capacity) * 100) : 0
                    return (
                      <TableRow key={s.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <Link href="#">{s.name}</Link>
                        </TableCell>
                        <TableCell>{s.cidr}</TableCell>
                        <TableCell>{s.gateway ?? "N/A"}</TableCell>
                        <TableCell>{s.dns ?? "N/A"}</TableCell>
                        <TableCell>{s.router ?? "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-32">
                              <Progress value={pct} />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {s.used} / {s.capacity} ({pct}%)
                            </span>
                          </div>
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
