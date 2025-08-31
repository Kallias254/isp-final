import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SlidersHorizontal } from "lucide-react"
import { getLeads } from "@/components/leads/data"
import { LeadsTable } from "@/components/leads/leads-table"

export default function LeadsListPage() {
  const leads = getLeads()

  return (
    <div className="mx-auto w-full max-w-screen-2xl 2xl:max-w-[1800px] px-4 md:px-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Leads</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>List</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-xl font-semibold">Leads List</h1>
          <p className="text-sm text-muted-foreground">Manage all your sales leads.</p>
        </div>
        <div className="mt-2 md:mt-0">
          <Button asChild variant="outline" className="whitespace-nowrap bg-transparent">
            <Link href="/dashboard/leads/kanban">Kanban View</Link>
          </Button>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader className="pb-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Leads</CardTitle>
              <Badge variant="secondary" className="rounded">
                {leads.length}
              </Badge>
            </div>
            <div className="flex w-full items-center gap-2 lg:w-auto">
              <Input placeholder="Type a keyword..." className="w-full lg:w-72" aria-label="Search leads" />
              <Button variant="outline" size="sm" className="hidden sm:inline-flex bg-transparent">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LeadsTable />

          <div className="mt-3 flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <p>{"© 2025. Your Company Name. All Rights Reserved."}</p>
            <p>{"Created by: Your Name/Company"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
