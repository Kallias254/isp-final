import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Resource = {
  id: string
  deviceName: string
  deviceType: string
  status: "active" | "inactive" | "maintenance"
  physicalLocation: { id: string; name: string; latitude: number; longitude: number; ispOwner: string; createdAt: string; updatedAt: string; }
}

export const columns: ColumnDef<Resource>[] = [
  {
    accessorKey: "deviceName",
    header: "Resource Name",
    cell: ({ row }) => {
      const resource = row.original;
      return (
        <Link href={`/dashboard/operations/network-devices/${resource.id}`}>
          {resource.deviceName}
        </Link>
      );
    },
  },
  {
    accessorKey: "resourceType",
    header: "Resource Type",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "physicalLocation.name",
    header: "Location",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const resource = row.original

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
              onClick={() => navigator.clipboard.writeText(resource.id)}
            >
              Copy Resource ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Resource</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
