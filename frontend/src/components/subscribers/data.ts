export interface Subscriber {
  id: string
  firstName: string
  lastName: string
  email?: string
  mpesaPhone: string
  contactPhone?: string
  accountNumber: string
  plan: string
  connection: string
  router: string
  ipOrUsername: string
  status: "Active" | "Suspended" | "Inactive"
  expiry: string
  monthlyRevenue: number
  dataUsage: string
  joinDate: string
  lastPayment: string
  location: string
}

export const seedSubscribers: Subscriber[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    mpesaPhone: "712345678",
    contactPhone: "712345679",
    accountNumber: "ACC001",
    plan: "Gold",
    connection: "DIRECT STATIC",
    router: "local_router",
    ipOrUsername: "192.168.1.100",
    status: "Active",
    expiry: "2024-12-31",
    monthlyRevenue: 2500,
    dataUsage: "45.2 GB",
    joinDate: "2024-01-15",
    lastPayment: "2024-03-01",
    location: "Nairobi",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    mpesaPhone: "723456789",
    accountNumber: "ACC002",
    plan: "Silver",
    connection: "PPPOE",
    router: "main_router",
    ipOrUsername: "user_jane",
    status: "Active",
    expiry: "2024-11-30",
    monthlyRevenue: 1800,
    dataUsage: "32.1 GB",
    joinDate: "2024-02-10",
    lastPayment: "2024-03-05",
    location: "Mombasa",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Johnson",
    mpesaPhone: "734567890",
    accountNumber: "ACC003",
    plan: "Bronze",
    connection: "HOTSPOT",
    router: "backup_router",
    ipOrUsername: "192.168.1.101",
    status: "Suspended",
    expiry: "2024-10-15",
    monthlyRevenue: 1200,
    dataUsage: "18.7 GB",
    joinDate: "2024-01-20",
    lastPayment: "2024-02-15",
    location: "Kisumu",
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@example.com",
    mpesaPhone: "745678901",
    contactPhone: "745678902",
    accountNumber: "ACC004",
    plan: "Platinum",
    connection: "DIRECT STATIC",
    router: "local_router",
    ipOrUsername: "192.168.1.102",
    status: "Active",
    expiry: "2025-01-31",
    monthlyRevenue: 3500,
    dataUsage: "78.9 GB",
    joinDate: "2023-12-01",
    lastPayment: "2024-03-10",
    location: "Nakuru",
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    mpesaPhone: "756789012",
    accountNumber: "ACC005",
    plan: "Gold",
    connection: "PPPOE",
    router: "main_router",
    ipOrUsername: "user_david",
    status: "Inactive",
    expiry: "2024-09-30",
    monthlyRevenue: 2500,
    dataUsage: "0 GB",
    joinDate: "2024-01-05",
    lastPayment: "2024-01-30",
    location: "Eldoret",
  },
]
