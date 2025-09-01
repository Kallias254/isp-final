"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Subnet } from "./columns";

const formSchema = z.object({
  network: z.string().min(1, "Network is required"),
  description: z.string().min(1, "Description is required"),
});

interface SubnetFormProps {
  initialData?: Subnet;
}

export function SubnetForm({ initialData }: SubnetFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      network: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically create or update the subnet data
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="network"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 192.168.1.0/24" {...field} />
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
                <Input placeholder="e.g. Main office subnet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{initialData ? "Save Changes" : "Create Subnet"}</Button>
      </form>
    </Form>
  );
}
