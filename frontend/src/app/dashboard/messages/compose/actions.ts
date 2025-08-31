"use server"

export type BulkMessageResult = {
  ok: boolean
  error?: string
  result?: {
    sent: number
    recipientType: "users" | "plans" | "routers" | "locations" | "unregistered"
    recipients: string[] // user ids or raw addresses
    template: string | null
    preview: string
  }
}

export async function sendBulkMessage(formData: FormData): Promise<BulkMessageResult> {
  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 700))

  const recipientType = String(formData.get("recipientType") || "users") as
    | "users"
    | "plans"
    | "routers"
    | "locations"
    | "unregistered"
  const template = String(formData.get("template") || "")
  const message = String(formData.get("message") || "")

  let recipients: string[] = []

  // Get recipients based on type
  if (recipientType === "users") {
    recipients = formData.getAll("recipientIds").map((v) => String(v))
  } else if (recipientType === "unregistered") {
    recipients = formData.getAll("unregistered").map((v) => String(v))
  } else if (recipientType === "plans") {
    recipients = formData.getAll("plans").map((v) => String(v))
  } else if (recipientType === "routers") {
    recipients = formData.getAll("routers").map((v) => String(v))
  } else if (recipientType === "locations") {
    recipients = formData.getAll("locations").map((v) => String(v))
  }

  if (recipients.length === 0 && (recipientType === "users" || recipientType === "unregistered")) {
    return { ok: false, error: "Please add at least one recipient." }
  }
  if (!message.trim()) {
    return { ok: false, error: "Message cannot be empty." }
  }

  // Mock count based on recipient type
  let mockCount = recipients.length
  if (recipientType === "plans") {
    mockCount = recipients.length * 50 // Assume 50 users per plan
  } else if (recipientType === "routers") {
    mockCount = recipients.length * 30 // Assume 30 users per router
  } else if (recipientType === "locations") {
    mockCount = recipients.length * 75 // Assume 75 users per location
  }

  return {
    ok: true,
    result: {
      sent: mockCount,
      recipientType,
      recipients,
      template: template || null,
      preview: message.slice(0, 140),
    },
  }
}
