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
import { Textarea } from './ui/textarea'

const leadFormSchema = z.object({
  subscriberName: z.string().min(1, 'Name is required'),
  subscriberPhone: z.string().min(10, 'Phone number is required'),
  status: z.string().min(1, 'Status is required'),
  leadSource: z.string().optional(),
  referredBy: z.string().optional(),
  preferredPlan: z.string().optional(),
  preferredBillingCycle: z.string().optional(),
  notes: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
})

type LeadFormValues = z.infer<typeof leadFormSchema>

export function LeadForm({ lead }: { lead?: any }) {
  const router = useRouter()
  const [plans, setPlans] = React.useState<any[]>([])
  const [partners, setPartners] = React.useState<any[]>([])

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [plansResponse, partnersResponse] = await Promise.all([
          fetch('/api/plans?limit=100'),
          fetch('/api/partners?limit=100'),
        ]);

        if (!plansResponse.ok || !partnersResponse.ok) {
          throw new Error('Failed to fetch related data');
        }

        const plansData = await plansResponse.json();
        const partnersData = await partnersResponse.json();

        setPlans(plansData.docs || []);
        setPartners(partnersData.docs || []);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Could not fetch related data for the form.',
          variant: 'destructive',
        })
      }
    }
    fetchData()
  }, [])

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      subscriberName: lead?.subscriberName || '',
      subscriberPhone: lead?.subscriberPhone || '',
      status: lead?.status || 'new',
      leadSource: lead?.leadSource || '',
      referredBy: lead?.referredBy?.id || '',
      preferredPlan: lead?.preferredPlan?.id || '',
      preferredBillingCycle: lead?.preferredBillingCycle || 'monthly',
      notes: lead?.notes || '',
      location: lead?.location?.id || '',
    },
  })

  const watchLeadSource = form.watch('leadSource');

  async function onSubmit(data: LeadFormValues) {
    const method = lead ? 'PATCH' : 'POST'
    const url = lead ? `/api/leads/${lead.id}` : '/api/leads'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Submission error:', errorData)
        throw new Error(`Failed to ${lead ? 'update' : 'create'} lead`)
      }

      toast({
        title: `Lead ${lead ? 'Updated' : 'Created'}`,
        description: `Successfully ${lead ? 'updated' : 'created'} the lead.`,
      })

      router.push('/dashboard/crm/leads')
      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Could not ${lead ? 'update' : 'create'} the lead.`,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{lead ? 'Edit Lead' : 'New Lead'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                control={form.control}
                name='subscriberName'
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder='Enter full name' {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name='subscriberPhone'
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <Input placeholder='e.g., 254712345678' {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Location</FormLabel>
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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                            <SelectItem value='new'>New</SelectItem>
                            <SelectItem value='contacted'>Contacted</SelectItem>
                            <SelectItem value='qualified'>Qualified</SelectItem>
                            <SelectItem value='converted'>Converted</SelectItem>
                            <SelectItem value='lost'>Lost</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='leadSource'
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Lead Source</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder='Select source' />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value='partner-referral'>Partner Referral</SelectItem>
                            <SelectItem value='direct'>Direct</SelectItem>
                            <SelectItem value='marketing-campaign'>Marketing Campaign</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            {watchLeadSource === 'partner-referral' && (
                 <FormField
                    control={form.control}
                    name='referredBy'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referred By</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a partner' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {partners.map(partner => (
                              <SelectItem key={partner.id} value={partner.id}>{partner.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            )}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                    control={form.control}
                    name='preferredPlan'
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Preferred Plan</FormLabel>
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
                    name='preferredBillingCycle'
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Preferred Billing Cycle</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder='Select a cycle' />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value='monthly'>Monthly</SelectItem>
                            <SelectItem value='quarterly'>Quarterly</SelectItem>
                            <SelectItem value='annually'>Annually</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internal Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Add any internal notes here...'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type='submit'>{lead ? 'Update' : 'Create'} Lead</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}