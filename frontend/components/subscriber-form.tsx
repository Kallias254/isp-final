'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { apiFetch } from '@/lib/api'
import { Checkbox } from '@/components/ui/checkbox'
import { UnitSelector } from './unit-selector'

// Updated schema to match the backend 'Subscribers' collection
const subscriberFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  mpesaNumber: z.string().min(10, 'M-Pesa number is required'),
  servicePlan: z.string().min(1, 'Service plan is required'),
  status: z.enum(['pending-installation', 'active', 'suspended', 'deactivated']),
  isTrial: z.boolean().default(false),
  trialDays: z.coerce.number().optional(),
  addressNotes: z.string().optional(),
  internalNotes: z.string().optional(),
})

type SubscriberFormValues = z.infer<typeof subscriberFormSchema>

export function SubscriberForm({ subscriber }: { subscriber?: any }) {
  const router = useRouter()
  const [plans, setPlans] = React.useState<any[]>([])
  const [selectedUnitId, setSelectedUnitId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await apiFetch('/plans?limit=100') // Use apiFetch
        if (!response.ok) {
          throw new Error('Failed to fetch plans')
        }
        const data = await response.json()
        setPlans(data.docs || [])
      } catch (error) {
        toast.error('Could not fetch plans.')
      }
    }
    fetchPlans()
  }, [])

  const form = useForm<SubscriberFormValues>({
    resolver: zodResolver(subscriberFormSchema),
    defaultValues: {
      firstName: subscriber?.firstName || '',
      lastName: subscriber?.lastName || '',
      mpesaNumber: subscriber?.mpesaNumber || '',
      servicePlan: subscriber?.servicePlan?.id || '',
      status: subscriber?.status || 'pending-installation',
      isTrial: subscriber?.isTrial || false,
      trialDays: subscriber?.trialDays || 0,
      addressNotes: subscriber?.addressNotes || '',
      internalNotes: subscriber?.internalNotes || '',
    },
  })

  async function onSubmit(data: SubscriberFormValues) {
    // This logic is for CREATE only. Update logic would need to be different.
    try {
      // Step 1: Create the subscriber
      const subscriberResponse = await apiFetch('/subscribers', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (!subscriberResponse.ok) {
        const errorData = await subscriberResponse.json()
        console.error('Subscriber creation error:', errorData)
        throw new Error('Failed to create subscriber')
      }

      const newSubscriber = await subscriberResponse.json();

      // Step 2: If a unit was selected, link it to the new subscriber
      if (selectedUnitId) {
        const unitResponse = await apiFetch(`/building-units/${selectedUnitId}`, {
            method: 'PATCH',
            body: JSON.stringify({ subscriber: newSubscriber.doc.id })
        });

        if (!unitResponse.ok) {
            const errorData = await unitResponse.json();
            console.error('Unit update error:', errorData);
            // This is a partial success, the subscriber was created but not linked.
            toast.warning(`Subscriber created, but failed to link building unit. Please link it manually.`);
            router.push('/dashboard/crm/subscribers');
            router.refresh();
            return;
        }
      }

      toast.success('Successfully created the subscriber.')
      router.push('/dashboard/crm/subscribers')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Could not create the subscriber.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{subscriber ? 'Edit Subscriber' : 'New Subscriber'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter first name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter last name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='mpesaNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>M-Pesa Number</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g., 254712345678' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <UnitSelector onUnitSelect={setSelectedUnitId} />

            <FormField
              control={form.control}
              name='servicePlan'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Plan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a plan' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {plans.map(plan => (
                        <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      <SelectItem value='pending-installation'>Pending Installation</SelectItem>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='suspended'>Suspended</SelectItem>
                      <SelectItem value='deactivated'>Deactivated</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isTrial'
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Enable Trial Period?
                    </FormLabel>
                    <FormDescription>
                      If checked, the subscriber will have a trial period before the first billing.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {form.watch('isTrial') && (
              <FormField
                control={form.control}
                name='trialDays'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trial Days</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name='addressNotes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address / Installation Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Any specific directions for the technician...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='internalNotes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internal Notes (Staff Only)</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Internal notes for staff... ' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type='submit'>{subscriber ? 'Update' : 'Create'} Subscriber</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}