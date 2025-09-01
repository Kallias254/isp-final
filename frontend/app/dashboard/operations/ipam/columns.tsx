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

export type Subnet = {
  id: string;
  network: string;
  description: string;
};

export const columns: ColumnDef<Subnet>[] = [
  {
    accessorKey: "network",
    header: "Network",
    cell: ({ row }) => {
      const subnet = row.original;
      return (
        <Link href={`/dashboard/operations/ipam/${subnet.id}`} className="hover:underline">
          {subnet.network}
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subnet = row.original;

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
              onClick={() => navigator.clipboard.writeText(subnet.id)}
            >
              Copy subnet ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View subnet details</DropdownMenuItem>
            <DropdownMenuItem>Edit subnet</DropdownMenuItem>
            <DropdownMenuItem>Delete subnet</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
