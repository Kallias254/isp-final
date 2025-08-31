export type LeadStatus = "New" | "Contacted" | "Site Survey" | "Proposal Sent" | "Converted" | "Lost"

export type Lead = {
  id: string
  name: string
  status: LeadStatus
  source?: string
  assignedTo?: string
  followUpDate?: string // ISO date string
  location?: string
  phone?: string
  email?: string
  apartment?: string
  notes?: string
}

const STORAGE_KEY = "isp-dashboard:leads"

const DEFAULT_LEADS: Lead[] = [
  {
    id: "l_1001",
    name: "Acme HQ Internet",
    status: "New",
    source: "Website",
    assignedTo: "Samira Patel",
    followUpDate: "2025-09-10",
    location: "Downtown",
    phone: "0712345678",
    email: "ops@acme.example.com",
  },
  {
    id: "l_1002",
    name: "Smith Residence",
    status: "Contacted",
    source: "Phone",
    assignedTo: "Jordan Lee",
    followUpDate: "2025-09-12",
    location: "Northside",
    phone: "0700001111",
    email: "smith@example.com",
  },
  {
    id: "l_1003",
    name: "Blue Cafe",
    status: "Site Survey",
    source: "Referral",
    assignedTo: "Samira Patel",
    followUpDate: "2025-09-15",
    location: "Riverside",
    phone: "0700002222",
    email: "gm@bluecafe.example.com",
  },
  {
    id: "l_1004",
    name: "Green Co-Working",
    status: "Proposal Sent",
    source: "Email",
    assignedTo: "Alex Kim",
    followUpDate: "2025-09-18",
    location: "Tech Park",
    phone: "0700003333",
    email: "admin@green.example.com",
  },
  {
    id: "l_1005",
    name: "Riverview Apartments",
    status: "Converted",
    source: "Website",
    assignedTo: "Jordan Lee",
    followUpDate: "2025-09-20",
    location: "Riverview",
    phone: "0700004444",
    email: "leasing@riverview.example.com",
  },
  {
    id: "l_1006",
    name: "Sunset Villas",
    status: "Lost",
    source: "Walk-in",
    assignedTo: "Alex Kim",
    followUpDate: "2025-09-05",
    location: "West Hills",
  },
]

type Store = { leads: Lead[] }

function readStore(): Store {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw) as Store
    } catch {
      // ignore
    }
  }
  // fallback to default
  return { leads: DEFAULT_LEADS }
}

function writeStore(store: Store) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    } catch {
      // ignore storage errors
    }
  }
}

const store: Store = readStore()

export const STATUSES: LeadStatus[] = ["New", "Contacted", "Site Survey", "Proposal Sent", "Converted", "Lost"]

export function getLeads(): Lead[] {
  return [...store.leads]
}

export function getLeadById(id: string): Lead | undefined {
  return store.leads.find((l) => l.id === id)
}

export function addLead(input: Omit<Lead, "id"> & Partial<Pick<Lead, "id">>) {
  const id = input.id ?? `l_${Math.random().toString(36).slice(2, 9)}`
  const lead: Lead = { ...input, id }
  store.leads.push(lead)
  writeStore(store)
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("lead:added", { detail: { id } }))
  }
  return lead
}

export function updateLead(updated: Lead) {
  const idx = store.leads.findIndex((l) => l.id === updated.id)
  if (idx !== -1) {
    store.leads[idx] = { ...updated }
    writeStore(store)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("lead:updated", { detail: { id: updated.id } }))
    }
  }
}

export function updateLeadFields(id: string, fields: Partial<Lead>) {
  const l = getLeadById(id)
  if (!l) return
  const merged = { ...l, ...fields }
  updateLead(merged)
}
