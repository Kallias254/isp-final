import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getLeads, type Lead } from "@/components/leads/data"

type PageProps = {
  params: { id: string }
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-baseline gap-3 py-2">
      <div className="text-muted-foreground w-40 shrink-0 text-sm">{label}</div>
      <div className="text-sm">{value && value !== "" ? value : "N/A"}</div>
    </div>
  )
}

export default async function LeadDetailPage({ params }: PageProps) {
  const leads = getLeads()
  const lead: Lead | undefined = leads.find((l) => l.id === params.id)

  if (!lead) {
    notFound()
  }

  const title = lead?.name ?? "Lead"

  return (
    <main className="p-4 md:p-6 lg:p-8">
      {/* Top row: breadcrumb and back button */}
      <div className="mb-4 flex items-center justify-between">
        <nav className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-1">
            <li>
              <Link href="/dashboard" className="hover:underline">
                {"Dashboard"}
              </Link>
            </li>
            <li className="px-1">{"/"}</li>
            <li>
              <Link href="/dashboard/leads" className="hover:underline">
                {"Leads"}
              </Link>
            </li>
            <li className="px-1">{"/"}</li>
            <li className="text-foreground">{title}</li>
          </ol>
        </nav>
        <Button asChild variant="outline" size="sm" className="gap-2 bg-transparent">
          <Link href="/dashboard/leads">
            <ArrowLeft className="h-4 w-4" />
            {"Back to Leads"}
          </Link>
        </Button>
      </div>

      <h1 className="mb-4 text-xl font-semibold">{`Lead: ${title}`}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{"Manage details, notes, and communications for this lead."}</p>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="sr-only">{"Lead Details"}</CardTitle>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="h-10">
              <TabsTrigger value="details">{"Details"}</TabsTrigger>
              <TabsTrigger value="notes">{"Notes"}</TabsTrigger>
              <TabsTrigger value="comms">{"Communications"}</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <CardContent className="p-0">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <InfoRow label="Status" value={lead?.status} />
                    <InfoRow label="Source" value={lead?.source} />
                    <InfoRow label="Assigned To" value={lead?.assignedTo} />
                    <InfoRow
                      label="Follow-up Date"
                      value={lead?.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : "N/A"}
                    />
                  </div>
                  <div>
                    {/* These fields are not in the mock Lead type; shown as N/A to match the reference layout */}
                    <InfoRow label="Phone" value={null} />
                    <InfoRow label="Email" value={null} />
                    <InfoRow label="Service Location" value={lead?.location} />
                    <InfoRow label="Apartment" value={null} />
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <CardContent className="p-0">
                <div className="rounded-md border bg-muted/30 p-4 text-sm">
                  {"No notes yet."}{" "}
                  <span className="text-muted-foreground">
                    {"Add your first note from the lead timeline or actions."}
                  </span>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="comms" className="mt-4">
              <CardContent className="p-0">
                <div className="rounded-md border bg-muted/30 p-4 text-sm">
                  {"No communications logged yet."}{" "}
                  <span className="text-muted-foreground">{"Track emails, calls, or messages here."}</span>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </main>
  )
}
