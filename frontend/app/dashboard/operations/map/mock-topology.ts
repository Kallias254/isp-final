import { NetworkDevice } from "@/payload-types";

export interface TopologyNode extends NetworkDevice {
  lat: number;
  lng: number;
  status: 'online' | 'offline' | 'warning';
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
}

export const topologyNodes: TopologyNode[] = [
  {
    id: "device1",
    deviceName: "Main Router",
    deviceType: "core-router",
    purchaseDate: "2024-01-15",
    purchaseCost: 1200,
    monitoringType: "icmp-snmp",
    snmpCommunity: "public",
    ispOwner: "company1",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    lat: -1.286389,
    lng: 36.817223,
    status: 'online',
  },
  {
    id: "device2",
    deviceName: "Office Switch",
    deviceType: "switch",
    purchaseDate: "2024-02-20",
    purchaseCost: 300,
    monitoringType: "icmp",
    ispOwner: "company1",
    createdAt: "2024-02-20T11:00:00Z",
    updatedAt: "2024-02-20T11:00:00Z",
    lat: -1.292066,
    lng: 36.821946,
    status: 'online',
  },
  {
    id: "device3",
    deviceName: "Access Point 1",
    deviceType: "access-point",
    purchaseDate: "2024-03-01",
    purchaseCost: 150,
    monitoringType: "icmp",
    ispOwner: "company1",
    createdAt: "2024-03-01T12:00:00Z",
    updatedAt: "2024-03-01T12:00:00Z",
    lat: -1.300000,
    lng: 36.800000,
    status: 'online',
  },
  {
    id: "device4",
    deviceName: "Customer CPE",
    deviceType: "cpe",
    purchaseDate: "2024-04-01",
    purchaseCost: 80,
    monitoringType: "icmp",
    ispOwner: "company1",
    createdAt: "2024-04-01T13:00:00Z",
    updatedAt: "2024-04-01T13:00:00Z",
    lat: -1.310000,
    lng: 36.830000,
    status: 'online',
  },
];

export const topologyEdges: TopologyEdge[] = [
  { id: "e1-2", source: "device1", target: "device2" },
  { id: "e2-3", source: "device2", target: "device3" },
  { id: "e3-4", source: "device3", target: "device4" },
];