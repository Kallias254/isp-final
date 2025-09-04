'use client'

import { ColumnDef } from '@tanstack/react-table'
import { BuildingUnit } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export const columns: ColumnDef<BuildingUnit>[] = [
  {
    accessorKey: 'unitNumber',
    header: 'Unit Number',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary'
      if (status === 'active-subscriber') variant = 'default'
      if (status === 'lead') variant = 'outline'
      if (status === 'former-subscriber') variant = 'destructive'
      
      const statusText = status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      return <Badge variant={variant}>{statusText}</Badge>
    },
  },
  {
    id: 'link',
    header: 'Link',
    cell: ({ row }) => {
      const unit = row.original
      if (unit.subscriber) {
        const subscriberId = typeof unit.subscriber === 'object' ? unit.subscriber.id : unit.subscriber;
        return <Link href={`/dashboard/crm/subscribers/${subscriberId}`}>View Subscriber</Link>
      }
      if (unit.lead) {
        const leadId = typeof unit.lead === 'object' ? unit.lead.id : unit.lead;
        return <Link href={`/dashboard/crm/leads/${leadId}`}>View Lead</Link>
      }
      return null
    },
  },
]
