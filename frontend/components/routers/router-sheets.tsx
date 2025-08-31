"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Loader2, Radio } from "lucide-react"
import type { RouterItem } from "./data"
import { StatusPill } from "./status-pill"
import { Badge } from "@/components/ui/badge"

type BaseValues = {
  name: string
  ip: string
  apiUser: string
  apiPort: string
  apiPass: string
  description?: string
  location?: string
}

function PasswordField({
  value,
  onChange,
  id = "apiPass",
}: {
  id?: string
  value: string
  onChange: (v: string) => void
}) {
  const [show, setShow] = React.useState(false)
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter API password"
        aria-describedby={id + "-hint"}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      <p id={id + "-hint"} className="mt-1 text-xs text-muted-foreground">
        The password for the MikroTik API user.
      </p>
    </div>
  )
}

export function CreateRouterSheet({ onCreate }: { onCreate: (values: BaseValues) => void }) {
  const [open, setOpen] = React.useState(false)
  const [values, setValues] = React.useState<BaseValues>({
    name: "",
    ip: "",
    apiUser: "",
    apiPort: "8728",
    apiPass: "",
    description: "",
    location: "",
  })
  const [testing, setTesting] = React.useState<"idle" | "pending" | "ok" | "fail">("idle")

  async function testConnection() {
    setTesting("pending")
    await new Promise((r) => setTimeout(r, 900))
    // naive check: if ip includes "127" fail; else ok
    setTesting(values.ip.includes("127") ? "fail" : "ok")
  }

  function reset() {
    setValues({ name: "", ip: "", apiUser: "", apiPort: "8728", apiPass: "", description: "", location: "" })
    setTesting("idle")
  }

  function submit() {
    if (!values.name.trim() || !values.ip.trim() || !values.apiUser.trim() || !values.apiPort.trim()) return
    onCreate(values)
    setOpen(false)
    reset()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="whitespace-nowrap">+ Add New Router</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            Router Details
          </SheetTitle>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-transparent"
              onClick={testConnection}
              disabled={testing === "pending"}
            >
              {testing === "pending" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Test connection
            </Button>
            {testing !== "idle" && (
              <Badge className={testing === "ok" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                {testing === "ok" ? "Reachable" : testing === "fail" ? "Unreachable" : "Testing..."}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="mt-4 grid gap-6">
          {/* Connection */}
          <div className="grid gap-2">
            <div className="text-sm font-medium text-muted-foreground">Connection</div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="name">Router Name</Label>
                <Input
                  id="name"
                  placeholder='e.g., "Main Office RB"'
                  value={values.name}
                  onChange={(e) => setValues({ ...values, name: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="ip">IP Address / Hostname</Label>
                <Input
                  id="ip"
                  placeholder="192.168.88.1 or router.yourdomain.com"
                  value={values.ip}
                  onChange={(e) => setValues({ ...values, ip: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="apiUser">API Username</Label>
                <Input
                  id="apiUser"
                  placeholder="api"
                  value={values.apiUser}
                  onChange={(e) => setValues({ ...values, apiUser: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="apiPort">API Port</Label>
                <Input
                  id="apiPort"
                  placeholder="8728 (8729 for SSL)"
                  value={values.apiPort}
                  onChange={(e) => setValues({ ...values, apiPort: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="apiPass">API Password</Label>
              <PasswordField value={values.apiPass} onChange={(v) => setValues({ ...values, apiPass: v })} />
            </div>
          </div>

          {/* Metadata */}
          <div className="grid gap-2">
            <div className="text-sm font-medium text-muted-foreground">Metadata</div>
            <div className="grid gap-1.5">
              <Label htmlFor="desc">Description (Optional)</Label>
              <Textarea
                id="desc"
                placeholder="Notes about this router..."
                value={values.description}
                onChange={(e) => setValues({ ...values, description: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Physical Location (Optional)</Label>
              <Select value={values.location ?? "None"} onValueChange={(v) => setValues({ ...values, location: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="-- Select Location --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Nairobi HQ">Nairobi HQ</SelectItem>
                  <SelectItem value="Mombasa Edge">Mombasa Edge</SelectItem>
                  <SelectItem value="Kisumu POP">Kisumu POP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Create Router</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function EditRouterSheet({
  router,
  onSave,
  trigger,
}: {
  router: RouterItem
  onSave: (values: Partial<RouterItem>) => void
  trigger: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [values, setValues] = React.useState<BaseValues>({
    name: router.name,
    ip: router.ip,
    apiUser: router.apiUser,
    apiPort: String(router.apiPort),
    apiPass: "",
    description: router.description ?? "",
    location: router.location ?? "None",
  })
  const [testing, setTesting] = React.useState<"idle" | "pending" | "ok" | "fail">("idle")

  async function testConnection() {
    setTesting("pending")
    await new Promise((r) => setTimeout(r, 900))
    setTesting(values.ip.includes("127") ? "fail" : "ok")
  }

  function submit() {
    onSave({
      name: values.name,
      ip: values.ip,
      apiUser: values.apiUser,
      apiPort: Number(values.apiPort || router.apiPort),
      description: values.description,
      location: values.location,
    })
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="flex items-center gap-2">
            <StatusPill status={router.status} />
            Edit Router
          </SheetTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Last checked: {new Date(router.lastChecked).toLocaleString()}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="bg-transparent"
              onClick={testConnection}
              disabled={testing === "pending"}
            >
              {testing === "pending" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Test
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-4 grid gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="er-name">Router Name</Label>
              <Input
                id="er-name"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="er-ip">IP Address / Hostname</Label>
              <Input id="er-ip" value={values.ip} onChange={(e) => setValues({ ...values, ip: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="er-user">API Username</Label>
              <Input
                id="er-user"
                value={values.apiUser}
                onChange={(e) => setValues({ ...values, apiUser: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="er-port">API Port</Label>
              <Input
                id="er-port"
                value={values.apiPort}
                onChange={(e) => setValues({ ...values, apiPort: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="er-desc">Description (Optional)</Label>
            <Textarea
              id="er-desc"
              value={values.description}
              onChange={(e) => setValues({ ...values, description: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Physical Location (Optional)</Label>
            <Select value={values.location ?? "None"} onValueChange={(v) => setValues({ ...values, location: v })}>
              <SelectTrigger>
                <SelectValue placeholder="-- Select Location --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Nairobi HQ">Nairobi HQ</SelectItem>
                <SelectItem value="Mombasa Edge">Mombasa Edge</SelectItem>
                <SelectItem value="Kisumu POP">Kisumu POP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={submit}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
