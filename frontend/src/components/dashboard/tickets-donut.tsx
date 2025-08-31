"use client"

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart"
import { getTicketsBreakdown } from "./data"

const COLORS = {
  Open: "hsl(var(--chart-2))",
  Pending: "hsl(var(--chart-3))",
  Closed: "hsl(var(--chart-4))",
}

export default function TicketsDonut() {
  const data = getTicketsBreakdown()

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg">Tickets by Status</CardTitle>
        <CardDescription className="text-sm">Open vs Pending vs Closed</CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ChartContainer
          className="h-[200px] sm:h-[260px] w-full"
          config={{
            Open: {
              label: "Open",
              color: "hsl(var(--chart-2))",
            },
            Pending: {
              label: "Pending",
              color: "hsl(var(--chart-3))",
            },
            Closed: {
              label: "Closed",
              color: "hsl(var(--chart-4))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} strokeWidth={4}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name as keyof typeof COLORS] || "hsl(var(--chart-1))"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
