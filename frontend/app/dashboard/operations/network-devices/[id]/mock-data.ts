import { NetworkDevice } from "@/payload-types";

export const networkDevices: NetworkDevice[] = [
  {
    id: "device1",
    deviceName: "Main Router",
    deviceType: "core-router",
    purchaseDate: "2024-01-15",
    purchaseCost: 1200,
    monitoringType: "icmp-snmp",
    snmpCommunity: "public",
    ispOwner: "company1", // Placeholder
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "device2",
    deviceName: "Office Switch",
    deviceType: "switch",
    purchaseDate: "2024-02-20",
    purchaseCost: 300,
    monitoringType: "icmp",
    ispOwner: "company1", // Placeholder
    createdAt: "2024-02-20T11:00:00Z",
    updatedAt: "2024-02-20T11:00:00Z",
  },
];
