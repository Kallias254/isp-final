"use client"

import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { CreatePlanSheet } from "@/components/plans/create-plan-sheet"
import type { Plan, PlanOverallStatus, PlanSignupStatus } from "@/components/plans/data"
import { seedPlans } from "@/components/plans/data"

export default function PlansPage() {
  const [rows, setRows] = React.useState<Plan[]>(seedPlans)
  const [query, setQuery] = React.useState("")
  const [router, setRouter] = React.useState("all")
  const [signupStatus, setSignupStatus] = React.useState<"all" | PlanSignupStatus>("all")
  const [overallStatus, setOverallStatus] = React.useState<"all" | PlanOverallStatus>("all")

  function addPlan(p: {
    name: string
    price: number
    currency: string
    billingCycle: Plan["billingCycle"]
    rateLimit: string
  }) {
    setRows((prev) => [
      {
        id: p.name.toLowerCase().replace(/\s+/g, "-") + "-" + (prev.length + 1),
        name: p.name,
        price: p.price,
        currency: p.currency,
        billingCycle: p.billingCycle,
        rateLimit: p.rateLimit,
        router: "local_router",
        profile: p.name,
        subnets: [],
        signupStatus: "Active",
        overallStatus: "Enabled",
      },
      ...prev,
    ])
  }

  const filtered = rows.filter((r) => {
    const matchesQuery = `${r.name} ${r.rateLimit}`.toLowerCase().includes(query.toLowerCase())
    const matchesRouter = router === "all" || r.router === router
    const matchesSignup = signupStatus === "all" || r.signupStatus === signupStatus
    const matchesOverall = overallStatus === "all" || r.overallStatus === overallStatus
    return matchesQuery && matchesRouter && matchesSignup && matchesOverall
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
                <BreadcrumbPage>Service Plans</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-xl font-semibold">Service Plans</h1>
        </div>
        <div className="mt-2 md:mt-0">
          <CreatePlanSheet onCreate={addPlan} />
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader className="pb-0">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_200px_200px_200px_120px]">
            <Input
              placeholder="Search by plan name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search plans"
            />
            <Select value={router} onValueChange={setRouter}>
              <SelectTrigger>
                <SelectValue placeholder="All Routers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routers</SelectItem>
                <SelectItem value="local_router">local_router</SelectItem>
                <SelectItem value="core_router">core_router</SelectItem>
              </SelectContent>
            </Select>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Select value={signupStatus} onValueChange={(v) => setSignupStatus(v as any)}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <SelectTrigger>
                <SelectValue placeholder="All Signup Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Signup Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Select value={overallStatus} onValueChange={(v) => setOverallStatus(v as any)}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <SelectTrigger>
                <SelectValue placeholder="All Overall Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Overall Statuses</SelectItem>
                <SelectItem value="Enabled">Enabled</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-transparent">
              Filter
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mt-4 overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[220px]">Plan Name</TableHead>
                  <TableHead className="min-w-[160px]">Price</TableHead>
                  <TableHead className="min-w-[140px]">Rate Limit</TableHead>
                  <TableHead className="min-w-[220px]">Router / Profile</TableHead>
                  <TableHead className="min-w-[200px]">Subnets</TableHead>
                  <TableHead className="min-w-[140px]">Status (Signup)</TableHead>
                  <TableHead className="min-w-[140px]">Status (Overall)</TableHead>
                  <TableHead className="min-w-[160px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No plans match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <Link className="hover:underline" href={`/dashboard/plans/${p.id}/commercial`}>
                          {p.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {p.price.toFixed(2)} {p.currency} / {p.billingCycle.toLowerCase()}
                      </TableCell>
                      <TableCell>{p.rateLimit}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.router}</span>
                          <span className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.profile}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {p.subnets.length === 0 ? (
                            <span className="text-xs text-muted-foreground">None</span>
                          ) : (
                            p.subnets.map((s) => (
                              <Badge key={s} variant="secondary" className="rounded">
                                {s}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={p.signupStatus === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-200"}
                        >
                          {p.signupStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={p.overallStatus === "Enabled" ? "bg-blue-100 text-blue-700" : "bg-gray-200"}>
                          {p.overallStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button asChild size="sm" variant="outline" className="bg-transparent">
                            <Link href={`/dashboard/plans/${p.id}/pppoe`}>Edit PPPoE</Link>
                          </Button>
                          <Button asChild size="sm" variant="outline" className="bg-transparent">
                            <Link href={`/dashboard/plans/${p.id}/static-ip`}>Edit Static</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
