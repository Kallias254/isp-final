"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  BadgeDollarSign,
  CreditCard,
  FileText,
  Gauge,
  Home,
  Map,
  MapPin,
  MessageSquare,
  ReceiptText,
  RouterIcon,
  Ticket,
  Users,
  UserPlus,
  Settings,
  ChevronDown,
  Edit3,
  HelpCircle,
  LogOut,
  Shield,
  UserRound,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const sections = [
  {
    label: "Dashboard",
    items: [{ title: "Overview", icon: Home, href: "/dashboard" }],
  },
  {
    label: "CRM",
    items: [
      { title: "Subscribers", icon: Users, href: "/dashboard/subscribers" },
      { title: "Leads", icon: UserPlus, href: "/dashboard/leads" },
      { title: "Tickets", icon: Ticket, href: "/dashboard/tickets" },
      { title: "Messages", icon: MessageSquare, href: "/dashboard/messages/compose" },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Invoices", icon: ReceiptText, href: "/dashboard/invoices" },
      { title: "Payments", icon: CreditCard, href: "/dashboard/payments" },
    ],
  },
  {
    label: "Networking",
    items: [
      { title: "Network Map", icon: Map, href: "/dashboard/network-map" },
      { title: "Routers", icon: RouterIcon, href: "/dashboard/routers" },
      { title: "Service Locations", icon: MapPin, href: "/dashboard/service-locations" },
      { title: "Resources", icon: FileText, href: "/dashboard/resources" },
    ],
  },
  {
    label: "Company",
    items: [
      { title: "Plans", icon: BadgeDollarSign, href: "/dashboard/plans" },
      { title: "My Staff", icon: Users, href: "/dashboard/staff" },
      { title: "My ISP Settings", icon: Settings, href: "/dashboard/my-isp-settings" },
    ],
  },
]

function AccountAction({
  href,
  icon: Icon,
  children,
}: { href: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      <Icon className="h-4 w-4" />
      <span className="truncate">{children}</span>
    </a>
  )
}

export function AppSidebar() {
  const [accountOpen, setAccountOpen] = React.useState(false)
  const { open: sidebarOpen } = useSidebar()
  const pathname = usePathname()
  const showOverlay = accountOpen && sidebarOpen

  // Function to check if a menu item is active
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  return (
    <Sidebar className="text-sidebar-foreground" collapsible="icon" side="left">
      <SidebarHeader className="px-3 py-3">
        <a
          href="#"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-base font-semibold",
            "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
          )}
        >
          <Gauge className="h-5 w-5 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">Vantage ISP.</span>
        </a>
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:sr-only">{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive(item.href)}
                      className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                    >
                      <a href={item.href}>
                        <item.icon className="shrink-0" />
                        <span className="group-data-[collapsible=icon]:sr-only">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator className="mx-2" />

      {/* Footer drawer with animation */}
      <SidebarFooter className="relative z-20 p-0">
        <Collapsible open={accountOpen} onOpenChange={setAccountOpen} className="w-full">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "group-data-[collapsible=icon]:hidden",
              )}
              aria-label="Open account panel"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback>AA</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">Alpha</div>
                <div className="truncate text-xs text-muted-foreground">Partner Admin</div>
              </div>
              <ChevronDown className={cn("h-4 w-4 transition-transform shrink-0", accountOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>

          {/* Animated content: slide/fade + height expansion */}
          <CollapsibleContent
            className={cn(
              "overflow-hidden data-[state=open]:border-t",
              "data-[state=closed]:max-h-0 data-[state=open]:max-h-[60vh]",
              "transition-[max-height] duration-300 ease-out",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-2",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-2",
            )}
          >
            <div className="flex flex-col gap-0.5 p-2">
              <AccountAction href="#" icon={Edit3}>
                Edit Profile
              </AccountAction>
              <AccountAction href="#" icon={UserRound}>
                View Profile
              </AccountAction>
              <AccountAction href="#" icon={Settings}>
                Account Settings
              </AccountAction>

              <div className="my-1 h-px bg-sidebar-border" />

              <AccountAction href="#" icon={HelpCircle}>
                Help Center
              </AccountAction>
              <AccountAction href="#" icon={Shield}>
                Privacy Settings
              </AccountAction>

              <div className="my-1 h-px bg-sidebar-border" />

              <AccountAction href="#" icon={LogOut}>
                Log Out
              </AccountAction>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Compact footer for icon-only mode */}
        <div className="hidden group-data-[collapsible=icon]:flex px-2 py-2 justify-center">
          <button
            className="flex size-8 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            aria-label="Account menu"
            title="Alpha - Partner Admin"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">AA</AvatarFallback>
            </Avatar>
          </button>
        </div>
      </SidebarFooter>

      {showOverlay && (
        <div
          aria-hidden
          onClick={() => setAccountOpen(false)}
          className={cn(
            "absolute inset-0 z-10 bg-background/60 backdrop-blur-[1px]",
            "transition-opacity duration-200 ease-out",
            "opacity-100",
            "group-data-[collapsible=icon]:hidden",
          )}
        />
      )}

      <SidebarRail
        className={cn(
          // Pull the rail to the sidebar edge and draw the 2px line just inside the panel.
          "!right-0 !translate-x-0",
          // Move the pseudo-line inward ~3px and show it only on hover to avoid a persistent hairline.
          "after:!left-[calc(100%-3px)] after:opacity-0 hover:after:opacity-100",
        )}
      />
    </Sidebar>
  )
}
