import { Building, BuildingUnit } from "@/payload-types"
import { partners } from "../partners/mock-data"

export const buildings: Building[] = [
    {
        id: "1",
        name: "The Grand",
        address: "123 Main St",
        status: "active",
        location: { id: "1", name: "Tech Hub Tower Location", latitude: -1.286389, longitude: 36.817223, ispOwner: "1", createdAt: "", updatedAt: "" },
        partner: partners[0],
        createdAt: "",
        updatedAt: ""
    },
    {
        id: "2",
        name: "The Heights",
        address: "456 High St",
        status: "active",
        partner: partners[1],
        createdAt: "",
        updatedAt: ""
    },
    {
        id: "3",
        name: "The Lofts",
        address: "789 Low St",
        status: "prospecting",
        createdAt: "",
        updatedAt: ""
    },
    {
        id: "4",
        name: "The View",
        address: "101 Sky St",
        status: "negotiating",
        partner: partners[2],
        createdAt: "",
        updatedAt: ""
    },
]

export const buildingUnits: BuildingUnit[] = [
  {
    id: "1",
    unitNumber: "A1",
    building: buildings[0],
    status: "vacant",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    unitNumber: "A2",
    building: buildings[0],
    status: "occupied",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "3",
    unitNumber: "B1",
    building: buildings[1],
    status: "vacant",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "4",
    unitNumber: "C1",
    building: buildings[2],
    status: "vacant",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "5",
    unitNumber: "D1",
    building: buildings[3],
    status: "vacant",
    createdAt: "",
    updatedAt: "",
  },
]