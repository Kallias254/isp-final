'use client'

import { BuildingForm } from "@/components/building-form";
import { buildings } from "@/app/dashboard/crm/buildings/mock-data";
import { notFound } from "next/navigation";

export default function EditBuildingPage({ params }: { params: { id: string } }) {
    const building = buildings.find(b => b.id === params.id);

    if (!building) {
        notFound();
    }

    return <BuildingForm building={building} />
}