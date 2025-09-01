"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ColumnFiltersState, SortingState, VisibilityState, Table } from "@tanstack/react-table";

import { ipSubnets, ipAddresses } from "../mock-data";
import { columns } from "../ip-addresses-columns";
import { DataTable } from "@/components/data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconLayoutColumns, IconChevronDown } from "@tabler/icons-react";

const CustomToolbar = (table: Table<any>) => (
    <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
            <Input
            placeholder="Filter by IP address..."
            value={(table.getColumn("ipAddress")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("ipAddress")?.setFilterValue(event.target.value)
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

export default function SubnetDetailPage({ params }: { params: { id: string } }) {
  const subnet = ipSubnets.find((s) => s.id === params.id);

  if (!subnet) {
    notFound();
  }

  const addressesInSubnet = ipAddresses.filter((ip) => ip.subnet.id === subnet.id);

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
            <BreadcrumbLink href="/dashboard/operations">Operations</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/operations/ipam">IP Manager (IPAM)</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{subnet.network}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between my-4">
        <div>
          <h1 className="text-2xl font-bold">{subnet.network}</h1>
          <p className="text-muted-foreground">{subnet.description}</p>
        </div>
        <div>
          <Link href={`/dashboard/operations/ipam/${subnet.id}/edit`}>
            <Button>Edit Subnet</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>IP Addresses</CardTitle>
          <CardDescription>List of IP addresses in this subnet.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={addressesInSubnet} 
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
        </CardContent>
      </Card>
    </div>
  );
}