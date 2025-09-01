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

export type IpAddress = {
  id: string;
  ipAddress: string;
  subnet: {
    id: string;
    network: string;
  };
  status: string;
  assignedTo?: {
    id: string;
    name: string;
  } | null;
};

export const columns: ColumnDef<IpAddress>[] = [
  {
    accessorKey: "ipAddress",
    header: "IP Address",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
      if (status === "Assigned") {
        variant = "default";
      } else if (status === "Reserved") {
        variant = "secondary";
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const ipAddress = row.original;
      return ipAddress.assignedTo ? (
        <Link href={`/dashboard/crm/subscribers/${ipAddress.assignedTo.id}`} className="hover:underline">
          {ipAddress.assignedTo.name}
        </Link>
      ) : (
        <span>Unassigned</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ipAddress = row.original;

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
              onClick={() => navigator.clipboard.writeText(ipAddress.id)}
            >
              Copy IP address ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit IP address</DropdownMenuItem>
            <DropdownMenuItem>Delete IP address</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
