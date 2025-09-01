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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component
import { Expense } from "./columns";

const formSchema = z.object({
  expenseDate: z.string(),
  category: z.enum(["Bandwidth", "Salaries", "Rent", "Utilities", "Marketing", "Equipment", "Other"]),
  vendor: z.string().optional(),
  amount: z.coerce.number().min(0, "Amount must be a positive number"),
  description: z.string().optional(),
  // receipt: z.any().optional(), // Placeholder for file upload
});

interface ExpenseFormProps {
  initialData?: Expense;
}

export function ExpenseForm({ initialData }: ExpenseFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      expenseDate: new Date().toISOString().split("T")[0],
      category: "Equipment",
      vendor: "",
      amount: 0,
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically create or update the expense data
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="expenseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Bandwidth">Bandwidth</SelectItem>
                  <SelectItem value="Salaries">Salaries</SelectItem>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vendor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Vendor" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="Amount" />
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
                <Textarea {...field} placeholder="Description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Placeholder for receipt upload */}
        <FormItem>
          <FormLabel>Receipt</FormLabel>
          <FormControl>
            <Input type="file" />
          </FormControl>
          <FormMessage />
        </FormItem>

        <Button type="submit">{initialData ? "Save Changes" : "Create Expense"}</Button>
      </form>
    </Form>
  );
}
