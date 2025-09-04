'use client'

import * as React from 'react'
import { DataTable } from '@/components/data-table'
import { columns } from './units-columns'
import { BuildingUnit } from '@/payload-types'

export function UnitsDataTable({ data }: { data: BuildingUnit[] }) {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})

  return <DataTable columns={columns} data={data} rowSelection={rowSelection} setRowSelection={setRowSelection} />
}