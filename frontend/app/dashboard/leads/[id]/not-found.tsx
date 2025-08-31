import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LeadNotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">{"Lead not found"}</h1>
      <p className="text-muted-foreground">{"The lead you’re looking for does not exist or may have been removed."}</p>
      <Button asChild>
        <Link href="/dashboard/leads">{"Back to Leads"}</Link>
      </Button>
    </div>
  )
}
