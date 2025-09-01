import { Lead } from "@/payload-types"

export const leads: Lead[] = [
  {
    id: "1",
    subscriberName: "Alice Wonder",
    subscriberPhone: "254723456789",
    status: "new",
    leadSource: "website",
    serviceLocation: {
        id: "1",
        unitNumber: "A1",
        building: {
            id: "1",
            name: "The Grand",
            address: "123 Main St",
            status: "active",
            createdAt: "",
            updatedAt: ""
        },
        status: "lead",
        createdAt: "",
        updatedAt: ""
    },
    createdAt: "2025-09-01",
    updatedAt: "2025-09-01",
  },
  {
    id: "2",
    subscriberName: "Bob Builder",
    subscriberPhone: "254723456790",
    status: "contacted",
    leadSource: "partner-referral",
    serviceLocation: {
        id: "2",
        unitNumber: "B2",
        building: {
            id: "2",
            name: "The Heights",
            address: "456 High St",
            status: "active",
            createdAt: "",
            updatedAt: ""
        },
        status: "lead",
        createdAt: "",
        updatedAt: ""
    },
    createdAt: "2025-09-01",
    updatedAt: "2025-09-01",
  },
  {
    id: "3",
    subscriberName: "Charlie Chaplin",
    subscriberPhone: "254723456791",
    status: "converted",
    leadSource: "direct-call",
    serviceLocation: {
        id: "3",
        unitNumber: "C3",
        building: {
            id: "1",
            name: "The Grand",
            address: "123 Main St",
            status: "active",
            createdAt: "",
            updatedAt: ""
        },
        status: "subscriber",
        createdAt: "",
        updatedAt: ""
    },
    createdAt: "2025-09-01",
    updatedAt: "2025-09-01",
  },
]
