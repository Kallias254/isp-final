"use client"

import * as React from "react"
import { useEffect } from "react"
import { useRouter } from 'next/navigation'
import { ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { columns } from "./columns"
import data from "@/data.json"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default function Page() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    // You can render a loading spinner or a skeleton screen here
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl">Welcome, {user.name}</h1>
        <Button onClick={logout}>Logout</Button>
      </div>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable
            columns={columns}
            data={data}
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
      </div>
    </div>
  )
}