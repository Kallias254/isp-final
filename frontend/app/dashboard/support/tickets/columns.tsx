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

export type Ticket = {
  id: string;
  ticketID: string;
  subscriber: {
    id: string;
    name: string;
  };
  subject: string;
  description: string;
  status: string;
  priority: string;
  assignedTo?: {
    id: string;
    name: string;
  } | null;
};

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "ticketID",
    header: "Ticket ID",
    cell: ({ row }) => {
      const ticket = row.original;
      return (
        <Link href={`/dashboard/support/tickets/${ticket.id}`} className="hover:underline">
          {ticket.ticketID}
        </Link>
      );
    },
  },
  {
    accessorKey: "subscriber.name",
    header: "Subscriber",
    cell: ({ row }) => {
        const ticket = row.original;
        return (
            <Link href={`/dashboard/crm/subscribers/${ticket.subscriber.id}`} className="hover:underline">
                {ticket.subscriber.name}
            </Link>
        );
    }
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
      if (status === "Resolved" || status === "Closed") {
        variant = "default";
      } else if (status === "Open") {
        variant = "destructive";
      } else if (status === "In Progress") {
        variant = "secondary";
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
      if (priority === "High") {
        variant = "destructive";
      } else if (priority === "Medium") {
        variant = "secondary";
      }
      return <Badge variant={variant}>{priority}</Badge>;
    },
  },
  {
    accessorKey: "assignedTo.name",
    header: "Assigned To",
    cell: ({ row }) => {
        const ticket = row.original;
        return ticket.assignedTo ? (
            <Link href={`/dashboard/system/staff/${ticket.assignedTo.id}`} className="hover:underline">
                {ticket.assignedTo.name}
            </Link>
        ) : (
            <span>Unassigned</span>
        );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ticket = row.original;

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
              onClick={() => navigator.clipboard.writeText(ticket.id)}
            >
              Copy ticket ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View ticket details</DropdownMenuItem>
            <DropdownMenuItem>Edit ticket</DropdownMenuItem>
            <DropdownMenuItem>Delete ticket</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
