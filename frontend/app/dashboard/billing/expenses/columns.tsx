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

export type Expense = {
  id: string;
  expenseDate: string;
  category: string;
  vendor?: string;
  amount: number;
  description?: string;
};

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "expenseDate",
    header: "Date",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "KES",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const expense = row.original;
      return (
        <Link href={`/dashboard/billing/expenses/${expense.id}`} className="hover:underline">
          {expense.description}
        </Link>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const expense = row.original;

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
              onClick={() => navigator.clipboard.writeText(expense.id)}
            >
              Copy expense ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View expense details</DropdownMenuItem>
            <DropdownMenuItem>Edit expense</DropdownMenuItem>
            <DropdownMenuItem>Delete expense</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
