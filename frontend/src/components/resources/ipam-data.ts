export type Subnet = {
  id: string
  name: string
  cidr: string
  gateway?: string
  dns?: string
  router?: string
  used: number
  capacity: number
}

export type Discrepancy = {
  id: string
  ip: string
  type: "Conflict" | "Leaked" | "Unassigned" | "Other"
  router?: string
  details?: string
  detectedAt: string
  resolved: boolean
}

export const seedSubnets: Subnet[] = [
  {
    id: "s1",
    name: "Subnet 10.0.10.0/24 for Bronze",
    cidr: "10.0.10.0/24",
    used: 0,
    capacity: 254,
    router: "local_router",
  },
  {
    id: "s2",
    name: "Subnet 10.0.20.0/24 for Silver",
    cidr: "10.0.20.0/24",
    used: 0,
    capacity: 254,
    router: "local_router",
  },
  {
    id: "s3",
    name: "Subnet 10.0.30.0/24 for Gold",
    cidr: "10.0.30.0/24",
    used: 0,
    capacity: 254,
    router: "local_router",
  },
]

export const seedDiscrepancies: Discrepancy[] = []
