"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { invoices } from "@/app/dashboard/billing/invoices/mock-data";
import { Payment } from "./columns";

const formSchema = z.object({
  paymentReference: z.string().min(1, "Payment reference is required"),
  invoiceId: z.string({ required_error: "Please select an invoice." }),
  amountPaid: z.coerce.number().min(0, "Amount paid must be a positive number"),
  paymentMethod: z.enum(["Mpesa", "Cash", "Bank Transfer"]),
  paymentDate: z.string(),
});

interface PaymentFormProps {
  initialData?: Payment;
}

export function PaymentForm({ initialData }: PaymentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      paymentReference: initialData.paymentReference,
      invoiceId: initialData.invoice.id,
      amountPaid: initialData.amountPaid,
      paymentMethod: initialData.paymentMethod,
      paymentDate: initialData.paymentDate,
    } : {
      paymentReference: "",
      invoiceId: undefined,
      amountPaid: 0,
      paymentMethod: "Mpesa",
      paymentDate: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically create or update the payment data
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="paymentReference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Reference</FormLabel>
              <FormControl>
                <Input placeholder="e.g. MPESA_REF_123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="invoiceId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Invoice</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? invoices.find(
                            (invoice) => invoice.id === field.value
                          )?.invoiceNumber
                        : "Select invoice"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search invoice..." />
                    <CommandList>
                      <CommandEmpty>No invoice found.</CommandEmpty>
                      <CommandGroup>
                        {invoices.map((invoice) => (
                          <CommandItem
                            value={invoice.id}
                            key={invoice.id}
                            onSelect={() => {
                              form.setValue("invoiceId", invoice.id)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                invoice.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {invoice.invoiceNumber}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amountPaid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount Paid</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Mpesa">M-Pesa</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{initialData ? "Save Changes" : "Create Payment"}</Button>
      </form>
    </Form>
  );
}
