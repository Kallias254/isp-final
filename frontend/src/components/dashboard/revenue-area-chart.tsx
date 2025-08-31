"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { MonthDatum } from "./data"

export default function RevenueAreaChart({ data }: { data: MonthDatum[] }) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg">Revenue Trend</CardTitle>
        <CardDescription className="text-sm">Monthly Recurring Revenue (last 12 months)</CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ChartContainer
          className="h-[200px] sm:h-[280px] w-full"
          config={{
            mrr: {
              label: "MRR (KES)",
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                tickLine={false}
                axisLine={false}
                width={50}
                fontSize={12}
              />
              <Tooltip content={<ChartTooltipContent indicator="line" />} />
              <Area
                type="monotone"
                dataKey="mrr"
                name="MRR"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
