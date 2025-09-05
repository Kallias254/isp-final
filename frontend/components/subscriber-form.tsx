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
import { UnitSelector } from './unit-selector'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const subscriberFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  accountNumber: z.string(),
  mpesaNumber: z.string().min(10, 'M-Pesa number is required'),
  servicePlan: z.string().min(1, 'Service plan is required'),
  billingCycle: z.string().min(1, 'Billing cycle is required'),
  status: z.string().min(1, 'Status is required'),
  serviceLocation: z.string().optional(),
  building: z.string().optional(),
  buildingUnit: z.string().optional(),
  connectionType: z.enum(['pppoe', 'ipoe', 'hotspot']).optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  macAddress: z.string().optional().refine(
    (val) => !val || /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(val),
    'Invalid MAC Address format'
  ),
  staticIpAddress: z.string().optional().refine(
    (val) => !val || /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(val),
    'Invalid IP Address format'
  ),
  freeRadiusAttributes: z.string().optional(),
})

type SubscriberFormValues = z.infer<typeof subscriberFormSchema>

export function SubscriberForm({ subscriber }: { subscriber?: any }) {
  const router = useRouter()
  const [plans, setPlans] = React.useState<any[]>([])
  const [accountNumber, setAccountNumber] = React.useState(subscriber?.accountNumber || '')

  React.useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch('/api/plans?limit=100')
        if (!response.ok) {
          throw new Error('Failed to fetch plans')
        }
        const data = await response.json()
        setPlans(data.docs || [])
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Could not fetch plans.',
          variant: 'destructive',
        })
      }
    }
    fetchPlans()

    if (!subscriber) {
      const newAccountNumber = `ACC-${Date.now()}`
      setAccountNumber(newAccountNumber)
    }
  }, [subscriber])

  const [connectionType, setConnectionType] = React.useState(subscriber?.connectionType || 'pppoe');

  const form = useForm<SubscriberFormValues>({
    resolver: zodResolver(subscriberFormSchema),
    defaultValues: {
      firstName: subscriber?.firstName || '',
      lastName: subscriber?.lastName || '',
      accountNumber: subscriber?.accountNumber || accountNumber,
      mpesaNumber: subscriber?.mpesaNumber || '',
      servicePlan: subscriber?.servicePlan?.id || '',
      billingCycle: subscriber?.billingCycle || '',
      buildingUnit: subscriber?.buildingUnit?.id || '',
      status: subscriber?.status || 'pending-installation',
      connectionType: subscriber?.connectionType || 'pppoe',
      username: subscriber?.username || '',
      password: subscriber?.password || '',
      macAddress: subscriber?.macAddress || '',
      staticIpAddress: subscriber?.staticIpAddress || '',
      freeRadiusAttributes: subscriber?.freeRadiusAttributes || '',
    },
    values: { // To update accountNumber when it's generated
        firstName: subscriber?.firstName || '',
        lastName: subscriber?.lastName || '',
        accountNumber: subscriber?.accountNumber || accountNumber,
        mpesaNumber: subscriber?.mpesaNumber || '',
        servicePlan: subscriber?.servicePlan?.id || '',
        billingCycle: subscriber?.billingCycle || '',
        buildingUnit: subscriber?.buildingUnit?.id || '',
        status: subscriber?.status || 'pending-installation',
        connectionType: subscriber?.connectionType || 'pppoe',
        username: subscriber?.username || '',
        password: subscriber?.password || '',
        macAddress: subscriber?.macAddress || '',
        staticIpAddress: subscriber?.staticIpAddress || '',
        freeRadiusAttributes: subscriber?.freeRadiusAttributes || '',
    }
  })

  async function onSubmit(data: SubscriberFormValues) {
    const method = subscriber ? 'PATCH' : 'POST'
    const url = subscriber ? `/api/subscribers/${subscriber.id}` : '/api/subscribers'

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
        throw new Error(`Failed to ${subscriber ? 'update' : 'create'} subscriber`)
      }

      toast({
        title: `Subscriber ${subscriber ? 'Updated' : 'Created'}`,
        description: `Successfully ${subscriber ? 'updated' : 'created'} the subscriber.`,
      })

      router.push('/dashboard/crm/subscribers')
      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Could not ${subscriber ? 'update' : 'create'} the subscriber.`,
        variant: 'destructive',
      })
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
            <FormField
              control={form.control}
              name='accountNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <UnitSelector />
            <FormField
              control={form.control}
              name='connectionType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connection Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setConnectionType(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select connection type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='pppoe'>PPPoE</SelectItem>
                      <SelectItem value='ipoe'>IPoE/DHCP (MAC Locked)</SelectItem>
                      <SelectItem value='hotspot'>Hotspot</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {connectionType === 'pppoe' && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter username' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type='password' placeholder='Enter password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {connectionType === 'ipoe' && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='macAddress'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MAC Address</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g., AA:BB:CC:DD:EE:FF' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='staticIpAddress'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Static IP Address</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g., 192.168.1.1' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {connectionType === 'hotspot' && (
              <div className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                  Hotspot specific fields will go here.
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name='freeRadiusAttributes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FreeRADIUS Attributes (JSON)</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Enter FreeRADIUS attributes as JSON' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                name='billingCycle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Cycle</FormLabel>
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
                        <SelectItem value='disconnected'>Disconnected</SelectItem>
                      </SelectContent>
                    </Select>
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
