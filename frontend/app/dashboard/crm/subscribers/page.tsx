import * as React from "react"
import { ColumnFiltersState, SortingState, VisibilityState, Table } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconLayoutColumns, IconChevronDown } from "@tabler/icons-react"
import { Subscriber } from "@/payload-types"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { SubscribersTable } from "./subscribers-table"
import { cookies } from 'next/headers'; // Import cookies

async function getSubscribers() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('payload-token')?.value; // Get token from cookies

    const response = await apiFetch('/subscribers', {}, token); // Pass token to apiFetch
    if (!response.ok) {
      throw new Error('Failed to fetch subscribers');
    }
    const data = await response.json();
    return data.docs as Subscriber[];
  } catch (error) {
    console.error(error);
    return []; // Return an empty array on error
  }
}

export default async function SubscribersPage() {
  const subscribersData = await getSubscribers();

  return (
    <div className="container mx-auto py-10">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard/crm">CRM</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Subscribers</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between my-4">
            <div>
                <h1 className="text-2xl font-bold">Subscribers</h1>
                <p className="text-muted-foreground">Manage your subscribers.</p>
            </div>
            <Link href="/dashboard/crm/subscribers/new">
                <Button>Create Subscriber</Button>
            </Link>
        </div>
      <SubscribersTable initialData={subscribersData} />
    </div>
  )
}
