export type StaffRole = "Admin" | "Support" | "Field"
export type StaffStatus = "Active" | "Inactive"

export type Staff = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: StaffRole
  status: StaffStatus
}

export const seedStaff: Staff[] = [
  {
    id: "u-admin",
    firstName: "Alpha",
    lastName: "Admin",
    email: "alpha_admin@isp.local",
    phone: "",
    role: "Admin",
    status: "Active",
  },
  {
    id: "u-staff",
    firstName: "Alpha",
    lastName: "Staff",
    email: "alpha_staff1@isp.local",
    phone: "",
    role: "Support",
    status: "Active",
  },
]
