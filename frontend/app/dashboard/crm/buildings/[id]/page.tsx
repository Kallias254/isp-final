'use client'

import { notFound } from "next/navigation";
import { Building, ServiceLocation } from "@/payload-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useSWR from "swr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitsDataTable } from "./units-data-table";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BuildingDetailPage({ params }: { params: { id: string } }) {
  const { data: building, error } = useSWR<Building>(
    `/api/buildings/${params.id}`,
    fetcher
  );

  if (error) return <div>Failed to load building</div>;
  if (!building) return <div>Loading...</div>;

  if (!building) {
    notFound();
  }

  const location = building.serviceLocation as ServiceLocation;

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
            <BreadcrumbLink href="/dashboard/crm/buildings">Buildings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{building.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="my-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{building.name}</h1>
        <Link href={`/dashboard/crm/buildings/${building.id}/edit`}>
          <Button>Edit Building</Button>
        </Link>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="units">Units</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{building.status}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{location?.name || 'N/A'}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="units">
          <UnitsDataTable buildingId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
