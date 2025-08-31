export type InvoiceStatus = "Draft" | "Open" | "Paid" | "Overdue"

export type Invoice = {
  id: string
  number: string
  subscriber: string
  issuedDate: string // YYYY-MM-DD
  dueDate: string // YYYY-MM-DD
  total: number
  paid: number
  status: InvoiceStatus
}

export const seedInvoices: Invoice[] = []
