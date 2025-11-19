import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Wrench, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react"
import { AircraftStatusChart } from "@/components/dashboard/aircraft-status-chart"
import { MaintenanceActivityChart } from "@/components/dashboard/maintenance-activity-chart"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { UpcomingMaintenance } from "@/components/dashboard/upcoming-maintenance"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch dashboard data
  const [
    { count: totalAircraft },
    { count: operationalAircraft },
    { count: maintenanceAircraft },
    { count: activeWorkOrders },
    { count: pendingAlerts },
    { data: recentAlerts },
    { data: upcomingMaintenance },
  ] = await Promise.all([
    supabase.from("aircraft").select("*", { count: "exact", head: true }),
    supabase.from("aircraft").select("*", { count: "exact", head: true }).eq("status", "operational"),
    supabase.from("aircraft").select("*", { count: "exact", head: true }).eq("status", "maintenance"),
    supabase.from("work_orders").select("*", { count: "exact", head: true }).in("status", ["pending", "in_progress"]),
    supabase.from("predictive_alerts").select("*", { count: "exact", head: true }).eq("is_acknowledged", false),
    supabase
      .from("predictive_alerts")
      .select("*, aircraft(tail_number)")
      .eq("is_acknowledged", false)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("maintenance_schedule")
      .select("*, aircraft(tail_number, aircraft_type)")
      .order("next_due", { ascending: true })
      .limit(5),
  ])

  const stats = [
    {
      title: "Total Aircraft",
      value: totalAircraft || 0,
      icon: Plane,
      description: `${operationalAircraft || 0} operational`,
      trend: "+2 this month",
    },
    {
      title: "Active Work Orders",
      value: activeWorkOrders || 0,
      icon: Wrench,
      description: "In progress or pending",
      trend: "-3 from last week",
    },
    {
      title: "Pending Alerts",
      value: pendingAlerts || 0,
      icon: AlertTriangle,
      description: "Require attention",
      trend: pendingAlerts && pendingAlerts > 0 ? "Action needed" : "All clear",
    },
    {
      title: "Fleet Availability",
      value: totalAircraft ? `${Math.round(((operationalAircraft || 0) / totalAircraft) * 100)}%` : "0%",
      icon: CheckCircle2,
      description: "Operational status",
      trend: "+5% from last month",
    },
  ]

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Operations Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time overview of fleet status and maintenance operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              <div className="flex items-center mt-2 text-xs text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <AircraftStatusChart />
        <MaintenanceActivityChart />
      </div>

      {/* Alerts and Maintenance Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentAlerts alerts={recentAlerts || []} />
        <UpcomingMaintenance maintenance={upcomingMaintenance || []} />
      </div>
    </div>
  )
}
