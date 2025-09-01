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

export type Invoice = {
  id: string;
  invoiceNumber: string;
  subscriber: {
    id: string;
    name: string;
  };
  amountDue: number;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Overdue";
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice #",
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <Link href={`/dashboard/billing/invoices/${invoice.id}`} className="hover:underline">
          {invoice.invoiceNumber}
        </Link>
      );
    },
  },
  {
    accessorKey: "subscriber.name",
    header: "Subscriber",
  },
  {
    accessorKey: "amountDue",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountDue"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "KES",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
      if (status === "Paid") {
        variant = "default";
      } else if (status === "Overdue") {
        variant = "destructive";
      } else {
        variant = "secondary";
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;

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
              onClick={() => navigator.clipboard.writeText(invoice.id)}
            >
              Copy invoice ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View subscriber</DropdownMenuItem>
            <DropdownMenuItem>View invoice details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];