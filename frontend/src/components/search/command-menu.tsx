"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Search,
  Users,
  UserPlus,
  ReceiptText,
  CreditCard,
  RouterIcon,
  MapIcon,
  MapPin,
  FileText,
  BadgeDollarSign,
  Settings,
  HelpCircle,
  Bell,
  Loader2,
} from "lucide-react"

type ResultItem = {
  id: string
  title: string
  subtitle?: string
  url: string
  type:
    | "subscriber"
    | "lead"
    | "ticket"
    | "message"
    | "invoice"
    | "payment"
    | "router"
    | "network"
    | "location"
    | "resource"
    | "plan"
    | "staff"
    | "settings"
    | "help"
    | "notification"
    | "page"
    | string
}

function iconForType(t: ResultItem["type"]) {
  switch (t) {
    case "subscriber":
    case "staff":
      return Users
    case "lead":
      return UserPlus
    case "invoice":
      return ReceiptText
    case "payment":
      return CreditCard
    case "router":
      return RouterIcon
    case "network":
      return MapIcon
    case "location":
      return MapPin
    case "resource":
    case "page":
      return FileText
    case "plan":
      return BadgeDollarSign
    case "settings":
      return Settings
    case "help":
      return HelpCircle
    case "notification":
      return Bell
    default:
      return FileText
  }
}

// Avoid shadowing by explicitly referencing the global Map.
function groupBy<T, K extends string>(items: T[], getKey: (item: T) => K): Array<{ group: K; items: T[] }> {
  const map = new globalThis.Map<K, T[]>()
  for (const item of items) {
    const key = getKey(item)
    const arr = map.get(key) ?? []
    arr.push(item)
    map.set(key, arr)
  }
  return Array.from(map.entries()).map(([group, items]) => ({ group, items }))
}

type CommandMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialQuery?: string
}

export function CommandMenu({ open, onOpenChange, initialQuery = "" }: CommandMenuProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState(initialQuery)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [results, setResults] = React.useState<ResultItem[]>([])
  const [recent, setRecent] = React.useState<string[]>([])

  // Keep query in sync when palette opens.
  React.useEffect(() => {
    if (open) {
      setQuery(initialQuery)
      try {
        const saved = JSON.parse(localStorage.getItem("cmd:recent") || "[]")
        if (Array.isArray(saved)) setRecent(saved.slice(0, 10))
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Debounced search
  React.useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    const run = async () => {
      const q = query.trim()
      if (!q) {
        setResults([])
        setLoading(false)
        setError(null)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          throw new Error(`Search failed (${res.status})`)
        }
        const data = (await res.json()) as { results: ResultItem[] }
        setResults(Array.isArray(data.results) ? data.results : [])
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setError(e.message || "Search failed")
          setResults([])
        }
      } finally {
        setLoading(false)
      }
    }
    const t = setTimeout(run, 200)
    return () => {
      controller.abort()
      clearTimeout(t)
    }
  }, [open, query])

  const handleSelect = (url: string, qForRecent?: string) => {
    if (qForRecent && qForRecent.trim()) {
      try {
        const saved = JSON.parse(localStorage.getItem("cmd:recent") || "[]")
        const next = [qForRecent, ...(Array.isArray(saved) ? saved : [])]
          .filter(Boolean)
          .filter((v, i, a) => a.indexOf(v) === i)
          .slice(0, 10)
        localStorage.setItem("cmd:recent", JSON.stringify(next))
      } catch {
        // ignore
      }
    }
    onOpenChange(false)
    router.push(url)
  }

  const grouped = groupBy(results, (r) => {
    // Capitalize heading from type
    return (r.type?.charAt(0).toUpperCase() + r.type?.slice(1)) as string
  })

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="pointer-events-none absolute left-4 top-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="Search subscribers, tickets, routers, invoices, settings…"
      />
      <CommandList>
        {loading && (
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching…
          </div>
        )}
        {!loading && !!error && <CommandEmpty>{error}</CommandEmpty>}
        {!loading && !error && !results.length && !query && (
          <>
            <CommandGroup heading="Quick Links">
              <CommandItem onSelect={() => handleSelect("/dashboard/subscribers")}>
                <Users className="mr-2 h-4 w-4" />
                Subscribers
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/dashboard/leads")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Leads
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/dashboard/tickets")}>
                <FileText className="mr-2 h-4 w-4" />
                Tickets
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/dashboard/routers")}>
                <RouterIcon className="mr-2 h-4 w-4" />
                Routers
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/dashboard/invoices")}>
                <ReceiptText className="mr-2 h-4 w-4" />
                Invoices
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/dashboard/my-isp-settings")}>
                <Settings className="mr-2 h-4 w-4" />
                My ISP Settings
              </CommandItem>
            </CommandGroup>
            {!!recent.length && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Recent">
                  {recent.map((q) => (
                    <CommandItem key={q} onSelect={() => setQuery(q)}>
                      <Search className="mr-2 h-4 w-4" />
                      {q}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </>
        )}
        {!loading && !error && !!results.length && (
          <>
            {grouped.map(({ group, items }) => (
              <CommandGroup key={group} heading={group}>
                {items.map((r) => {
                  const Icon = iconForType(r.type)
                  return (
                    <CommandItem key={`${r.type}:${r.id}`} value={`${r.title} ${r.subtitle || ""}`}>
                      <button
                        type="button"
                        onClick={() => handleSelect(r.url, query)}
                        className="flex w-full items-center justify-start gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        <div className="flex min-w-0 flex-col text-left">
                          <span className="truncate">{r.title}</span>
                          {r.subtitle ? (
                            <span className="truncate text-xs text-muted-foreground">{r.subtitle}</span>
                          ) : null}
                        </div>
                      </button>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
