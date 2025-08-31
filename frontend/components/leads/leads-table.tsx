"use client"

import * as React from "react"
import { type Lead, getLeads } from "./data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LeadDetailDrawer } from "./lead-detail-drawer"

export function LeadsTable() {
  const [leads, setLeads] = React.useState<Lead[]>([])
  const [openId, setOpenId] = React.useState<string | null>(null)

  React.useEffect(() => {
    setLeads(getLeads())
  }, [])

  // Listen for store updates
  React.useEffect(() => {
    const onUpdated = () => setLeads(getLeads())
    const onAdded = () => setLeads(getLeads())
    window.addEventListener("lead:updated", onUpdated as EventListener)
    window.addEventListener("lead:added", onAdded as EventListener)
    return () => {
      window.removeEventListener("lead:updated", onUpdated as EventListener)
      window.removeEventListener("lead:added", onAdded as EventListener)
    }
  }, [])

  return (
    <>
      <div className="mt-4 overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[220px]">Lead Name</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
              <TableHead className="min-w-[140px]">Source</TableHead>
              <TableHead className="min-w-[160px]">Assigned To</TableHead>
              <TableHead className="min-w-[140px]">Follow-up Date</TableHead>
              <TableHead className="min-w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id} className="cursor-pointer" onClick={() => setOpenId(lead.id)}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded">
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.source ?? "—"}</TableCell>
                  <TableCell>{lead.assignedTo ?? "—"}</TableCell>
                  <TableCell>{lead.followUpDate ?? "—"}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setOpenId(lead.id)}>
                        View
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setOpenId(lead.id)}>
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {openId && <LeadDetailDrawer leadId={openId} open={!!openId} onOpenChange={(o) => !o && setOpenId(null)} />}
    </>
  )
}
