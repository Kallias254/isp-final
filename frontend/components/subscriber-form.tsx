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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { apiFetch } from '@/lib/api'
import { Checkbox } from '@/components/ui/checkbox'
import { UnitSelector } from './unit-selector'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InfoCircledIcon } from '@radix-ui/react-icons'

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
  const [selectedPlan, setSelectedPlan] = React.useState<any | null>(null)
  const [availableIps, setAvailableIps] = React.useState<any[]>([])
  const [selectedUnitId, setSelectedUnitId] = React.useState<string | null>(null)

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
      connectionType: 'pppoe', // Default connection type
    },
  })

  const handlePlanChange = async (planId: string) => {
    form.setValue('servicePlan', planId)
    const plan = plans.find(p => p.id === planId)
    setSelectedPlan(plan)

    // Reset dependent fields
    setAvailableIps([])
    form.resetField('assignedIp')
    form.resetField('connectionType')
    form.resetField('radiusUsername')
    form.resetField('radiusPassword')
    form.resetField('macAddress')

    if (plan && plan.ipAssignmentType === 'static-pool' && plan.staticIpPool) {
      try {
        // Fetch the subnet details to get the list of IPs
        const subnetResponse = await apiFetch(`/ip-subnets/${plan.staticIpPool}`)
        if (!subnetResponse.ok) throw new Error('Failed to fetch IP subnet details.')
        const subnetData = await subnetResponse.json()
        
        // Here you would ideally filter for *available* IPs.
        // For now, we'll just list all of them as a placeholder.
        // A dedicated endpoint would be better, e.g., /api/ip-subnets/:id/available-ips
        const ips = subnetData.ips || [];
        setAvailableIps(ips)

      } catch (error) {
        toast.error('Could not fetch available IPs for this plan.')
      }
    }
  }

  async function onSubmit(data: SubscriberFormValues) {
    try {
        const {
            firstName,
            lastName,
            mpesaNumber,
            servicePlan,
            status,
            isTrial,
            trialDays,
            addressNotes,
            internalNotes,
            connectionType,
            radiusUsername,
            radiusPassword,
            macAddress,
            assignedIp
        } = data;

        // This is a transactional endpoint, it doesn't exist yet.
        // We will need to create it. For now, this will fail.
        const response = await apiFetch('/api/transactions/create-subscriber-with-details', {
            method: 'POST',
            body: JSON.stringify({
                subscriberData: {
                    firstName,
                    lastName,
                    mpesaNumber,
                    servicePlan,
                    status,
                    isTrial,
                    trialDays,
                    addressNotes,
                    internalNotes,
                },
                technicalData: {
                    connectionType,
                    radiusUsername,
                    radiusPassword,
                    macAddress,
                    assignedIp,
                },
                unitId: selectedUnitId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Creation error:', errorData);
            throw new Error(errorData.message || 'Failed to create subscriber and technical details.');
        }

        toast.success('Successfully created the subscriber.');
        router.push('/dashboard/crm/subscribers');
        router.refresh();

    } catch (error: any) {
      toast.error(error.message || 'Could not create the subscriber.')
    }
  }

  const connectionType = form.watch('connectionType')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{subscriber ? 'Edit Subscriber' : 'New Subscriber'}</CardTitle>
        <CardDescription>Fill in the details to create a new subscriber and their network configuration.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            
            {/* --- Universal Basics --- */}
            <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField control={form.control} name='firstName' render={({ field }) => (<FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder='Enter first name' {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name='lastName' render={({ field }) => (<FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder='Enter last name' {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name='mpesaNumber' render={({ field }) => (<FormItem><FormLabel>M-Pesa Number</FormLabel><FormControl><Input placeholder='e.g., 254712345678' {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField
                control={form.control}
                name='servicePlan'
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Service Plan</FormLabel>
                    <Select onValueChange={handlePlanChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder='Select a plan' /></SelectTrigger></FormControl>
                        <SelectContent>{plans.map(plan => (<SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>))}</SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            {/* --- Conditional Unveiling --- */}
            {selectedPlan && (
              <>
                <Separator />
                {/* --- Connection Details --- */}
                <div className='space-y-6'>
                    <h3 className="text-lg font-medium">Connection Details</h3>
                    <FormField
                        control={form.control}
                        name="connectionType"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assignment IP Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a connection type" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="pppoe">PPPoE</SelectItem>
                                <SelectItem value="ipoe-dhcp">IPoE-DHCP</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    {connectionType === 'pppoe' && (
                        <div className="p-4 border rounded-md bg-slate-50 space-y-4">
                            <p className="text-sm font-medium">PPPoE Credentials</p>
                            <FormField control={form.control} name="radiusUsername" render={({ field }) => (<FormItem><FormLabel>PPPoE Username</FormLabel><FormControl><Input placeholder="Auto-generated if left blank" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="radiusPassword" render={({ field }) => (<FormItem><FormLabel>PPPoE Password</FormLabel><FormControl><Input placeholder="Auto-generated if left blank" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    )}
                    {connectionType === 'ipoe-dhcp' && (
                        <FormField control={form.control} name="macAddress" render={({ field }) => (<FormItem><FormLabel>MAC Address</FormLabel><FormControl><Input placeholder="Enter user's MAC Address" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    )}
                </div>

                <Separator />
                {/* --- IP Assignment --- */}
                <div className='space-y-6'>
                    <h3 className="text-lg font-medium">IP Assignment</h3>
                    {selectedPlan.ipAssignmentType === 'dynamic-pool' && (
                        <Alert>
                            <InfoCircledIcon className="h-4 w-4" />
                            <AlertTitle>Dynamic Plan</AlertTitle>
                            <AlertDescription>An IP will be assigned automatically from the linked pool when the user connects.</AlertDescription>
                        </Alert>
                    )}
                    {selectedPlan.ipAssignmentType === 'static-pool' && (
                        <FormField
                            control={form.control}
                            name="assignedIp"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assign Static IP Address</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select an available static IP" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {availableIps.length > 0 ? availableIps.map(ip => (
                                        <SelectItem key={ip.id} value={ip.address}>{ip.address}</SelectItem>
                                    )) : <p className="p-4 text-sm text-muted-foreground">No IPs available in this pool.</p>}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    )}
                </div>
                
                <Separator />
                {/* --- Network Security --- */}
                <div className='space-y-6'>
                    <h3 className="text-lg font-medium">Network Security</h3>
                    <FormItem>
                        <FormLabel>VLAN ID</FormLabel>
                        <FormControl>
                            <Input readOnly disabled value="101 (Auto-assigned for network isolation)" />
                        </FormControl>
                    </FormItem>
                </div>
              </>
            )}
            
            <Separator />
            {/* --- Other Details --- */}
            <div className='space-y-6'>
                <h3 className="text-lg font-medium">Other Details</h3>
                <UnitSelector onUnitSelect={setSelectedUnitId} />
                <FormField control={form.control} name='status' render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder='Select status' /></SelectTrigger></FormControl><SelectContent><SelectItem value='pending-installation'>Pending Installation</SelectItem><SelectItem value='active'>Active</SelectItem><SelectItem value='suspended'>Suspended</SelectItem><SelectItem value='deactivated'>Deactivated</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name='isTrial' render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Enable Trial Period?</FormLabel><FormDescription>If checked, the subscriber will have a trial period before the first billing.</FormDescription></div></FormItem>)} />
                {form.watch('isTrial') && (<FormField control={form.control} name='trialDays' render={({ field }) => (<FormItem><FormLabel>Trial Days</FormLabel><FormControl><Input type="number" placeholder="e.g., 7" {...field} /></FormControl><FormMessage /></FormItem>)} />)}
                <FormField control={form.control} name='addressNotes' render={({ field }) => (<FormItem><FormLabel>Address / Installation Notes</FormLabel><FormControl><Textarea placeholder='Any specific directions for the technician...' {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name='internalNotes' render={({ field }) => (<FormItem><FormLabel>Internal Notes (Staff Only)</FormLabel><FormControl><Textarea placeholder='Internal notes for staff... ' {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <div className='flex justify-end gap-2 pt-8'>
              <Button type='button' variant='outline' onClick={() => router.back()}>Cancel</Button>
              <Button type='submit'>{subscriber ? 'Update' : 'Create'} Subscriber</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}