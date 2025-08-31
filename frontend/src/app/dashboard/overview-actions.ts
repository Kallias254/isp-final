"use server"

export async function addSmsCredits(formData: FormData) {
  // Simulate processing latency
  await new Promise((r) => setTimeout(r, 600))
  const current = Number(formData.get("current") ?? 0)
  const add = Number(formData.get("add") ?? 0)
  const newBalance = Math.max(0, current + add)
  return { ok: true, newBalance }
}
