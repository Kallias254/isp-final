import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { RouterStatus } from "./data"

export function StatusPill({ status }: { status: RouterStatus }) {
  const classes =
    status === "ONLINE"
      ? "bg-emerald-100 text-emerald-700"
      : status === "DEGRADED"
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-700"
  return <Badge className={cn("rounded px-2 py-0.5", classes)}>{status}</Badge>
}
