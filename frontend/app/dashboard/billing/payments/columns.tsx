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

export type Payment = {
  id: string;
  paymentReference: string;
  invoice: {
    id: string;
    invoiceNumber: string;
  };
  amountPaid: number;
  paymentMethod: string;
  paymentDate: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "paymentReference",
    header: "Reference",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <Link href={`/dashboard/billing/payments/${payment.id}`} className="hover:underline">
          {payment.paymentReference}
        </Link>
      );
    },
  },
  {
    accessorKey: "invoice.invoiceNumber",
    header: "Invoice",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <Link href={`/dashboard/billing/invoices/${payment.invoice.id}`} className="hover:underline">
          {payment.invoice.invoiceNumber}
        </Link>
      );
    },
  },
  {
    accessorKey: "amountPaid",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountPaid"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "KES",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
  },
  {
    accessorKey: "paymentDate",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

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
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View payment details</DropdownMenuItem>
            <DropdownMenuItem>Edit payment</DropdownMenuItem>
            <DropdownMenuItem>Delete payment</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
