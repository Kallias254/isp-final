"use client"

import * as React from "react"
import Link from "next/link"
import { useActionState } from "react"
import { sendBulkMessage, type BulkMessageResult } from "./actions"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { MultiCombobox, type MultiOption } from "@/components/forms/multi-combobox"
import { MultiTextInputChips } from "@/components/forms/multi-text-input-chips"

const templates = [
  { id: "", name: "-- Select a Template --" },
  { id: "outage-notice", name: "Outage Notice" },
  { id: "maintenance", name: "Maintenance Window" },
  { id: "promo-upgrade", name: "Plan Upgrade Promo" },
  { id: "payment-reminder", name: "Payment Reminder" },
  { id: "welcome", name: "Welcome Message" },
]

/**
 * Demo option sets — wire to your backend when ready.
 */
const plans: MultiOption[] = [
  { value: "silver", label: "Silver Plan", hint: "Basic internet package" },
  { value: "gold", label: "Gold Plan", hint: "Standard internet package" },
  { value: "platinum", label: "Platinum Plan", hint: "Premium internet package" },
  { value: "business", label: "Business Plan", hint: "Commercial internet package" },
]

const routers: MultiOption[] = [
  { value: "local_router", label: "Local Router", hint: "Downtown area" },
  { value: "core_router", label: "Core Router", hint: "Main distribution" },
  { value: "edge_router", label: "Edge Router", hint: "Suburban areas" },
  { value: "backup_router", label: "Backup Router", hint: "Redundancy system" },
]

const locations: MultiOption[] = [
  { value: "downtown", label: "Downtown", hint: "City center area" },
  { value: "northside", label: "Northside", hint: "North residential area" },
  { value: "riverside", label: "Riverside", hint: "Waterfront district" },
  { value: "tech_park", label: "Tech Park", hint: "Technology business district" },
  { value: "suburbs", label: "Suburbs", hint: "Suburban residential areas" },
]

// Example "users" to pick recipients from. Replace with your real data.
const userDirectory: MultiOption[] = [
  { value: "u_1", label: "Jane Smith", hint: "jane.smith@example.com" },
  { value: "u_2", label: "John Doe", hint: "john.doe@example.com" },
  { value: "u_3", label: "Alex Kim", hint: "alex.kim@example.com" },
  { value: "u_4", label: "Samira Patel", hint: "samira.patel@example.com" },
  { value: "u_5", label: "Michael Chen", hint: "michael.chen@example.com" },
  { value: "u_6", label: "Sarah Johnson", hint: "sarah.johnson@example.com" },
]

type ActionState = undefined | BulkMessageResult

export default function ComposeMessagePage() {
  const { toast } = useToast()
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(sendBulkMessage, undefined)
  const [activeTab, setActiveTab] = React.useState<"users" | "plans" | "routers" | "locations" | "unregistered">(
    "users",
  )
  const [message, setMessage] = React.useState("")

  React.useEffect(() => {
    if (!state) return
    if (state.ok && state.result) {
      const recipientTypeLabel = {
        users: "user(s)",
        plans: "plan subscriber(s)",
        routers: "router subscriber(s)",
        locations: "location subscriber(s)",
        unregistered: "recipient(s)",
      }[state.result.recipientType]

      toast({
        title: "Bulk message queued",
        description: `Targeted ${state.result.sent} ${recipientTypeLabel}.`,
      })
      setMessage("")
    } else if (!state.ok) {
      toast({ title: "Unable to send", description: state.error ?? "Unknown error", variant: "destructive" })
    }
  }, [state, toast])

  return (
    <div className="mx-auto w-full max-w-screen-2xl 2xl:max-w-[1800px] px-4 md:px-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/messages/compose">Messages</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Compose</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-xl font-semibold">Compose Message</h1>
        </div>
        <div className="mt-2 md:mt-0">
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/dashboard/leads/list">Leads List</Link>
          </Button>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Audience & Content</CardTitle>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
            <TabsList className="h-auto flex-wrap justify-start gap-2">
              <TabsTrigger value="users">Send to Users</TabsTrigger>
              <TabsTrigger value="plans">Send to Plans</TabsTrigger>
              <TabsTrigger value="routers">Send to Routers</TabsTrigger>
              <TabsTrigger value="locations">Send to Locations</TabsTrigger>
              <TabsTrigger value="unregistered">Send to Unregistered</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form action={formAction} className="grid gap-6">
            {/* Hidden to pass recipient type */}
            <input type="hidden" name="recipientType" value={activeTab} />

            {/* Recipient chooser - only for users and unregistered */}
            {activeTab === "users" && (
              <MultiCombobox
                name="recipientIds"
                label="Recipients"
                options={userDirectory}
                placeholder="Select one or more users…"
              />
            )}

            {activeTab === "unregistered" && (
              <MultiTextInputChips
                name="unregistered"
                label="Recipients"
                placeholder="Type phone or email and press Enter…"
                helperText="Add one or more phone numbers or emails."
                validate={(v) => v.length > 2}
              />
            )}

            {/* Plan selection */}
            {activeTab === "plans" && (
              <MultiCombobox
                name="plans"
                label="Select Plans"
                options={plans}
                placeholder="Select one or more plans…"
              />
            )}

            {/* Router selection */}
            {activeTab === "routers" && (
              <MultiCombobox
                name="routers"
                label="Select Routers"
                options={routers}
                placeholder="Select one or more routers…"
              />
            )}

            {/* Location selection */}
            {activeTab === "locations" && (
              <MultiCombobox
                name="locations"
                label="Select Locations"
                options={locations}
                placeholder="Select one or more locations…"
              />
            )}

            <Separator />

            {/* Template */}
            <div className="grid gap-2">
              <Label htmlFor="template">Select Template</Label>
              <select
                id="template"
                name="template"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                defaultValue={templates[0].id}
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[180px]"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{message.length} characters</span>
                <span>Press Cmd/Ctrl+Enter to send</span>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-40"
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    // allow keyboard submit
                  }
                }}
              >
                {isPending ? "Sending..." : "Send Message"}
              </Button>
            </div>

            {/* SR helper */}
            <span className="sr-only" aria-live="polite">
              {state?.ok ? "Message sent successfully" : state?.error ? "Message failed" : ""}
            </span>

            {/* Optional: Debug summary for quick confirmation */}
            {state?.ok && state.result ? (
              <div className="rounded-md border p-3 text-xs text-muted-foreground">
                <div>Recipient Type: {state.result.recipientType}</div>
                <div>Recipients: {state.result.recipients.join(", ")}</div>
                <div>Template: {state.result.template || "None"}</div>
                <div>Preview: "{state.result.preview}"</div>
              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
