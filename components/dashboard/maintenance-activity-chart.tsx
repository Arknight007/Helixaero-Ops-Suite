"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", scheduled: 12, unscheduled: 5, predictive: 3 },
  { month: "Feb", scheduled: 15, unscheduled: 4, predictive: 5 },
  { month: "Mar", scheduled: 18, unscheduled: 6, predictive: 7 },
  { month: "Apr", scheduled: 14, unscheduled: 3, predictive: 6 },
  { month: "May", scheduled: 16, unscheduled: 5, predictive: 8 },
  { month: "Jun", scheduled: 20, unscheduled: 4, predictive: 9 },
]

export function MaintenanceActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Activity Trends</CardTitle>
        <CardDescription>Monthly maintenance operations breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            scheduled: { label: "Scheduled", color: "#0ea5e9" },
            unscheduled: { label: "Unscheduled", color: "#f59e0b" },
            predictive: { label: "Predictive", color: "#10b981" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="scheduled" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="unscheduled" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="predictive" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
