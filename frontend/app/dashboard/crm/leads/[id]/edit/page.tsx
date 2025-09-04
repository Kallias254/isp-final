'use client'

import { LeadForm } from "@/components/lead-form";
import { leads } from "@/app/dashboard/crm/leads/mock-data";
import { notFound } from "next/navigation";

export default function EditLeadPage({ params }: { params: { id: string } }) {
    const lead = leads.find(l => l.id === params.id);

    if (!lead) {
        notFound();
    }

    return <LeadForm lead={lead} />
}