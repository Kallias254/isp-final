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

const networkDeviceFormSchema = z.object({
  deviceName: z.string().min(1, 'Device name is required'),
  deviceType: z.string().min(1, 'Device type is required'),
  ipAddress: z.string().optional().or(z.literal('')),
  macAddress: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchaseCost: z.coerce.number().optional(),
  warrantyExpiry: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  physicalLocation: z.string().min(1, 'Physical location is required'),
  notes: z.string().optional(),
  monitoringType: z.string().optional(),
  snmpCommunity: z.string().optional(),
})

type NetworkDeviceFormValues = z.infer<typeof networkDeviceFormSchema>

export function NetworkDeviceForm({ device }: { device?: any }) {
  const router = useRouter()

  const form = useForm<NetworkDeviceFormValues>({
    resolver: zodResolver(networkDeviceFormSchema),
    defaultValues: {
      deviceName: device?.deviceName || '',
      deviceType: device?.deviceType || '',
      ipAddress: device?.ipAddress || '',
      macAddress: device?.macAddress || '',
      purchaseDate: device?.purchaseDate ? new Date(device.purchaseDate).toISOString().split('T')[0] : '',
      purchaseCost: device?.purchaseCost || undefined,
      warrantyExpiry: device?.warrantyExpiry ? new Date(device.warrantyExpiry).toISOString().split('T')[0] : '',
      status: device?.status || 'offline',
      physicalLocation: device?.physicalLocation?.id || '',
      notes: device?.notes || '',
      monitoringType: device?.monitoringType || 'icmp',
      snmpCommunity: device?.snmpCommunity || '',
    },
  })

  async function onSubmit(data: NetworkDeviceFormValues) {
    const method = device ? 'PATCH' : 'POST'
    const url = device ? `/api/network-devices/${device.id}` : '/api/network-devices'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${device ? 'update' : 'create'} network device`)
      }

      toast({
        title: `Network Device ${device ? 'Updated' : 'Created'}`,
        description: `Successfully ${device ? 'updated' : 'created'} the device.`,
      })

      router.push('/dashboard/operations/network-devices')
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: `Could not ${device ? 'update' : 'create'} the device.`,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{device ? 'Edit Network Device' : 'New Network Device'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='deviceName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Name</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g., Core-Router-1' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='physicalLocation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Location</FormLabel>
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
                name='deviceType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='core-router'>Core Router</SelectItem>
                        <SelectItem value='switch'>Switch</SelectItem>
                        <SelectItem value='access-point'>Access Point</SelectItem>
                        <SelectItem value='station'>Station</SelectItem>
                        <SelectItem value='cpe'>CPE</SelectItem>
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
                        <SelectItem value='online'>Online</SelectItem>
                        <SelectItem value='offline'>Offline</SelectItem>
                        <SelectItem value='maintenance'>Maintenance</SelectItem>
                        <SelectItem value='pending'>Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='ipAddress'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., 192.168.1.1' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='macAddress'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MAC Address</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., 00:1B:44:11:3A:B7' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='monitoringType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monitoring Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='icmp'>ICMP</SelectItem>
                        <SelectItem value='icmp-snmp'>ICMP + SNMP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='snmpCommunity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SNMP Community</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='purchaseDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='purchaseCost'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Cost</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} />
                    </FormControl>
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
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Add any relevant notes...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end gap-2'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type='submit'>{device ? 'Update' : 'Create'} Device</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
