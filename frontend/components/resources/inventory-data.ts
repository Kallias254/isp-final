export type InventoryStatus = "In Stock" | "In Use" | "Reserved" | "Faulty" | "Retired"
export type DeviceType = "Router" | "Switch" | "CPE" | "Antenna" | "SFP Module" | "Other"

export type InventoryItem = {
  id: string
  name: string
  type: DeviceType
  status: InventoryStatus
  serial?: string
  model?: string
  purchaseDate?: string
  warrantyEnd?: string
  notes?: string
  serviceLocation?: string
  assignedSubscriber?: string
}

export const seedInventory: InventoryItem[] = []
export const DEVICE_TYPES: DeviceType[] = ["Router", "Switch", "CPE", "Antenna", "SFP Module", "Other"]
export const STATUSES: InventoryStatus[] = ["In Stock", "In Use", "Reserved", "Faulty", "Retired"]
