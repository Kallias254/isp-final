'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Lead } from "@/payload-types"
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
    case "new":
      return "bg-blue-500 hover:bg-blue-600"
    case "contacted":
      return "bg-yellow-500 hover:bg-yellow-600"
    case "qualified":
      return "bg-green-500 hover:bg-green-600"
    case "converted":
      return "bg-purple-500 hover:bg-purple-600"
    case "lost":
      return "bg-red-500 hover:bg-red-600"
    default:
      return "bg-gray-500"
  }
}

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "subscriberName",
    header: "Name",
    cell: ({ row }) => {
      const { id, subscriberName } = row.original
      return (
        <Link href={`/dashboard/crm/leads/${id}`} className="text-blue-500 hover:underline">
          {subscriberName}
        </Link>
      )
    },
  },
  {
    accessorKey: "subscriberPhone",
    header: "Phone",
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
    accessorKey: "leadSource",
    header: "Source",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lead = row.original
 
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
              onClick={() => navigator.clipboard.writeText(lead.id)}
            >
              Copy lead ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`/dashboard/crm/leads/${lead.id}`}>
              <DropdownMenuItem>View</DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/crm/leads/${lead.id}/edit`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
