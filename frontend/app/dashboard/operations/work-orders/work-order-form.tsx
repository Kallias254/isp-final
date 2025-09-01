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
import { Textarea } from "@/components/ui/textarea";
import { subscribers } from "@/app/dashboard/crm/subscribers/mock-data";
import { staff } from "@/app/dashboard/system/staff/mock-data";
import { WorkOrder } from "./columns";

const formSchema = z.object({
  orderType: z.enum(["New Installation", "Repair", "Site Survey"]),
  subscriberId: z.string({ required_error: "Please select a subscriber." }),
  status: z.enum(["Pending", "Scheduled", "In Progress", "Completed", "Failed"]),
  assignedToId: z.string().optional(),
  notes: z.string().optional(),
});

interface WorkOrderFormProps {
  initialData?: WorkOrder;
}

export function WorkOrderForm({ initialData }: WorkOrderFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      orderType: initialData.orderType,
      subscriberId: initialData.subscriber.id,
      status: initialData.status,
      assignedToId: initialData.assignedTo?.id,
      notes: "", // notes are not in mock data
    } : {
      orderType: "New Installation",
      subscriberId: undefined,
      status: "Pending",
      assignedToId: undefined,
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically create or update the work order data
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="orderType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an order type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="New Installation">New Installation</SelectItem>
                  <SelectItem value="Repair">Repair</SelectItem>
                  <SelectItem value="Site Survey">Site Survey</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignedToId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Assigned To</FormLabel>
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
                        ? staff.find((s) => s.id === field.value)?.fullName
                        : "Select staff"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search staff..." />
                    <CommandList>
                      <CommandEmpty>No staff found.</CommandEmpty>
                      <CommandGroup>
                        {staff.map((s) => (
                          <CommandItem
                            value={s.id}
                            key={s.id}
                            onSelect={() => {
                              form.setValue("assignedToId", s.id)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                s.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {s.fullName}
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Add any notes here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{initialData ? "Save Changes" : "Create Work Order"}</Button>
      </form>
    </Form>
  );
}
