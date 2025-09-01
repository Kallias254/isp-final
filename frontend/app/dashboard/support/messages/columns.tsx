import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Message = {
  id: string;
  recipientType: string;
  subject: string;
  type: "sms" | "email" | "push";
  dateSent: string;
  status: string;
};

export const columns: ColumnDef<Message>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type: string = row.getValue("type");
      return type.toUpperCase();
    },
  },
  {
    accessorKey: "recipientType",
    header: "Recipient Type",
  },
  {
    accessorKey: "dateSent",
    header: "Date Sent",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const message = row.original;

      return (
        <Link href={`/dashboard/support/messages/detail/${message.id}`}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            View
          </Button>
        </Link>
      );
    },
  },
];