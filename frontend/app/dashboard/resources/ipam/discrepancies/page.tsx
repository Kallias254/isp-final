import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ResourcesTabs } from "@/components/resources/resources-tabs"
import { IpamSubtabs } from "@/components/resources/ipam-subtabs"
import { seedDiscrepancies } from "@/components/resources/ipam-data"

export default function IpamDiscrepanciesPage() {
  const rows = seedDiscrepancies

  return (
    <div className="mx-auto max-w-[1400px]">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/resources/inventory">Resources</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>IPAM</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Discrepancies</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="mt-1 text-xl font-semibold">IPAM Discrepancies</h1>
      </div>

      <div className="mt-4 space-y-3">
        <ResourcesTabs />
        <IpamSubtabs />
      </div>

      <Card className="mt-2">
        <CardHeader>
          <CardTitle className="text-base">Detected IPAM Discrepancies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">IP Address</TableHead>
                  <TableHead className="min-w-[180px]">Discrepancy Type</TableHead>
                  <TableHead className="min-w-[160px]">Router</TableHead>
                  <TableHead className="min-w-[260px]">Details</TableHead>
                  <TableHead className="min-w-[160px]">Detected At</TableHead>
                  <TableHead className="min-w-[120px]">Resolved</TableHead>
                  <TableHead className="min-w-[120px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No IPAM discrepancies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.ip}</TableCell>
                      <TableCell>{d.type}</TableCell>
                      <TableCell>{d.router ?? "-"}</TableCell>
                      <TableCell className="truncate" title={d.details}>
                        {d.details ?? "-"}
                      </TableCell>
                      <TableCell>{new Date(d.detectedAt).toLocaleString()}</TableCell>
                      <TableCell>{d.resolved ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <Link className="text-sm text-primary underline" href="#">
                          Resolve
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
