"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export type Resource = {
  id: string;
  resourceName: string;
  resourceType: string;
  serialNumber?: string;
  macAddress?: string;
  status: string;
  assignedTo?: {
    relationTo: "subscribers" | "buildings";
    value: {
      id: string;
      name: string;
    };
  } | null;
  location?: {
    id: string;
    name: string;
  } | null;
};

export const columns: ColumnDef<Resource>[] = [
  {
    accessorKey: "resourceName",
    header: "Name",
    cell: ({ row }) => {
      const resource = row.original;
      return (
        <Link href={`/dashboard/operations/resources/${resource.id}`} className="hover:underline">
          {resource.resourceName}
        </Link>
      );
    },
  },
  {
    accessorKey: "resourceType",
    header: "Type",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  {
    accessorKey: "macAddress",
    header: "MAC Address",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
      if (status === "Deployed") {
        variant = "default";
      } else if (status === "Faulty" || status === "Retired") {
        variant = "destructive";
      } else if (status === "In Stock") {
        variant = "secondary";
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const resource = row.original;
      if (!resource.assignedTo) {
        return <span>Unassigned</span>;
      }
      const link = resource.assignedTo.relationTo === "subscribers" ? `/dashboard/crm/subscribers/${resource.assignedTo.value.id}` : `/dashboard/crm/buildings/${resource.assignedTo.value.id}`;
      return (
        <Link href={link} className="hover:underline">
          {resource.assignedTo.value.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
        const resource = row.original;
        return resource.location ? (
            <Link href={`/dashboard/crm/buildings/${resource.location.id}`} className="hover:underline">
                {resource.location.name}
            </Link>
        ) : (
            <span>N/A</span>
        );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const resource = row.original;

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
              Copy resource ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View resource details</DropdownMenuItem>
            <DropdownMenuItem>Edit resource</DropdownMenuItem>
            <DropdownMenuItem>Delete resource</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
