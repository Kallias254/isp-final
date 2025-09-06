import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import * as React from "react";
import { headers } from 'next/headers';

// Helper function to determine initial open sections based on pathname
function getInitialOpenSections(pathname: string): string[] {
  if (pathname.startsWith('/dashboard/crm')) {
    return ['CRM & Sales'];
  }
  if (pathname.startsWith('/dashboard/billing')) {
    return ['Billing & Finance'];
  }
  if (pathname.startsWith('/dashboard/operations')) {
    return ['Operations & NOC'];
  }
  if (pathname.startsWith('/dashboard/support')) {
    return ['Support & Comms'];
  }
  if (pathname.startsWith('/dashboard/system')) {
    return ['System & Auditing'];
  }
  return [];
}

export default async function DashboardLayout({
  children,
}: { 
  children: React.ReactNode;
}) {
  const headersList = await headers();
  console.log("Available headers:", Object.fromEntries(headersList.entries()));
  const referer = headersList.get('referer');
  let pathname = ''
  if (referer) {
    try {
      const url = new URL(referer);
      pathname = url.pathname;
    } catch (e) {
      // ignore invalid URL
    }
  }

  console.log("Pathname from referer:", pathname);
  const initialOpenSections = getInitialOpenSections(pathname);

  return (
    <SidebarProvider
      initialOpenSections={initialOpenSections}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}