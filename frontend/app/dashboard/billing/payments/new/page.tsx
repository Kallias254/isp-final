import { PaymentForm } from "../payment-form";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";

export default function NewPaymentPage() {
  return (
    <div className="container mx-auto py-10">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard/billing">Billing</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard/billing/payments">Payments</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>New</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between my-4">
            <div>
                <h1 className="text-2xl font-bold">Create Payment</h1>
                <p className="text-muted-foreground">Enter the details of the new payment.</p>
            </div>
        </div>
      <PaymentForm />
    </div>
  );
}