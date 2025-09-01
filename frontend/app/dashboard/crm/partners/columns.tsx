"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Partner } from "@/payload-types"
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
        case "prospect":
        return "bg-blue-500 hover:bg-blue-600"
        case "active":
        return "bg-green-500 hover:bg-green-600"
        case "inactive":
        return "bg-red-500 hover:bg-red-600"
        default:
        return "bg-gray-500"
    }
}

export const columns: ColumnDef<Partner>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const { id, fullName } = row.original
      return (
        <Link href={`/dashboard/crm/partners/${id}`} className="text-blue-500 hover:underline">
          {fullName}
        </Link>
      )
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
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
    accessorKey: "commissionRate",
    header: "Commission Rate",
    cell: ({ row }) => {
        const rate = row.original.commissionRate
        return rate ? `${rate}%` : "-"
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const partner = row.original
 
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
              onClick={() => navigator.clipboard.writeText(partner.id)}
            >
              Copy partner ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View partner</DropdownMenuItem>
            <DropdownMenuItem>Edit partner</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
