'use client'

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
    case "active":
      return "bg-green-500 hover:bg-green-600"
    case "prospecting":
      return "bg-yellow-500 hover:bg-yellow-600"
    case "negotiating":
      return "bg-blue-500 hover:bg-blue-600"
    case "on_hold":
      return "bg-orange-500 hover:bg-orange-600"
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return <Badge className={getStatusColor(status)}>{status}</Badge>
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
        const location = row.original.location
        if (typeof location === 'object' && location !== null) {
            return location.name
        }
        return location
    }
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
            <Link href={`/dashboard/crm/buildings/${building.id}`}>
              <DropdownMenuItem>View</DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/crm/buildings/${building.id}/edit`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]