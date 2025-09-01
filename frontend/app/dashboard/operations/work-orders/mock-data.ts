export const workOrders = [
  {
    id: "1",
    orderType: "New Installation",
    subscriber: {
      id: "1",
      name: "John Doe",
    },
    status: "Completed",
    assignedTo: {
      id: "1",
      name: "Technician A",
    },
  },
  {
    id: "2",
    orderType: "Repair",
    subscriber: {
      id: "2",
      name: "Jane Smith",
    },
    status: "In Progress",
    assignedTo: {
      id: "2",
      name: "Technician B",
    },
  },
  {
    id: "3",
    orderType: "Site Survey",
    subscriber: {
      id: "3",
      name: "Peter Jones",
    },
    status: "Scheduled",
    assignedTo: {
      id: "1",
      name: "Technician A",
    },
  },
  {
    id: "4",
    orderType: "New Installation",
    subscriber: {
      id: "4",
      name: "Mary Johnson",
    },
    status: "Pending",
    assignedTo: null,
  },
  {
    id: "5",
    orderType: "Repair",
    subscriber: {
      id: "5",
      name: "David Williams",
    },
    status: "Failed",
    assignedTo: {
      id: "2",
      name: "Technician B",
    },
  },
];
