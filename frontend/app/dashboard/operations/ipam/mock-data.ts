export const ipSubnets = [
  {
    id: "1",
    network: "192.168.1.0/24",
    description: "Main office subnet",
  },
  {
    id: "2",
    network: "10.0.0.0/22",
    description: "Public IP block",
  },
  {
    id: "3",
    network: "172.16.0.0/16",
    description: "Guest network",
  },
];

export const ipAddresses = [
  {
    id: "1",
    ipAddress: "192.168.1.10",
    subnet: {
      id: "1",
      network: "192.168.1.0/24",
    },
    status: "Assigned",
    assignedTo: {
      id: "1",
      name: "John Doe",
    },
  },
  {
    id: "2",
    ipAddress: "192.168.1.11",
    subnet: {
      id: "1",
      network: "192.168.1.0/24",
    },
    status: "Available",
    assignedTo: null,
  },
  {
    id: "3",
    ipAddress: "10.0.0.1",
    subnet: {
      id: "2",
      network: "10.0.0.0/22",
    },
    status: "Reserved",
    assignedTo: null,
  },
  {
    id: "4",
    ipAddress: "10.0.0.2",
    subnet: {
      id: "2",
      network: "10.0.0.0/22",
    },
    status: "Assigned",
    assignedTo: {
      id: "2",
      name: "Jane Smith",
    },
  },
];