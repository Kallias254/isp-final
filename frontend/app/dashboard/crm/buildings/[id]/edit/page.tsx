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
import { BuildingForm } from '@/components/building-form'
import { toast } from '@/components/ui/use-toast'

export default function EditBuildingPage({ params }: { params: { id: string } }) {
  const [building, setBuilding] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchBuilding() {
      try {
        const response = await fetch(`/api/buildings/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch building data')
        }
        const data = await response.json()
        setBuilding(data)
      } catch (err: any) {
        setError(err.message)
        toast({
          title: 'Error',
          description: 'Could not fetch building data.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBuilding()
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
            <BreadcrumbLink href='/dashboard/crm/buildings'>Buildings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='my-4'>
        <h1 className='text-2xl font-bold'>Edit building</h1>
        <p className='text-muted-foreground'>Update the building details.</p>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className='text-destructive'>{error}</p>}
      {!loading && !error && building && <BuildingForm building={building} />}
    </div>
  )
}
