"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown, TrashIcon } from "lucide-react";

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
import { subscribers } from "@/app/dashboard/crm/subscribers/mock-data";
import { Separator } from "@/components/ui/separator";
import { Invoice } from "./columns";

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
});

const formSchema = z.object({
  subscriberId: z.string({ required_error: "Please select a subscriber." }),
  dueDate: z.string(),
  status: z.enum(["Paid", "Unpaid", "Overdue"]),
  lineItems: z.array(lineItemSchema),
});

interface InvoiceFormProps {
  initialData?: Invoice;
}

export function InvoiceForm({ initialData }: InvoiceFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      subscriberId: initialData.subscriber.id,
      dueDate: initialData.dueDate,
      status: initialData.status,
      lineItems: [{ description: "Monthly Subscription", quantity: 1, price: initialData.amountDue }], // Placeholder
    } : {
      subscriberId: undefined,
      dueDate: "",
      status: "Unpaid",
      lineItems: [{ description: "", quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically create or update the invoice data
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="subscriberId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Subscriber</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={!!initialData} // Disable if editing
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? subscribers.find(
                            (subscriber) => subscriber.id === field.value
                          )?.firstName
                        : "Select subscriber"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search subscriber..." />
                    <CommandList>
                      <CommandEmpty>No subscriber found.</CommandEmpty>
                      <CommandGroup>
                        {subscribers.map((subscriber) => (
                          <CommandItem
                            value={subscriber.id}
                            key={subscriber.id}
                            onSelect={() => {
                              form.setValue("subscriberId", subscriber.id)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                subscriber.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {subscriber.firstName} {subscriber.lastName}
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
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div>
          <h2 className="text-xl font-bold">Line Items</h2>
          <div className="space-y-4 mt-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name={`lineItems.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className={index !== 0 ? "sr-only" : ""}>Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`lineItems.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={index !== 0 ? "sr-only" : ""}>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="Quantity" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`lineItems.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={index !== 0 ? "sr-only" : ""}>Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="Price" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => append({ description: "", quantity: 1, price: 0 })}
          >
            Add Line Item
          </Button>
        </div>

        <Separator />

        <Button type="submit">{initialData ? "Save Changes" : "Create Invoice"}</Button>
      </form>
    </Form>
  );
}