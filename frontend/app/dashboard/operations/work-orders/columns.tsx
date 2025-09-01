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

export type WorkOrder = {
  id: string;
  orderType: string;
  subscriber: {
    id: string;
    name: string;
  };
  status: string;
  assignedTo?: {
    id: string;
    name: string;
  } | null;
};

export const columns: ColumnDef<WorkOrder>[] = [
  {
    accessorKey: "orderType",
    header: "Order Type",
    cell: ({ row }) => {
      const workOrder = row.original;
      return (
        <Link href={`/dashboard/operations/work-orders/${workOrder.id}`} className="hover:underline">
          {workOrder.orderType}
        </Link>
      );
    },
  },
  {
    accessorKey: "subscriber.name",
    header: "Subscriber",
    cell: ({ row }) => {
        const workOrder = row.original;
        return (
            <Link href={`/dashboard/crm/subscribers/${workOrder.subscriber.id}`} className="hover:underline">
                {workOrder.subscriber.name}
            </Link>
        );
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
      if (status === "Completed") {
        variant = "default";
      } else if (status === "Failed") {
        variant = "destructive";
      } else if (status === "In Progress" || status === "Scheduled") {
        variant = "secondary";
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "assignedTo.name",
    header: "Assigned To",
    cell: ({ row }) => {
        const workOrder = row.original;
        return workOrder.assignedTo ? (
            <Link href={`/dashboard/system/staff/${workOrder.assignedTo.id}`} className="hover:underline">
                {workOrder.assignedTo.name}
            </Link>
        ) : (
            <span>Unassigned</span>
        );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const workOrder = row.original;

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
              onClick={() => navigator.clipboard.writeText(workOrder.id)}
            >
              Copy work order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View work order details</DropdownMenuItem>
            <DropdownMenuItem>Edit work order</DropdownMenuItem>
            <DropdownMenuItem>Delete work order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
