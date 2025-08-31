import type { ReactNode } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPlanById } from "@/components/plans/data"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function PlanLayout({ children, params }: { children: ReactNode; params: { id: string } }) {
  const plan = getPlanById(params.id)
  if (!plan) notFound()

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/plans">Service Plans</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit: {plan.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 truncate text-xl font-semibold">Edit Plan: {plan.name}</h1>
        </div>
        <Button asChild variant="outline" className="bg-transparent">
          <Link href="/dashboard/plans">Back to Plans List</Link>
        </Button>
      </div>

      <div className="mt-4">
        <Tabs value={undefined} className="w-full">
          <TabsList className="h-auto flex-wrap justify-start gap-2">
            <TabsTrigger asChild value="commercial">
              <Link href={`/dashboard/plans/${plan.id}/commercial`}>Commercial Details</Link>
            </TabsTrigger>
            <TabsTrigger asChild value="pppoe">
              <Link href={`/dashboard/plans/${plan.id}/pppoe`}>PPPoE Settings</Link>
            </TabsTrigger>
            <TabsTrigger asChild value="static-ip">
              <Link href={`/dashboard/plans/${plan.id}/static-ip`}>Static IP Settings</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  )
}
