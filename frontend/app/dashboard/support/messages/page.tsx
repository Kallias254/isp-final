'use client';

import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for demonstration
const mockMessages = [
  {
    id: "1",
    type: "sms",
    recipientType: "singleSubscriber",
    subject: "Welcome SMS",
    dateSent: "2025-08-28",
    status: "Sent",
  },
  {
    id: "2",
    type: "email",
    recipientType: "group",
    subject: "Building Maintenance",
    dateSent: "2025-08-27",
    status: "Sent",
  },
  {
    id: "3",
    type: "push",
    recipientType: "unregisteredUser",
    subject: "New Feature Alert",
    dateSent: "2025-08-26",
    status: "Delivered",
  },
];

export default function MessagesPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Messages</h1>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/dashboard/support/messages/new">
            <Button size="sm">Compose New Message</Button>
          </Link>
        </div>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sent Messages</CardTitle>
          <CardDescription>A list of all sent messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={mockMessages} />
        </CardContent>
      </Card>
    </div>
  );
}