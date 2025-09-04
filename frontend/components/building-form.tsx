'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ServiceLocationSelector } from './service-location-selector'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const buildingFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  status: z.string().min(1, 'Status is required'),
})

type BuildingFormValues = z.infer<typeof buildingFormSchema>

export function BuildingForm({ building, onSuccess }: { building?: any, onSuccess?: () => void }) {
  const router = useRouter()
  const form = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingFormSchema),
    defaultValues: {
      name: building?.name || '',
      location: building?.location?.id || '',
      status: building?.status || 'prospecting',
    },
  })

  async function onSubmit(data: BuildingFormValues) {
    const method = building ? 'PATCH' : 'POST'
    const url = building ? `/api/buildings/${building.id}` : '/api/buildings'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${building ? 'update' : 'create'} building`)
      }

      toast({
        title: `Building ${building ? 'Updated' : 'Created'}`,
        description: `Successfully ${building ? 'updated' : 'created'} the building.`,
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/dashboard/crm/buildings')
        router.refresh() // To see the changes in the list
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Could not ${building ? 'update' : 'create'} the building.`,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{building ? 'Edit Building' : 'New Building'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter building name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <ServiceLocationSelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value='prospecting'>Prospecting</SelectItem>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='negotiating'>Negotiating</SelectItem>
                        <SelectItem value='on_hold'>On Hold</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => onSuccess ? onSuccess() : router.back()}>
                Cancel
              </Button>
              <Button type='submit'>{building ? 'Update' : 'Create'} Building</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
