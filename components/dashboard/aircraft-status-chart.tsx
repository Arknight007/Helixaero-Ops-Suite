"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "Operational", value: 3, color: "#10b981" },
  { name: "Maintenance", value: 1, color: "#f59e0b" },
  { name: "Grounded", value: 0, color: "#ef4444" },
  { name: "In Flight", value: 1, color: "#0ea5e9" },
]

export function AircraftStatusChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aircraft Status Distribution</CardTitle>
        <CardDescription>Current fleet status breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            operational: { label: "Operational", color: "#10b981" },
            maintenance: { label: "Maintenance", color: "#f59e0b" },
            grounded: { label: "Grounded", color: "#ef4444" },
            inFlight: { label: "In Flight", color: "#0ea5e9" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
