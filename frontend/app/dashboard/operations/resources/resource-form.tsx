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
import { subscribers } from "@/app/dashboard/crm/subscribers/mock-data";
import { buildings } from "@/app/dashboard/crm/buildings/mock-data";
import { Resource } from "./columns";

const formSchema = z.object({
  resourceName: z.string().min(1, "Resource name is required"),
  resourceType: z.enum(["Router", "Antenna", "Switch", "Cable"]),
  serialNumber: z.string().optional(),
  macAddress: z.string().optional(),
  status: z.enum(["In Stock", "Deployed", "Faulty", "Retired"]),
  assignedToId: z.string().optional(),
  locationId: z.string().optional(),
});

interface ResourceFormProps {
  initialData?: Resource;
}

export function ResourceForm({ initialData }: ResourceFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      resourceName: initialData.resourceName,
      resourceType: initialData.resourceType,
      serialNumber: initialData.serialNumber,
      macAddress: initialData.macAddress,
      status: initialData.status,
      assignedToId: initialData.assignedTo?.value.id,
      locationId: initialData.location?.id,
    } : {
      resourceName: "",
      resourceType: "Router",
      serialNumber: "",
      macAddress: "",
      status: "In Stock",
      assignedToId: undefined,
      locationId: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically create or update the resource data
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="resourceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Router-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resourceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resource type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Router">Router</SelectItem>
                  <SelectItem value="Antenna">Antenna</SelectItem>
                  <SelectItem value="Switch">Switch</SelectItem>
                  <SelectItem value="Cable">Cable</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serialNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number</FormLabel>
              <FormControl>
                <Input placeholder="Serial Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="macAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MAC Address</FormLabel>
              <FormControl>
                <Input placeholder="MAC Address" {...field} />
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
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Deployed">Deployed</SelectItem>
                  <SelectItem value="Faulty">Faulty</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
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
                        ? subscribers.find((s) => s.id === field.value)?.firstName
                        : "Select subscriber"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Subscribers">
                        {subscribers.map((s) => (
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
                            {s.firstName} {s.lastName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandGroup heading="Buildings">
                        {buildings.map((b) => (
                          <CommandItem
                            value={b.id}
                            key={b.id}
                            onSelect={() => {
                              form.setValue("assignedToId", b.id)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                b.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {b.name}
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
          name="locationId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Location</FormLabel>
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
                        ? buildings.find((b) => b.id === field.value)?.name
                        : "Select location"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search location..." />
                    <CommandList>
                      <CommandEmpty>No location found.</CommandEmpty>
                      <CommandGroup>
                        {buildings.map((b) => (
                          <CommandItem
                            value={b.id}
                            key={b.id}
                            onSelect={() => {
                              form.setValue("locationId", b.id)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                b.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {b.name}
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

        <Button type="submit">{initialData ? "Save Changes" : "Create Resource"}</Button>
      </form>
    </Form>
  );
}
