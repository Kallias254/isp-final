'use client';

import { MessageForm } from "@/app/dashboard/support/messages/message-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewMessagePage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Compose New Message</CardTitle>
          <CardDescription>Fill in the details to send a new message.</CardDescription>
        </CardHeader>
        <CardContent>
          <MessageForm />
        </CardContent>
      </Card>
    </div>
  );
}