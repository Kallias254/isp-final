"use client"

import * as React from "react"
import { ColumnFiltersState, SortingState, VisibilityState, Table } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import { leads } from "./mock-data"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconLayoutColumns, IconChevronDown } from "@tabler/icons-react"
import { Lead } from "@/payload-types"
import Link from "next/link"

const CustomToolbar = (table: Table<Lead>) => (
    <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
            <Input
            placeholder="Filter by name..."
            value={(table.getColumn("subscriberName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("subscriberName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
            {table
                .getAllColumns()
                .filter(
                (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                return (
                    <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                    }
                    >
                    {column.id}
                    </DropdownMenuCheckboxItem>
                )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
)

export default function LeadsPage() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  return (
    <div className="container mx-auto py-10">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard/crm">CRM</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Leads</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between my-4">
            <div>
                <h1 className="text-2xl font-bold">Leads</h1>
                <p className="text-muted-foreground">Manage your leads.</p>
            </div>
            <Link href="/dashboard/crm/leads/new">
                <Button>Create Lead</Button>
            </Link>
        </div>
      <DataTable
        columns={columns}
        data={leads}
        toolbar={CustomToolbar}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </div>
  )
}
