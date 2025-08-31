"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { MonthDatum } from "./data"

export default function SubscribersBarChart({ data }: { data: MonthDatum[] }) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg">Subscribers Growth</CardTitle>
        <CardDescription className="text-sm">Net adds, new adds, and churn per month</CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ChartContainer
          className="h-[200px] sm:h-[280px] w-full"
          config={{
            adds: {
              label: "New Adds",
              color: "hsl(var(--chart-2))",
            },
            churn: {
              label: "Churn",
              color: "hsl(var(--chart-3))",
            },
            netAdds: {
              label: "Net Adds",
              color: "hsl(var(--chart-4))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barCategoryGap={12} barGap={6}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} width={32} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="adds" name="New Adds" fill="hsl(var(--chart-2))" radius={4} />
              <Bar dataKey="churn" name="Churn" fill="hsl(var(--chart-3))" radius={4} />
              <Bar dataKey="netAdds" name="Net Adds" fill="hsl(var(--chart-4))" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
