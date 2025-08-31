export type PaymentMethod = "M-Pesa" | "Cash" | "Card" | "Bank Transfer"

export type Payment = {
  id: string
  txnId: string
  date: string // YYYY-MM-DD
  subscriber: string
  invoiceNumber?: string
  amount: number
  method: PaymentMethod
  recordedBy: string
  notes?: string
}

export const seedPayments: Payment[] = []
