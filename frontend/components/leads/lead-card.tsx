"use client"

import * as React from "react"
import type { Lead } from "./data"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { LeadDetailDrawer } from "./lead-detail-drawer"

export function LeadCard({ lead }: { lead: Lead }) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left"
        aria-label={`Open details for ${lead.name}`}
      >
        <Card
          role="article"
          aria-label={`Lead ${lead.name}`}
          className="group rounded-lg border p-3 shadow-sm transition hover:shadow"
        >
          <div className="flex items-start justify-between gap-2">
            <h4 className="line-clamp-2 font-medium">{lead.name}</h4>
            <Badge variant="secondary" className="shrink-0">
              {lead.source ?? "—"}
            </Badge>
          </div>
          <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Assigned:</span> {lead.assignedTo ?? "Unassigned"}
            </div>
            <div>
              <span className="font-medium text-foreground">Follow-up:</span> {lead.followUpDate ?? "N/A"}
            </div>
            <div>
              <span className="font-medium text-foreground">Location:</span> {lead.location ?? "N/A"}
            </div>
          </div>
        </Card>
      </button>

      <LeadDetailDrawer leadId={lead.id} open={open} onOpenChange={setOpen} />
    </>
  )
}
