export type Contact = { id: string; name: string; role?: string; phone?: string }

export type ServiceLocation = {
  id: string
  name: string
  address?: string
  lat?: number
  lng?: number
  caretaker?: string
  notes?: string
  contacts: Contact[]
}

export const seedLocations: ServiceLocation[] = []
