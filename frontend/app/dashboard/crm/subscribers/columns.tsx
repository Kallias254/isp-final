"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Subscriber } from "@/payload-types"
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
    case "pending-installation":
      return "bg-yellow-500 hover:bg-yellow-600"
    case "suspended":
      return "bg-orange-500 hover:bg-orange-600"
    case "deactivated":
      return "bg-red-500 hover:bg-red-600"
    default:
      return "bg-gray-500"
  }
}

export const columns: ColumnDef<Subscriber>[] = [
  {
    accessorKey: "firstName",
    header: "Full Name",
    cell: ({ row }) => {
      const { id, firstName, lastName } = row.original
      return (
        <Link href={`/dashboard/crm/subscribers/${id}`} className="text-blue-500 hover:underline">
          {`${firstName} ${lastName}`}
        </Link>
      )
    },
  },
  {
    accessorKey: "accountNumber",
    header: "Account Number",
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
    accessorKey: "servicePlan",
    header: "Service Plan",
    cell: ({ row }) => {
      const plan = row.original.servicePlan
      if (typeof plan === 'object' && plan !== null) {
        return plan.name
      }
      return plan
    },
  },
  {
    accessorKey: "nextDueDate",
    header: "Next Due Date",
    cell: ({ row }) => {
        const date = new Date(row.original.nextDueDate)
        return date.toLocaleDateString()
    }
  },
  {
    accessorKey: "accountBalance",
    header: "Account Balance",
    cell: ({ row }) => {
        const balance = row.original.accountBalance
        return balance ? `KES ${balance.toLocaleString()}` : "-"
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subscriber = row.original
 
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
              onClick={() => navigator.clipboard.writeText(subscriber.id)}
            >
              Copy subscriber ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
