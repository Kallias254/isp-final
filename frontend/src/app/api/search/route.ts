import { NextResponse } from "next/server"

type ResultItem = {
  id: string
  title: string
  subtitle?: string
  url: string
  type: string
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") || "").trim()
  if (!q) {
    return NextResponse.json({ results: [] })
  }

  // If you have a backend search, wire it here.
  // Expects a JSON payload: { results: Array<{ id, title, subtitle?, url, type }> }
  const SEARCH_API = process.env.SEARCH_API
  if (SEARCH_API) {
    try {
      const url = `${SEARCH_API}${SEARCH_API.includes("?") ? "&" : "?"}q=${encodeURIComponent(q)}`
      const res = await fetch(url, { headers: { Accept: "application/json" } })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data?.results)) {
          return NextResponse.json({ results: data.results as ResultItem[] })
        }
      }
      // Fall through to local search if unexpected shape
    } catch {
      // Fall back to local search
    }
  }

  // Local, type-aware demo search across known dashboard sections
  const all: ResultItem[] = [
    { id: "subs", title: "Subscribers", subtitle: "CRM", url: "/dashboard/subscribers", type: "subscriber" },
    { id: "leads", title: "Leads", subtitle: "CRM", url: "/dashboard/leads", type: "lead" },
    { id: "tickets", title: "Tickets", subtitle: "CRM", url: "/dashboard/tickets", type: "ticket" },
    { id: "messages", title: "Compose Message", subtitle: "CRM", url: "/dashboard/messages/compose", type: "message" },
    { id: "invoices", title: "Invoices", subtitle: "Finance", url: "/dashboard/invoices", type: "invoice" },
    { id: "payments", title: "Payments", subtitle: "Finance", url: "/dashboard/payments", type: "payment" },
    { id: "map", title: "Network Map", subtitle: "Networking", url: "/dashboard/network-map", type: "network" },
    { id: "routers", title: "Routers", subtitle: "Networking", url: "/dashboard/routers", type: "router" },
    {
      id: "locations",
      title: "Service Locations",
      subtitle: "Networking",
      url: "/dashboard/service-locations",
      type: "location",
    },
    {
      id: "resources",
      title: "Resources Inventory",
      subtitle: "Networking",
      url: "/dashboard/resources/inventory",
      type: "resource",
    },
    { id: "plans", title: "Plans", subtitle: "Company", url: "/dashboard/plans", type: "plan" },
    { id: "staff", title: "My Staff", subtitle: "Company", url: "/dashboard/staff", type: "staff" },
    {
      id: "settings",
      title: "My ISP Settings",
      subtitle: "Company",
      url: "/dashboard/my-isp-settings",
      type: "settings",
    },
    { id: "overview", title: "Overview", subtitle: "Dashboard", url: "/dashboard", type: "page" },
  ]

  const ql = q.toLowerCase()
  const results = all.filter(
    (r) =>
      r.title.toLowerCase().includes(ql) ||
      (r.subtitle && r.subtitle.toLowerCase().includes(ql)) ||
      r.type.toLowerCase().includes(ql),
  )

  return NextResponse.json({ results })
}
