import { redirect } from "next/navigation"

export default function Page() {
  // Default to the List view
  redirect("/dashboard/leads/list")
}
