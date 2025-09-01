"use client";

import * as React from "react";
import { ColumnFiltersState, SortingState, VisibilityState, Table } from "@tanstack/react-table";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { columns, Ticket } from "./columns";
import { tickets } from "./mock-data";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconLayoutColumns, IconChevronDown } from "@tabler/icons-react";

const CustomToolbar = (table: Table<Ticket>) => (
    <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
            <Input
            placeholder="Filter by subject..."
            value={(table.getColumn("subject")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("subject")?.setFilterValue(event.target.value)
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

export default function TicketsPage() {
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
                    <BreadcrumbLink href="/dashboard/support">Support</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Tickets</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between my-4">
            <div>
                <h1 className="text-2xl font-bold">Tickets</h1>
                <p className="text-muted-foreground">Manage all support tickets in the system.</p>
            </div>
            <Link href="/dashboard/support/tickets/new">
                <Button>Add New Ticket</Button>
            </Link>
        </div>
      <DataTable
        columns={columns}
        data={tickets}
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
