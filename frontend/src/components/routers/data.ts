export type RouterStatus = "ONLINE" | "DEGRADED" | "OFFLINE"

export type RouterItem = {
  id: string
  name: string
  ip: string
  apiUser: string
  apiPort: number
  description?: string
  status: RouterStatus
  lastChecked: string // ISO date
  location?: string
}

export const seedRouters: RouterItem[] = [
  {
    id: "r1",
    name: "local_router",
    ip: "127.0.0.1",
    apiUser: "api-seed",
    apiPort: 8728,
    description: "-",
    status: "ONLINE",
    lastChecked: new Date().toISOString(),
    location: "Nairobi HQ",
  },
]
