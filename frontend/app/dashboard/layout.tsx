import type { ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <main className="p-4 md:p-6 bg-muted/30 min-h-[calc(100svh-3.5rem)]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
