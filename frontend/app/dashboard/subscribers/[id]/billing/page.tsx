"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SubscriberBillingPage() {
  return (
    <div className="space-y-6">
      {/* Billing Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Billing Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Billing Cycle</Label>
              <Select defaultValue="monthly">
                <SelectTrigger>
                  <SelectValue placeholder="Select cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Next Billing Date</Label>
              <Input type="date" defaultValue="2025-09-10" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="grid grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-foreground">Current Plan:</span> Gold
                </div>
                <div>
                  <span className="font-medium text-foreground">Current Billing Cycle:</span> Monthly
                </div>
                <div>
                  <span className="font-medium text-foreground">Trial Active:</span> No
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-foreground">Next Billing Date:</span> 9/10/2025
                </div>
                <div>
                  <span className="font-medium text-foreground">Account Credit Balance:</span> KES 0.00
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-transparent">
                Schedule Plan Change
              </Button>
              <Button>Save Billing Controls</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Initial Installation Charges</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No installation charges recorded during sign-up.
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Invoices (Last 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No invoices found for this subscriber.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Payments (Last 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No payments found for this subscriber.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <p>{"© 2025. Your Company Name. All Rights Reserved."}</p>
        <p>{"Created by: Your Name/Company"}</p>
      </div>
    </div>
  )
}
