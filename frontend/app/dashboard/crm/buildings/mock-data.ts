import { Building } from "@/payload-types"

export const buildings: Building[] = [
  {
    id: "1",
    name: "Metroplex Plaza",
    status: "active",
    location: { id: "1", name: "CBD Location", latitude: -1.286389, longitude: 36.817223, ispOwner: "1", createdAt: "", updatedAt: "" },
    createdAt: "2025-09-01",
    updatedAt: "2025-09-01",
  },
  {
    id: "2",
    name: "Riverside Complex",
    status: "prospecting",
    location: { id: "2", name: "Westlands Location", latitude: -1.2675, longitude: 36.8022, ispOwner: "1", createdAt: "", updatedAt: "" },
    createdAt: "2025-09-02",
    updatedAt: "2025-09-02",
  },
  {
    id: "3",
    name: "Hilltop Apartments",
    status: "negotiating",
    location: { id: "3", name: "Kilimani Location", latitude: -1.2921, longitude: 36.7822, ispOwner: "1", createdAt: "", updatedAt: "" },
    createdAt: "2025-09-03",
    updatedAt: "2025-09-03",
  },
]