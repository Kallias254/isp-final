"use client"

import * as React from "react"
import { Bell, CheckCircle2, CircleAlert, Mail, Ticket, RouterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type Notification = {
  id: string
  title: string
  description?: string
  href?: string
  read?: boolean
  icon?: "mail" | "ticket" | "router" | "success" | "alert"
  time?: string
}

const iconMap: Record<NonNullable<Notification["icon"]>, React.ReactNode> = {
  mail: <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  ticket: <Ticket className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
  router: <RouterIcon className="h-4 w-4 text-teal-600 dark:text-teal-400" />,
  success: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
  alert: <CircleAlert className="h-4 w-4 text-red-600 dark:text-red-400" />,
}

function NotificationRow({ n }: { n: Notification }) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="mt-1">{n.icon ? iconMap[n.icon] : <Mail className="h-4 w-4 opacity-60" />}</div>
      <div className="min-w-0">
        <div className="truncate text-sm">{n.title}</div>
        {n.description ? <div className="truncate text-xs text-muted-foreground">{n.description}</div> : null}
        {n.time ? <div className="mt-0.5 text-[10px] text-muted-foreground">{n.time}</div> : null}
      </div>
      {!n.read ? <span className="ml-auto mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" /> : null}
    </div>
  )

  if (n.href) {
    return (
      <DropdownMenuItem asChild className="cursor-pointer">
        <a href={n.href} className="w-full">
          {content}
        </a>
      </DropdownMenuItem>
    )
  }

  return <DropdownMenuItem className="cursor-default">{content}</DropdownMenuItem>
}

export function NotificationPopover({
  items = [],
  className,
}: {
  items?: Notification[]
  className?: string
}) {
  const hasUnread = React.useMemo(() => items.some((i) => !i.read), [items])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className={cn("relative", className)}>
          <Bell className="h-5 w-5" />
          {hasUnread ? (
            <span aria-hidden className="absolute right-2 top-2 block h-2 w-2 rounded-full bg-red-500" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="px-4 py-3 text-sm">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[320px] overflow-auto p-1">
          {items.length === 0 ? (
            <div className="px-3 py-6 text-sm text-muted-foreground">No new notifications</div>
          ) : (
            items.map((n) => <NotificationRow key={n.id} n={n} />)
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="p-2">
          <DropdownMenuItem asChild className="cursor-pointer justify-center rounded-md px-2 py-1.5">
            <a href="/dashboard/notifications" className="w-full text-center text-sm">
              Show all Notifications
            </a>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
