'use client';

import { MessageForm } from "@/app/dashboard/support/messages/message-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Mock data for demonstration. In a real application, you would fetch this from an API.
const mockMessages = [
  {
    id: "1",
    type: "sms",
    recipientType: "singleSubscriber",
    singleSubscriberId: "sub1",
    useTemplate: false,
    subject: "Welcome SMS",
    content: "Welcome to our service!",
  },
  {
    id: "2",
    type: "email",
    recipientType: "group",
    groupType: "buildings",
    groupIds: ["bld1", "bld2"],
    useTemplate: true,
    templateId: "temp1",
    subject: "Building Maintenance",
    content: "Dear residents, planned maintenance...",
  },
];

export default function EditMessagePage() {
  const params = useParams();
  const messageId = params.id as string;
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const data = mockMessages.find((msg) => msg.id === messageId);
    setInitialData(data);
    setLoading(false);
  }, [messageId]);

  if (loading) {
    return <div>Loading message...</div>;
  }

  if (!initialData) {
    return <div>Message not found.</div>;
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit Message</CardTitle>
          <CardDescription>Edit the details of the message.</CardDescription>
        </CardHeader>
        <CardContent>
          <MessageForm initialData={initialData} />
        </CardContent>
      </Card>
    </div>
  );
}