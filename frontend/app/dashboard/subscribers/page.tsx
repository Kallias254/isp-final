"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuickAddSubscriberDrawer } from "@/components/subscribers/quick-add-subscriber-drawer"
import { seedSubscribers } from "@/components/subscribers/data"
import { Search, Filter, Download, Plus, Users, UserCheck, UserX, DollarSign } from "lucide-react"
import Link from "next/link"

export default function SubscribersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  const filteredSubscribers = seedSubscribers.filter((subscriber) => {
    const matchesSearch =
      subscriber.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.mpesaPhone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || subscriber.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesPlan = planFilter === "all" || subscriber.plan === planFilter

    return matchesSearch && matchesStatus && matchesPlan
  })

  const stats = {
    total: seedSubscribers.length,
    active: seedSubscribers.filter((s) => s.status === "Active").length,
    suspended: seedSubscribers.filter((s) => s.status === "Suspended").length,
    revenue: seedSubscribers.reduce((sum, s) => sum + s.monthlyRevenue, 0),
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl 2xl:max-w-[1800px] px-4 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Subscribers</h1>
          <p className="text-muted-foreground">Manage your customer base and service subscriptions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <QuickAddSubscriberDrawer>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Subscriber
            </Button>
          </QuickAddSubscriberDrawer>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
            <p className="text-xs text-muted-foreground">Service suspended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all subscribers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Subscriber List</CardTitle>
          <CardDescription>View and manage all subscribers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          <div className="mt-4 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subscriber</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link href={`/dashboard/subscribers/${subscriber.id}`} className="block">
                        <div>
                          <div className="font-medium">{`${subscriber.firstName} ${subscriber.lastName}`}</div>
                          <div className="text-sm text-muted-foreground">{subscriber.mpesaPhone}</div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/subscribers/${subscriber.id}`} className="block">
                        <div className="font-mono text-sm">{subscriber.accountNumber}</div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/subscribers/${subscriber.id}`} className="block">
                        <Badge variant="outline">{subscriber.plan}</Badge>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/subscribers/${subscriber.id}`} className="block">
                        <Badge
                          variant={
                            subscriber.status === "Active"
                              ? "default"
                              : subscriber.status === "Suspended"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {subscriber.status}
                        </Badge>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/subscribers/${subscriber.id}`} className="block">
                        <div className="font-medium">KSh {subscriber.monthlyRevenue.toLocaleString()}</div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/subscribers/${subscriber.id}`} className="block">
                        {subscriber.location}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/subscribers/${subscriber.id}`} className="block">
                        <div className="text-sm">{subscriber.lastPayment}</div>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing {filteredSubscribers.length} of {seedSubscribers.length} subscribers
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
