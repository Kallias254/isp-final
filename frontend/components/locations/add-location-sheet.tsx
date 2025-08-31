"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import type L from "leaflet"

type ContactRow = { id: string; name: string; role?: string; phone?: string }

export function AddLocationSheet({
  onCreate,
}: {
  onCreate: (payload: {
    name: string
    address?: string
    lat?: number
    lng?: number
    notes?: string
    contacts: { name: string; role?: string; phone?: string }[]
  }) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [lat, setLat] = React.useState<number | undefined>(undefined)
  const [lng, setLng] = React.useState<number | undefined>(undefined)
  const [notes, setNotes] = React.useState("")
  const [contacts, setContacts] = React.useState<ContactRow[]>([])
  const [map, setMap] = React.useState<L.Map | null>(null)

  function addContact() {
    setContacts((prev) => [...prev, { id: crypto.randomUUID(), name: "", role: "", phone: "" }])
  }
  function removeContact(id: string) {
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }
  function updateContact(id: string, patch: Partial<ContactRow>) {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  function pinCurrentLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords
      setLat(latitude)
      setLng(longitude)
      map?.flyTo([latitude, longitude], 14)
    })
  }

  function onSave() {
    if (!name.trim()) return
    onCreate({
      name: name.trim(),
      address: address.trim() || undefined,
      lat,
      lng,
      notes: notes.trim() || undefined,
      contacts: contacts
        .filter((c) => c.name || c.role || c.phone)
        .map((c) => ({ name: c.name.trim(), role: c.role?.trim(), phone: c.phone?.trim() })),
    })
    setOpen(false)
    setName("")
    setAddress("")
    setLat(undefined)
    setLng(undefined)
    setNotes("")
    setContacts([])
  }

  function ClickToSetMarker() {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat)
        setLng(e.latlng.lng)
      },
    })
    return null
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="whitespace-nowrap">+ Add New Location</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Add Service Location</SheetTitle>
        </SheetHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="loc-name">Location Name</Label>
            <Input id="loc-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="loc-addr">Address</Label>
            <Textarea
              id="loc-addr"
              placeholder="Street, Building, etc."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                inputMode="decimal"
                value={lat ?? ""}
                onChange={(e) => setLat(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                inputMode="decimal"
                value={lng ?? ""}
                onChange={(e) => setLng(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="notes">Description/Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[90px]" />
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" className="bg-transparent" onClick={pinCurrentLocation}>
              Pin Current Location
            </Button>
          </div>

          <div className="h-56 w-full overflow-hidden rounded-md border">
            <MapContainer
              center={[-1.286389, 36.817223]}
              zoom={6}
              className="h-full w-full"
              whenCreated={(m) => setMap(m)}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ClickToSetMarker />
              {typeof lat === "number" && typeof lng === "number" ? <Marker position={[lat, lng]} /> : null}
            </MapContainer>
          </div>

          {/* Contacts */}
          <div className="grid gap-2">
            <div className="text-sm font-medium text-muted-foreground">Contact Persons</div>
            {contacts.map((c) => (
              <div key={c.id} className="grid grid-cols-[1fr_1fr_1fr_32px] items-center gap-2">
                <Input
                  placeholder="Name"
                  value={c.name}
                  onChange={(e) => updateContact(c.id, { name: e.target.value })}
                />
                <Input
                  placeholder="Role (e.g., Caretaker)"
                  value={c.role}
                  onChange={(e) => updateContact(c.id, { role: e.target.value })}
                />
                <Input
                  placeholder="Phone"
                  value={c.phone}
                  onChange={(e) => updateContact(c.id, { phone: e.target.value })}
                />
                <button
                  type="button"
                  aria-label="Remove contact"
                  className="inline-flex h-9 w-8 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted"
                  onClick={() => removeContact(c.id)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addContact} className="w-fit bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Location</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
