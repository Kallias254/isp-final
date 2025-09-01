"use client"

import { ColumnDef } from "@tanstack/react-table"

export type DashboardData = {
  id: number
  header: string
  type: string
  status: string
  reviewer: string
}

export const columns: ColumnDef<DashboardData>[] = [
  {
    accessorKey: "header",
    header: "Header",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
  },
]
