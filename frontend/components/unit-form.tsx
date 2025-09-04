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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const unitFormSchema = z.object({
  unitNumber: z.string().min(1, 'Unit number is required'),
  building: z.string().min(1, 'Building is required'),
  status: z.string().min(1, 'Status is required'),
})

type UnitFormValues = z.infer<typeof unitFormSchema>

export function UnitForm({ unit, buildingId, onSuccess }: { unit?: any, buildingId?: string, onSuccess?: () => void }) {
  const router = useRouter()
  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
      unitNumber: unit?.unitNumber || '',
      building: unit?.building?.id || buildingId,
      status: unit?.status || 'vacant-unsurveyed',
    },
  })

  async function onSubmit(data: UnitFormValues) {
    const method = unit ? 'PATCH' : 'POST'
    const url = unit ? `/api/building-units/${unit.id}` : '/api/building-units'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${unit ? 'update' : 'create'} unit`)
      }

      toast({
        title: `Unit ${unit ? 'Updated' : 'Created'}`,
        description: `Successfully ${unit ? 'updated' : 'created'} the unit.`,
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.back()
        router.refresh()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Could not ${unit ? 'update' : 'create'} the unit.`,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{unit ? 'Edit Unit' : 'New Unit'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='unitNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Number</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter unit number' {...field} />
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
                        <SelectItem value='vacant-unsurveyed'>Vacant / Unsurveyed</SelectItem>
                        <SelectItem value='lead'>Lead</SelectItem>
                        <SelectItem value='active-subscriber'>Active Subscriber</SelectItem>
                        <SelectItem value='former-subscriber'>Former Subscriber</SelectItem>
                        <SelectItem value='do-not-solicit'>Do Not Solicit</SelectItem>
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
              <Button type='submit'>{unit ? 'Update' : 'Create'} Unit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
