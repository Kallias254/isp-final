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
import { Ticket } from "./columns";

const formSchema = z.object({
  ticketID: z.string().min(1, "Ticket ID is required"),
  subscriberId: z.string({ required_error: "Please select a subscriber." }),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["Open", "In Progress", "Resolved", "Closed"]),
  priority: z.enum(["Low", "Medium", "High"]),
  assignedToId: z.string().optional(),
});

interface TicketFormProps {
  initialData?: Ticket;
}

export function TicketForm({ initialData }: TicketFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ticketID: initialData.ticketID,
      subscriberId: initialData.subscriber.id,
      subject: initialData.subject,
      description: initialData.description,
      status: initialData.status,
      priority: initialData.priority,
      assignedToId: initialData.assignedTo?.id,
    } : {
      ticketID: "",
      subscriberId: undefined,
      subject: "",
      description: "",
      status: "Open",
      priority: "Medium",
      assignedToId: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically create or update the ticket data
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="ticketID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g. TKT-001" {...field} />
              </FormControl>
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
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Internet not working" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the issue..." {...field} />
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
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
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

        <Button type="submit">{initialData ? "Save Changes" : "Create Ticket"}</Button>
      </form>
    </Form>
  );
}
