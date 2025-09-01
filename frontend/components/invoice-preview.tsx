"use client";

import * as React from "react";
import { Invoice } from "@/app/dashboard/billing/invoices/columns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface InvoicePreviewProps {
  invoice: Invoice;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md print:shadow-none">
      <div className="flex justify-between items-start mb-8">
        <div>
          <img src="/next.svg" alt="Company Logo" className="h-12" />
          <h1 className="text-2xl font-bold mt-4">Invoice</h1>
          <p className="text-muted-foreground">{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">Your Company Inc.</h2>
          <p>123 Main Street</p>
          <p>Anytown, USA 12345</p>
          <p>yourcompany@example.com</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <h3 className="font-semibold">Bill To:</h3>
          <p>{invoice.subscriber.name}</p>
          {/* Add more subscriber details here if available */}
        </div>
        <div className="text-right">
          <p><span className="font-semibold">Invoice Date:</span> {new Date().toLocaleDateString()}</p>
          <p><span className="font-semibold">Due Date:</span> {invoice.dueDate}</p>
        </div>
      </div>

      <Separator />

      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Description</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* This is a placeholder for line items. We will need to update this when we have real data */}
            <tr>
              <td>Monthly Subscription</td>
              <td className="text-right">{new Intl.NumberFormat("en-US", { style: "currency", currency: "KES" }).format(invoice.amountDue)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Separator className="my-8" />

      <div className="flex justify-end">
        <div className="text-right">
          <p><span className="font-semibold">Total:</span> {new Intl.NumberFormat("en-US", { style: "currency", currency: "KES" }).format(invoice.amountDue)}</p>
        </div>
      </div>

      <div className="mt-12 flex justify-end space-x-4 print:hidden">
        <Button variant="outline">Send Invoice</Button>
        <Button onClick={handlePrint}>Download PDF</Button>
      </div>
    </div>
  );
}
