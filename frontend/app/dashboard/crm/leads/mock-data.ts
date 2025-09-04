import { Lead } from "@/payload-types"

export const leads: Lead[] = [
  {
    id: "1",
    subscriberName: "Alice Johnson",
    subscriberPhone: "254712345681",
    status: "new",
    leadSource: "direct",
    createdAt: "2025-09-01",
    updatedAt: "2025-09-01",
  },
  {
    id: "2",
    subscriberName: "Bob Williams",
    subscriberPhone: "254712345682",
    status: "contacted",
    leadSource: "partner-referral",
    referredBy: { id: "1", name: "Partner A", commissionRate: 10, createdAt: "", updatedAt: "" },
    createdAt: "2025-09-02",
    updatedAt: "2025-09-02",
  },
  {
    id: "3",
    subscriberName: "Charlie Brown",
    subscriberPhone: "254712345683",
    status: "qualified",
    leadSource: "marketing-campaign",
    createdAt: "2025-09-03",
    updatedAt: "2025-09-03",
  },
]