"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEVICE_TYPES, STATUSES, type DeviceType, type InventoryStatus } from "./inventory-data"

export function InventoryAddSheet({
  onCreate,
}: {
  onCreate: (payload: {
    name: string
    type: DeviceType
    status: InventoryStatus
    serial?: string
    model?: string
    purchaseDate?: string
    warrantyEnd?: string
    notes?: string
    serviceLocation?: string
    assignedSubscriber?: string
  }) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [type, setType] = React.useState<DeviceType>("Router")
  const [status, setStatus] = React.useState<InventoryStatus>("In Stock")
  const [serial, setSerial] = React.useState("")
  const [model, setModel] = React.useState("")
  const [purchaseDate, setPurchaseDate] = React.useState("")
  const [warrantyEnd, setWarrantyEnd] = React.useState("")
  const [notes, setNotes] = React.useState("")
  const [serviceLocation, setServiceLocation] = React.useState("")
  const [assignedSubscriber, setAssignedSubscriber] = React.useState("")

  function submit() {
    if (!name.trim()) return
    onCreate({
      name: name.trim(),
      type,
      status,
      serial: serial.trim() || undefined,
      model: model.trim() || undefined,
      purchaseDate: purchaseDate || undefined,
      warrantyEnd: warrantyEnd || undefined,
      notes: notes.trim() || undefined,
      serviceLocation: serviceLocation.trim() || undefined,
      assignedSubscriber: assignedSubscriber.trim() || undefined,
    })
    setOpen(false)
    setName("")
    setSerial("")
    setModel("")
    setPurchaseDate("")
    setWarrantyEnd("")
    setNotes("")
    setServiceLocation("")
    setAssignedSubscriber("")
    setType("Router")
    setStatus("In Stock")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="whitespace-nowrap">+ Add Inventory Item</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Inventory Item Details</SheetTitle>
        </SheetHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="inv-name">Item Name</Label>
            <Input id="inv-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Device Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as DeviceType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Device Type" />
                </SelectTrigger>
                <SelectContent>
                  {DEVICE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as InventoryStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="inv-serial">Serial Number</Label>
              <Input id="inv-serial" value={serial} onChange={(e) => setSerial(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="inv-model">Model</Label>
              <Input id="inv-model" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="inv-purchase">Purchase Date</Label>
              <Input
                id="inv-purchase"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="inv-warranty">Warranty End Date</Label>
              <Input
                id="inv-warranty"
                type="date"
                value={warrantyEnd}
                onChange={(e) => setWarrantyEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="inv-notes">Notes</Label>
            <Textarea
              id="inv-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[90px]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="inv-loc">Service Location</Label>
              <Input
                id="inv-loc"
                placeholder="Select Location"
                value={serviceLocation}
                onChange={(e) => setServiceLocation(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="inv-subscriber">Assigned Subscriber</Label>
              <Input
                id="inv-subscriber"
                placeholder="Search subscriber"
                value={assignedSubscriber}
                onChange={(e) => setAssignedSubscriber(e.target.value)}
              />
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Add Item</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
