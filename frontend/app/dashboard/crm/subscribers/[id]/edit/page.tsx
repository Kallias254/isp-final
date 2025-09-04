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
import { SubscriberForm } from '@/components/subscriber-form'
import { subscribers } from '@/app/dashboard/crm/subscribers/mock-data'

export default function EditSubscriberPage({ params }: { params: { id: string } }) {
  const subscriber = subscribers.find(s => s.id === params.id)

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
            <BreadcrumbLink href='/dashboard/crm/subscribers'>Subscribers</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='my-4'>
        <h1 className='text-2xl font-bold'>Edit subscriber</h1>
        <p className='text-muted-foreground'>Update the subscriber details.</p>
      </div>
      {subscriber ? <SubscriberForm subscriber={subscriber} /> : <p>Subscriber not found</p>}
    </div>
  )
}
