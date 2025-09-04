'use client'

import * as React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { LeadForm } from '@/components/lead-form'
import { toast } from '@/components/ui/use-toast'

export default function EditLeadPage({ params }: { params: { id: string } }) {
  const [lead, setLead] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchLead() {
      try {
        const response = await fetch(`/api/leads/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch lead data')
        }
        const data = await response.json()
        setLead(data)
      } catch (err: any) {
        setError(err.message)
        toast({
          title: 'Error',
          description: 'Could not fetch lead data.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLead()
  }, [params.id])

  return (
    <div className='container mx-auto py-10'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/dashboard/crm'>CRM</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/dashboard/crm/leads'>Leads</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='my-4'>
        <h1 className='text-2xl font-bold'>Edit lead</h1>
        <p className='text-muted-foreground'>Update the lead details.</p>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className='text-destructive'>{error}</p>}
      {!loading && !error && lead && <LeadForm lead={lead} />}
    </div>
  )
}
