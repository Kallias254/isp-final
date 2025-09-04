"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'

const serviceLocationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
})

type ServiceLocationFormValues = z.infer<typeof serviceLocationFormSchema>

export function ServiceLocationForm({ onSuccess }: { onSuccess?: (location: any) => void }) {
  const form = useForm<ServiceLocationFormValues>({
    resolver: zodResolver(serviceLocationFormSchema),
    defaultValues: {
      name: "",
      latitude: 0,
      longitude: 0,
    },
  })

  async function onSubmit(data: ServiceLocationFormValues) {
    try {
      const response = await fetch('/api/service-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create service location")
      }

      const newLocation = await response.json()
      toast({
        title: "Service Location Created",
        description: `Successfully created ${newLocation.doc.name}.`,
      })
      form.reset()
      if (onSuccess) {
        onSuccess(newLocation.doc)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not create service location.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Main Street Tower" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Create Location</Button>
      </form>
    </Form>
  )
}
