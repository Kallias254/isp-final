import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import NetworkMap from "@/components/network/network-map"

export default function NetworkMapPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Network Map</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-xl font-semibold">Network Map</h1>
          <p className="text-sm text-muted-foreground">Visualize your network infrastructure and service locations.</p>
        </div>
        <div className="mt-2 md:mt-0">
          <Link href="/dashboard/routers" className="text-sm text-muted-foreground hover:underline">
            View all routers
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <NetworkMap />
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <p>{"© 2025. Your Company Name. All Rights Reserved."}</p>
        <p>{"Created by: Your Name/Company"}</p>
      </div>
    </div>
  )
}
