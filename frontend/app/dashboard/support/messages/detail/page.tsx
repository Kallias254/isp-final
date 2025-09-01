'use client';

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
    subject: "Welcome SMS",
    content: "Welcome to our service!",
    dateSent: "2025-08-28",
    status: "Sent",
    triggerEvent: "New Subscriber",
    sender: "Admin User",
  },
  {
    id: "2",
    type: "email",
    recipientType: "group",
    groupType: "buildings",
    groupIds: ["bld1", "bld2"],
    subject: "Building Maintenance",
    content: "Dear residents, planned maintenance...",
    dateSent: "2025-08-27",
    status: "Sent",
    triggerEvent: "Scheduled",
    sender: "System",
  },
];

export default function MessageDetailPage() {
  const params = useParams();
  const messageId = params.id as string;
  const [message, setMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const data = mockMessages.find((msg) => msg.id === messageId);
    setMessage(data);
    setLoading(false);
  }, [messageId]);

  if (loading) {
    return <div>Loading message details...</div>;
  }

  if (!message) {
    return <div>Message not found.</div>;
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Message Details</CardTitle>
          <CardDescription>Full details of the sent message.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <strong>Type:</strong> {message.type.toUpperCase()}
          </div>
          <div>
            <strong>Recipient Type:</strong> {message.recipientType}
          </div>
          {message.recipientType === "singleSubscriber" && (
            <div>
              <strong>Subscriber ID:</strong> {message.singleSubscriberId}
            </div>
          )}
          {message.recipientType === "unregisteredUser" && (
            <>
              <div>
                <strong>Contact:</strong> {message.unregisteredContact}
              </div>
              {message.unregisteredName && (
                <div>
                  <strong>Name:</strong> {message.unregisteredName}
                </div>
              )}
            </>
          )}
          {message.recipientType === "group" && (
            <>
              <div>
                <strong>Group Type:</strong> {message.groupType}
              </div>
              {message.groupIds && message.groupIds.length > 0 && (
                <div>
                  <strong>Group IDs:</strong> {message.groupIds.join(", ")}
                </div>
              )}
            </>
          )}
          <div>
            <strong>Subject:</strong> {message.subject}
          </div>
          <div>
            <strong>Content:</strong> <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <div>
            <strong>Date Sent:</strong> {message.dateSent}
          </div>
          <div>
            <strong>Status:</strong> {message.status}
          </div>
          <div>
            <strong>Trigger Event:</strong> {message.triggerEvent}
          </div>
          <div>
            <strong>Sender:</strong> {message.sender}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}