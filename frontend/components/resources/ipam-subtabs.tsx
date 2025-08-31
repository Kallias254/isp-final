"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function IpamSubtabs() {
  const pathname = usePathname()
  const value = pathname?.includes("/discrepancies") ? "discrepancies" : "subnets"

  return (
    <Tabs value={value} className="w-full">
      <TabsList className="h-auto flex-wrap justify-start gap-2">
        <TabsTrigger asChild value="subnets">
          <Link href="/dashboard/resources/ipam/subnets">Subnets</Link>
        </TabsTrigger>
        <TabsTrigger asChild value="discrepancies">
          <Link href="/dashboard/resources/ipam/discrepancies">Discrepancies</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
