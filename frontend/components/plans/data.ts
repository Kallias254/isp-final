export type BillingCycle = "Monthly" | "Quarterly" | "Yearly"
export type PlanSignupStatus = "Active" | "Inactive"
export type PlanOverallStatus = "Enabled" | "Disabled"

export type Plan = {
  id: string
  name: string
  price: number
  currency: string
  billingCycle: BillingCycle
  rateLimit: string // e.g., "10M/20M"
  router: string
  profile: string
  subnets: string[] // CIDRs
  signupStatus: PlanSignupStatus
  overallStatus: PlanOverallStatus
}

export const seedPlans: Plan[] = [
  {
    id: "bronze",
    name: "Bronze",
    price: 1000,
    currency: "KES",
    billingCycle: "Monthly",
    rateLimit: "5M/5M",
    router: "local_router",
    profile: "Bronze",
    subnets: ["10.0.10.0/24"],
    signupStatus: "Active",
    overallStatus: "Enabled",
  },
  {
    id: "silver",
    name: "Silver",
    price: 2000,
    currency: "KES",
    billingCycle: "Monthly",
    rateLimit: "10M/10M",
    router: "local_router",
    profile: "Silver",
    subnets: ["10.0.20.0/24"],
    signupStatus: "Inactive",
    overallStatus: "Enabled",
  },
  {
    id: "gold",
    name: "Gold",
    price: 3000,
    currency: "KES",
    billingCycle: "Monthly",
    rateLimit: "15M/15M",
    router: "local_router",
    profile: "Gold",
    subnets: ["10.0.30.0/24"],
    signupStatus: "Active",
    overallStatus: "Enabled",
  },
]

export function getPlanById(id: string) {
  return seedPlans.find((p) => p.id === id)
}
