import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Activity, DollarSign } from "lucide-react"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Fetch analytics data
  const [{ count: totalWorkOrders }, { count: completedWorkOrders }, { data: parts }, { data: aircraft }] =
    await Promise.all([
      supabase.from("work_orders").select("*", { count: "exact", head: true }),
      supabase.from("work_orders").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("parts_inventory").select("quantity_available, unit_cost"),
      supabase.from("aircraft").select("total_flight_hours"),
    ])

  const totalInventoryValue =
    parts?.reduce((sum, part) => sum + part.quantity_available * (part.unit_cost || 0), 0) || 0

  const totalFlightHours = aircraft?.reduce((sum, plane) => sum + (plane.total_flight_hours || 0), 0) || 0

  const completionRate = totalWorkOrders ? Math.round(((completedWorkOrders || 0) / totalWorkOrders) * 100) : 0

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-balance">Analytics & Reporting</h1>
        <p className="text-muted-foreground mt-1">Comprehensive insights into fleet operations and maintenance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flight Hours</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFlightHours.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all aircraft</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Order Completion</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {completedWorkOrders} of {totalWorkOrders} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total parts value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Maintenance trend chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-4" />
                <p>Cost analysis chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fleet Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-semibold">Average Aircraft Utilization</p>
                <p className="text-sm text-muted-foreground">Daily flight hours per aircraft</p>
              </div>
              <div className="text-2xl font-bold">8.5 hrs</div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-semibold">Mean Time Between Failures</p>
                <p className="text-sm text-muted-foreground">Average operational hours</p>
              </div>
              <div className="text-2xl font-bold">1,250 hrs</div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-semibold">Maintenance Cost per Flight Hour</p>
                <p className="text-sm text-muted-foreground">Average maintenance expense</p>
              </div>
              <div className="text-2xl font-bold">$425</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
