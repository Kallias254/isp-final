"use client"

import * as React from "react"
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type Lead, type LeadStatus, STATUSES, getLeads } from "./data"
import { LeadCard } from "./lead-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab">
      {children}
    </div>
  )
}

export function KanbanBoard() {
  const [items, setItems] = React.useState<Lead[]>(getLeads())
  const [agent, setAgent] = React.useState<string>("all")
  const [location, setLocation] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [query, setQuery] = React.useState("")

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const agents = React.useMemo(() => Array.from(new Set(items.map((l) => l.assignedTo).filter(Boolean))), [items])
  const locations = React.useMemo(() => Array.from(new Set(items.map((l) => l.location).filter(Boolean))), [items])

  // Listen for new leads created by AddLeadSheet and inject into the board.
  React.useEffect(() => {
    function handleCreated(e: Event) {
      const evt = e as CustomEvent<Lead>
      const lead = evt.detail
      if (!lead?.id) return
      setItems((prev) => [lead, ...prev])
    }
    window.addEventListener("lead:created", handleCreated as EventListener)
    return () => window.removeEventListener("lead:created", handleCreated as EventListener)
  }, [])

  const filtered = React.useMemo(() => {
    return items.filter((l) => {
      const matchesAgent = agent === "all" || l.assignedTo === agent
      const matchesLoc = location === "all" || l.location === location
      const matchesStatus = statusFilter === "all" || l.status === (statusFilter as LeadStatus)
      const matchesQuery = !query || `${l.name} ${l.assignedTo} ${l.source}`.toLowerCase().includes(query.toLowerCase())
      return matchesAgent && matchesLoc && matchesStatus && matchesQuery
    })
  }, [items, agent, location, statusFilter, query])

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const [type, id] = String(active.id).split(":") // "card:l1"
    if (type !== "card") return
    const overStatus = String(over.id).startsWith("col:") ? (String(over.id).split(":")[1] as LeadStatus) : undefined
    if (!overStatus) return

    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, status: overStatus } : l)))
  }

  return (
    <>
      {/* Filters */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="grid gap-1">
          <label className="text-xs font-medium text-muted-foreground">Filter by Sales Agent</label>
          <Select value={agent} onValueChange={setAgent}>
            <SelectTrigger>
              <SelectValue placeholder="All Agents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {agents.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1">
          <label className="text-xs font-medium text-muted-foreground">Filter by Service Location</label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1">
          <label className="text-xs font-medium text-muted-foreground">Filter by Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search inline */}
      <div className="mt-3">
        <Input
          placeholder="Search leads..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search leads"
          className="max-w-sm"
        />
      </div>

      {/* Board */}
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2" role="region" aria-label="Kanban board columns">
          {STATUSES.map((status) => {
            const columnLeads = filtered.filter((l) => l.status === status)
            return (
              <Card key={status} id={`col:${status}`} className="min-w-[320px] flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {status}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SortableContext
                    items={columnLeads.map((l) => `card:${l.id}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid gap-3">
                      {columnLeads.map((lead) => (
                        <SortableItem key={`card:${lead.id}`} id={`card:${lead.id}`}>
                          <LeadCard lead={lead} />
                        </SortableItem>
                      ))}
                      {columnLeads.length === 0 && (
                        <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                          No leads in this stage
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </DndContext>
    </>
  )
}
