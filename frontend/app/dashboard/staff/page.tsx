"use client"

import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit3, KeyRound } from "lucide-react"
import { AddStaffSheet } from "@/components/staff/add-staff-sheet"
import { EditStaffSheet } from "@/components/staff/edit-staff-sheet"
import { ChangePasswordSheet } from "@/components/staff/change-password-sheet"
import type { Staff, StaffRole, StaffStatus } from "@/components/staff/data"
import { seedStaff } from "@/components/staff/data"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Switch } from "@/components/ui/switch"

export default function StaffPage() {
  const [rows, setRows] = React.useState<Staff[]>(seedStaff)
  const [query, setQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<"all" | StaffRole>("all")
  const [statusFilter, setStatusFilter] = React.useState<"all" | StaffStatus>("all")
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  const filtered = rows.filter((r) => {
    const q = `${r.firstName} ${r.lastName} ${r.email}`.toLowerCase().includes(query.toLowerCase())
    const rf = roleFilter === "all" || r.role === roleFilter
    const sf = statusFilter === "all" || r.status === statusFilter
    return q && rf && sf
  })

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAllVisible(checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) filtered.forEach((r) => next.add(r.id))
      else filtered.forEach((r) => next.delete(r.id))
      return next
    })
  }

  function addStaff(p: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    role: StaffRole
    password: string
    active: boolean
  }) {
    setRows((prev) => [
      {
        id: crypto.randomUUID(),
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        phone: p.phone,
        role: p.role,
        status: p.active ? "Active" : "Inactive",
      },
      ...prev,
    ])
  }

  function patch(id: string, values: Partial<Staff>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...values } : r)))
  }

  function bulkUpdateStatus(status: StaffStatus) {
    setRows((prev) => prev.map((r) => (selected.has(r.id) ? { ...r, status } : r)))
    setSelected(new Set())
  }

  function bulkRemove() {
    setRows((prev) => prev.filter((r) => !selected.has(r.id)))
    setSelected(new Set())
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
                <BreadcrumbLink href="/dashboard/plans">Company</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Staff Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-xl font-semibold">Manage Staff Members</h1>
          <p className="text-sm text-muted-foreground">Manage all staff members and their roles within your ISP.</p>
        </div>
        <div className="mt-2 md:mt-0">
          <AddStaffSheet onCreate={addStaff} />
        </div>
      </div>

      {/* Filters */}
      <Card className="mt-4">
        <CardHeader className="pb-0">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px]">
            <Input
              placeholder="Search name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search staff"
            />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as any)}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
                <SelectItem value="Field">Field</SelectItem>
              </SelectContent>
            </Select>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {/* Table */}
          <div className="mt-4 overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[44px]">
                    <Checkbox
                      checked={filtered.length > 0 && filtered.every((r) => selected.has(r.id))}
                      onCheckedChange={(v) => selectAllVisible(Boolean(v))}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="min-w-[260px]">Name</TableHead>
                  <TableHead className="min-w-[260px]">Email</TableHead>
                  <TableHead className="min-w-[140px]">Phone</TableHead>
                  <TableHead className="min-w-[140px]">Role</TableHead>
                  <TableHead className="min-w-[140px]">Status</TableHead>
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
                  filtered.map((s) => {
                    const isSelected = selected.has(s.id)
                    const fullName = `${s.firstName} ${s.lastName}`.trim()
                    return (
                      <TableRow
                        key={s.id}
                        className="group hover:bg-muted/50"
                        // Removed row-level onClick that re-opened the drawer inadvertently
                      >
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelect(s.id)}
                            aria-label="Select"
                          />
                        </TableCell>

                        {/* Name cell with explicit triggers */}
                        <TableCell className="font-medium">
                          <div className="flex items-center justify-between gap-2">
                            {/* Make the name open the edit sheet explicitly */}
                            <EditStaffSheet
                              staff={s}
                              onSave={(vals) => patch(s.id, vals)}
                              trigger={
                                <button
                                  type="button"
                                  className="text-left underline-offset-4 hover:underline focus:underline"
                                  aria-label={`Edit ${fullName}`}
                                >
                                  {fullName}
                                </button>
                              }
                            />
                            <div className="invisible flex items-center gap-1 group-hover:visible">
                              <EditStaffSheet
                                staff={s}
                                onSave={(vals) => patch(s.id, vals)}
                                trigger={
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    aria-label="Edit details"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                }
                              />
                              <ChangePasswordSheet
                                onChange={() => {
                                  // no-op in demo
                                }}
                                trigger={
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    aria-label="Change password"
                                  >
                                    <KeyRound className="h-4 w-4" />
                                  </Button>
                                }
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>{s.email}</TableCell>
                        <TableCell>{s.phone && s.phone.trim() ? s.phone : "-"}</TableCell>
                        <TableCell>{s.role}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                s.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-700"
                              }
                            >
                              {s.status}
                            </Badge>
                            <Switch
                              checked={s.status === "Active"}
                              onCheckedChange={(v) => patch(s.id, { status: v ? "Active" : "Inactive" })}
                              aria-label="Toggle status"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 && (
            <div className="sticky bottom-2 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background p-3 shadow-sm">
              <div className="text-sm">
                {selected.size} selected • Tip: use inline icons to edit or change password without menus.
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="bg-transparent" onClick={() => bulkUpdateStatus("Active")}>
                  Activate
                </Button>
                <Button variant="outline" className="bg-transparent" onClick={() => bulkUpdateStatus("Inactive")}>
                  Deactivate
                </Button>
                <Button variant="outline" className="bg-transparent" onClick={() => setSelected(new Set())}>
                  Clear
                </Button>
                <Button variant="destructive" onClick={bulkRemove}>
                  Remove
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <p>{"© 2025. Your Company Name. All Rights Reserved."}</p>
            <p>{"Created by: Your Name/Company"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
