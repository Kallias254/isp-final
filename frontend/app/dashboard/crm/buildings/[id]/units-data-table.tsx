'use client'

import useSWR from 'swr'
import { DataTable } from '@/components/data-table'
import { columns } from './units-columns'
import { BuildingUnit } from '@/payload-types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface PayloadResponse<T> {
    docs: T[];
}

export function UnitsDataTable({ buildingId }: { buildingId: string }) {
  const { data, error } = useSWR<PayloadResponse<BuildingUnit>>(`/api/building-units?where[building][equals]=${buildingId}&limit=100`, fetcher)

  if (error) return <div>Failed to load units</div>
  if (!data) return <div>Loading...</div>

  return <DataTable columns={columns} data={data.docs} />
}
