"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function IpamAddSubnetSheet({
  onCreate,
}: {
  onCreate: (payload: { name: string; cidr: string; gateway?: string; dns?: string; router?: string }) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [cidr, setCidr] = React.useState("")
  const [gateway, setGateway] = React.useState("")
  const [dns, setDns] = React.useState("")
  const [router, setRouter] = React.useState("None")

  function submit() {
    if (!name.trim() || !cidr.trim()) return
    onCreate({
      name: name.trim(),
      cidr: cidr.trim(),
      gateway: gateway.trim() || undefined,
      dns: dns.trim() || undefined,
      router: router === "None" ? undefined : router,
    })
    setOpen(false)
    setName("")
    setCidr("")
    setGateway("")
    setDns("")
    setRouter("None")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="whitespace-nowrap">+ Add New Subnet</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Add New IP Subnet</SheetTitle>
        </SheetHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="sn-name">Subnet Name</Label>
            <Input id="sn-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sn-cidr">Network (CIDR)</Label>
            <Input
              id="sn-cidr"
              placeholder="e.g., 192.168.1.0/24"
              value={cidr}
              onChange={(e) => setCidr(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sn-gw">Gateway IP (Optional)</Label>
            <Input
              id="sn-gw"
              placeholder="e.g., 192.168.1.1"
              value={gateway}
              onChange={(e) => setGateway(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sn-dns">DNS Servers (Comma-separated, Optional)</Label>
            <Input id="sn-dns" placeholder="8.8.8.8, 1.1.1.1" value={dns} onChange={(e) => setDns(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Assigned Router (Optional)</Label>
            <Select value={router} onValueChange={setRouter}>
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="local_router">local_router</SelectItem>
                <SelectItem value="core_router">core_router</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button onClick={submit}>Add Subnet</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
