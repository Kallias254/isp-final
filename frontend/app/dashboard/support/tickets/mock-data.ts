export const tickets = [
  {
    id: "1",
    ticketID: "TKT-001",
    subscriber: {
      id: "1",
      name: "John Doe",
    },
    subject: "Internet not working",
    description: "The internet connection has been down since yesterday evening.",
    status: "Open",
    priority: "High",
    assignedTo: {
      id: "1",
      name: "Technician A",
    },
  },
  {
    id: "2",
    ticketID: "TKT-002",
    subscriber: {
      id: "2",
      name: "Jane Smith",
    },
    subject: "Slow internet speed",
    description: "My internet speed is much slower than usual.",
    status: "In Progress",
    priority: "Medium",
    assignedTo: {
      id: "2",
      name: "Technician B",
    },
  },
  {
    id: "3",
    ticketID: "TKT-003",
    subscriber: {
      id: "3",
      name: "Peter Jones",
    },
    subject: "Cannot access certain websites",
    description: "I am unable to access Google and YouTube.",
    status: "Resolved",
    priority: "Low",
    assignedTo: {
      id: "1",
      name: "Technician A",
    },
  },
  {
    id: "4",
    ticketID: "TKT-004",
    subscriber: {
      id: "4",
      name: "Mary Johnson",
    },
    subject: "New installation request",
    description: "I would like to request a new internet installation at my new apartment.",
    status: "Open",
    priority: "High",
    assignedTo: null,
  },
  {
    id: "5",
    ticketID: "TKT-005",
    subscriber: {
      id: "5",
      name: "David Williams",
    },
    subject: "Billing inquiry",
    description: "I have a question about my latest invoice.",
    status: "Closed",
    priority: "Medium",
    assignedTo: {
      id: "2",
      name: "Technician B",
    },
  },
];
