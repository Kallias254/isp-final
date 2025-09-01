"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Building } from "@/payload-types"
import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const getStatusColor = (status: string) => {
    switch (status) {
        case "prospecting":
        return "bg-blue-500 hover:bg-blue-600"
        case "negotiating":
        return "bg-yellow-500 hover:bg-yellow-600"
        case "active":
        return "bg-green-500 hover:bg-green-600"
        case "lost":
        return "bg-red-500 hover:bg-red-600"
        default:
        return "bg-gray-500"
    }
}

export const columns: ColumnDef<Building>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const { id, name } = row.original
      return (
        <Link href={`/dashboard/crm/buildings/${id}`} className="text-blue-500 hover:underline">
          {name}
        </Link>
      )
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return <Badge className={getStatusColor(status)}>{status}</Badge>
    },
  },
  {
    accessorKey: "partner",
    header: "Partner",
    cell: ({ row }) => {
      const partner = row.original.partner
      if (typeof partner === 'object' && partner !== null) {
        return partner.fullName
      }
      return partner
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const building = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(building.id)}
            >
              Copy building ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View building</DropdownMenuItem>
            <DropdownMenuItem>Edit building</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
