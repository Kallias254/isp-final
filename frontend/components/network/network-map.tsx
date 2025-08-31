"use client"

import * as React from "react"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type L from "leaflet"

type RouterStatus = "Online" | "Degraded" | "Offline"

type Router = {
  id: string
  name: string
  ip: string
  status: RouterStatus
  lat: number
  lng: number
  location: string
}

const ROUTERS: Router[] = [
  {
    id: "r-nbo-core",
    name: "nairobi-core",
    ip: "10.0.0.1",
    status: "Online",
    lat: -1.286389,
    lng: 36.817223,
    location: "Nairobi",
  },
  {
    id: "r-msa-edge",
    name: "mombasa-edge",
    ip: "10.0.1.1",
    status: "Degraded",
    lat: -4.043477,
    lng: 39.668206,
    location: "Mombasa",
  },
  {
    id: "r-kis-edge",
    name: "kisumu-edge",
    ip: "10.0.2.1",
    status: "Online",
    lat: -0.091702,
    lng: 34.767956,
    location: "Kisumu",
  },
  {
    id: "r-meru-pop",
    name: "meru-pop",
    ip: "10.0.3.1",
    status: "Offline",
    lat: 0.04626,
    lng: 37.655869,
    location: "Meru",
  },
  {
    id: "r-nrb-access",
    name: "nairobi-access-2",
    ip: "10.0.0.22",
    status: "Online",
    lat: -1.2921,
    lng: 36.8219,
    location: "Nairobi",
  },
]

function getStatusColor(status: RouterStatus) {
  switch (status) {
    case "Online":
      return { fill: "#10B981", stroke: "#047857" } // emerald
    case "Degraded":
      return { fill: "#F59E0B", stroke: "#B45309" } // amber
    case "Offline":
      return { fill: "#EF4444", stroke: "#991B1B" } // red
  }
}

function FitBounds({ items }: { items: Router[] }) {
  const map = useMap()
  React.useEffect(() => {
    if (!items.length) return
    const lats = items.map((r) => r.lat)
    const lngs = items.map((r) => r.lng)
    const south = Math.min(...lats)
    const west = Math.min(...lngs)
    const north = Math.max(...lats)
    const east = Math.max(...lngs)
    // Add some padding
    map.fitBounds(
      [
        [south - 0.5, west - 0.5],
        [north + 0.5, east + 0.5],
      ],
      { padding: [40, 40] },
    )
  }, [items, map])
  return null
}

export default function NetworkMap() {
  const [query, setQuery] = React.useState("")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [mapRef, setMapRef] = React.useState<L.Map | null>(null)

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase()
    return ROUTERS.filter(
      (r) => r.name.toLowerCase().includes(q) || r.ip.includes(q) || r.location.toLowerCase().includes(q),
    )
  }, [query])

  function flyTo(id: string) {
    const r = ROUTERS.find((x) => x.id === id)
    if (r && mapRef) {
      mapRef.flyTo([r.lat, r.lng], 10, { duration: 0.7 })
      setSelectedId(id)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <Card className="col-span-1 lg:col-span-9 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Network Map</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[60vh] w-full">
            <MapContainer
              center={[-0.5, 37.0]}
              zoom={6}
              scrollWheelZoom
              className="h-full w-full"
              whenCreated={(m) => setMapRef(m)}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FitBounds items={filtered.length ? filtered : ROUTERS} />
              {(filtered.length ? filtered : ROUTERS).map((r) => {
                const c = getStatusColor(r.status)
                const highlighted = selectedId === r.id
                return (
                  <CircleMarker
                    key={r.id}
                    center={[r.lat, r.lng]}
                    pathOptions={{
                      color: highlighted ? "#2563EB" : c.stroke,
                      fillColor: c.fill,
                      fillOpacity: 0.8,
                    }}
                    radius={highlighted ? 12 : 8}
                    eventHandlers={{
                      click: () => setSelectedId(r.id),
                    }}
                  >
                    <Popup>
                      <div className="min-w-[180px]">
                        <div className="font-medium">{r.name}</div>
                        <div className="text-sm text-muted-foreground">{r.ip}</div>
                        <div className="mt-1">
                          <Badge
                            className={cn(
                              "rounded",
                              r.status === "Online" && "bg-emerald-100 text-emerald-700",
                              r.status === "Degraded" && "bg-amber-100 text-amber-800",
                              r.status === "Offline" && "bg-red-100 text-red-700",
                            )}
                          >
                            {r.status}
                          </Badge>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                )
              })}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Routers Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search name, IP, location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-3"
          />
          <div className="max-h-[52vh] overflow-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/60">
                <tr className="[&>th]:px-3 [&>th]:py-2 text-left text-muted-foreground">
                  <th>Name</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(filtered.length ? filtered : ROUTERS).map((r) => (
                  <tr
                    key={r.id}
                    className={cn("cursor-pointer border-t hover:bg-muted/60", selectedId === r.id && "bg-muted")}
                    onClick={() => flyTo(r.id)}
                  >
                    <td className="px-3 py-2">
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.location}</div>
                    </td>
                    <td className="px-3 py-2">{r.ip}</td>
                    <td className="px-3 py-2">
                      <Badge
                        className={cn(
                          "rounded",
                          r.status === "Online" && "bg-emerald-100 text-emerald-700",
                          r.status === "Degraded" && "bg-amber-100 text-amber-800",
                          r.status === "Offline" && "bg-red-100 text-red-700",
                        )}
                      >
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">
                      No routers match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">{(filtered.length ? filtered : ROUTERS).length} routers</div>
            <Button variant="outline" size="sm" className="bg-transparent" onClick={() => setSelectedId(null)}>
              Clear Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
