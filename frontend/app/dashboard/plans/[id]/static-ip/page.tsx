"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const AVAILABLE_SUBNETS = ["10.0.10.0/24", "10.0.20.0/24", "10.0.30.0/24", "192.168.1.0/24", "10.1.0.0/24"]

export default function PlanStaticIpPage() {
  const { toast } = useToast()
  const [selected, setSelected] = React.useState<string[]>(["10.0.10.0/24", "10.0.20.0/24", "10.0.30.0/24"])
  const [showPicker, setShowPicker] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return AVAILABLE_SUBNETS
    return AVAILABLE_SUBNETS.filter((s) => s.toLowerCase().includes(q))
  }, [query])

  function toggleSubnet(cidr: string) {
    setSelected((prev) => (prev.includes(cidr) ? prev.filter((s) => s !== cidr) : [...prev, cidr]))
  }

  function selectAll() {
    setSelected(Array.from(new Set([...selected, ...filtered])))
  }

  function clearAll() {
    setSelected((prev) => prev.filter((s) => !filtered.includes(s)))
  }

  function save() {
    toast({ title: "Static IP settings saved", description: `${selected.length} subnet(s) associated.` })
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Static IP Subnet Associations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label>Associated IP Subnets</Label>
            <div className="flex flex-wrap gap-1">
              {selected.length === 0 ? (
                <span className="text-xs text-muted-foreground">No subnets selected.</span>
              ) : (
                selected.map((s) => (
                  <Badge key={s} variant="secondary" className="rounded">
                    {s}
                  </Badge>
                ))
              )}
            </div>

            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                className="bg-transparent"
                onClick={() => setShowPicker((v) => !v)}
              >
                {showPicker ? "Hide Subnet Picker" : "Manage Subnets"}
              </Button>
            </div>

            {showPicker && (
              <div className="mt-3 rounded-md border p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Input
                    placeholder="Search subnets..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="sm:max-w-sm"
                    aria-label="Search subnets"
                  />
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" className="bg-transparent" onClick={selectAll}>
                      Select All
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="bg-transparent" onClick={clearAll}>
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {filtered.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No subnets match your search.</div>
                  ) : (
                    filtered.map((s) => {
                      const checked = selected.includes(s)
                      return (
                        <label
                          key={s}
                          className="flex cursor-pointer items-center gap-2 rounded-md border p-2 hover:bg-muted/60"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleSubnet(s)}
                            aria-label={`Toggle ${s}`}
                          />
                          <span className="text-sm">{s}</span>
                        </label>
                      )
                    })
                  )}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Select subnets for static IP assignment. Use the picker to add/remove associations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="enf" />
            <Label htmlFor="enf">Enforce unique static IP assignment</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" className="min-w-40">
          Save Subnet Associations
        </Button>
      </div>
    </form>
  )
}
