"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ResourcesTabs() {
  const pathname = usePathname()
  const isInventory = pathname?.startsWith("/dashboard/resources/inventory")
  const isIpam = pathname?.startsWith("/dashboard/resources/ipam")
  const current = isInventory ? "inventory" : isIpam ? "ipam" : "inventory"

  return (
    <Tabs value={current} className="w-full">
      <TabsList className="h-auto flex-wrap justify-start gap-2">
        <TabsTrigger asChild value="inventory">
          <Link href="/dashboard/resources/inventory">Inventory</Link>
        </TabsTrigger>
        <TabsTrigger asChild value="ipam">
          <Link href="/dashboard/resources/ipam/subnets">IPAM</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
