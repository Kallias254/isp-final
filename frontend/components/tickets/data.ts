export type TicketStatus = "Open" | "Pending" | "Closed"
export type TicketPriority = "Low" | "Medium" | "High" | "Urgent"

export type Ticket = {
  id: string
  subject: string
  customer?: string
  status: TicketStatus
  priority: TicketPriority
  assignedTo?: string
  createdAt: string
  initialMessage?: string
}

// Start empty to mirror the reference; newly created tickets will appear here.
export function seedTickets(): Ticket[] {
  return []
}
