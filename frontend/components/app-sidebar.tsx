"use client"

import * as React from "react"
import {
  Home,
  Users,
  Receipt,
  Globe,
  Headset,
  Shield,
  BarChart,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Handshake,
  FileText,
  Network,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Separator } from "./ui/separator"

const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "CRM & Sales",
      url: "/dashboard/crm",
      icon: Handshake,
      items: [
        {
          title: "Subscribers",
          url: "/dashboard/crm/subscribers",
        },
        {
          title: "Leads",
          url: "/dashboard/crm/leads",
        },
        {
          title: "Buildings",
          url: "/dashboard/crm/buildings",
        },
        {
          title: "Partners",
          url: "/dashboard/crm/partners",
        },
      ],
    },
    {
      title: "Billing & Finance",
      url: "/dashboard/billing",
      icon: FileText,
      items: [
        {
          title: "Invoices",
          url: "/dashboard/billing/invoices",
        },
        {
          title: "Payments",
          url: "/dashboard/billing/payments",
        },
        {
          title: "Expenses",
          url: "/dashboard/billing/expenses",
        },
      ],
    },
    {
      title: "Operations & NOC",
      url: "/dashboard/operations",
      icon: Network,
      items: [
        {
          title: "Network Map",
          url: "/dashboard/operations/map",
        },
        {
          title: "Device Inventory",
          url: "/dashboard/operations/network-devices",
        },
        {
          title: "IP Manager (IPAM)",
          url: "/dashboard/operations/ipam",
        },
        {
          title: "Work Orders",
          url: "/dashboard/operations/work-orders",
        },
      ],
    },
    {
      title: "Support & Comms",
      url: "/dashboard/support",
      icon: Headset,
      items: [
        {
          title: "Tickets",
          url: "/dashboard/support/tickets",
        },
        {
          title: "Communications (Messages)",
          url: "/dashboard/support/messages",
        },
        {
          title: "Templates",
          url: "/dashboard/support/templates",
        },
      ],
    },
  ]
const navSecondary = [
    {
      title: "System & Auditing",
      url: "/dashboard/system",
      icon: Shield,
      items: [
        {
          title: "Staff Management",
          url: "/dashboard/system/staff",
        },
        {
          title: "Audit Logs",
          url: "/dashboard/system/audit-logs",
        },
        {
          title: "API Keys",
          url: "/dashboard/system/api-keys",
        },
      ],
    },
    {
      title: "Reporting",
      url: "/dashboard/reporting",
      icon: BarChart,
      items: [
        {
          title: "Financial Reports",
          url: "/dashboard/reporting/financial",
        },
        {
          title: "Customer Reports",
          url: "/dashboard/reporting/customer",
        },
        {
          title: "Operations Reports",
          url: "/dashboard/reporting/operations",
        },
      ],
    },
  ]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain title="Main" items={navMain} />
        <Separator className="my-4" />
        <NavMain title="System" items={navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export function AppSidebarRail({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain title="Main" items={navMain} isCollapsed />
        <Separator className="my-4" />
        <NavMain title="System" items={navSecondary} isCollapsed />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
