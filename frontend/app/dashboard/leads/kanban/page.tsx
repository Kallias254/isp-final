import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { KanbanBoard } from "@/components/leads/kanban-board"
import { AddLeadSheet } from "@/components/leads/add-lead-sheet"

export default function LeadsKanbanPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
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
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-xl font-semibold">Leads Kanban</h1>
          <p className="text-sm text-muted-foreground">Manage your sales pipeline.</p>
        </div>
        <div className="mt-2 flex gap-2 md:mt-0">
          <Button asChild variant="outline" className="whitespace-nowrap bg-transparent">
            <Link href="/dashboard/leads/list">List View</Link>
          </Button>
          <AddLeadSheet />
        </div>
      </div>

      <KanbanBoard />

      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <p>{"© 2025. Your Company Name. All Rights Reserved."}</p>
        <p>{"Created by: Your Name/Company"}</p>
      </div>
    </div>
  )
}
