import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Radio, TrendingUp, Activity, AlertTriangle } from "lucide-react"

export default async function ATCDataPage() {
  const supabase = await createClient()

  const { data: atcData } = await supabase
    .from("atc_data")
    .select("*, aircraft(tail_number, aircraft_type)")
    .order("timestamp", { ascending: false })
    .limit(50)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "warning":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "info":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-balance">ATC Data Stream</h1>
        <p className="text-muted-foreground mt-1">Real-time air traffic control data and telemetry monitoring</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Flights</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{atcData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Currently tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Altitude</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {atcData && atcData.length > 0
                ? Math.round(atcData.reduce((sum, d) => sum + (d.altitude || 0), 0) / atcData.length).toLocaleString()
                : 0}{" "}
              ft
            </div>
            <p className="text-xs text-muted-foreground">Fleet average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Speed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {atcData && atcData.length > 0
                ? Math.round(atcData.reduce((sum, d) => sum + (d.speed || 0), 0) / atcData.length)
                : 0}{" "}
              kts
            </div>
            <p className="text-xs text-muted-foreground">Fleet average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{atcData?.filter((d) => d.anomaly_detected).length || 0}</div>
            <p className="text-xs text-muted-foreground">Detected today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Telemetry Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {atcData?.map((data) => (
              <div
                key={data.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Radio className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{data.aircraft?.tail_number}</p>
                      <Badge variant="outline" className="text-xs">
                        {data.aircraft?.aircraft_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{new Date(data.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">Altitude</p>
                    <p className="font-semibold">{data.altitude?.toLocaleString()} ft</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Speed</p>
                    <p className="font-semibold">{data.speed} kts</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Heading</p>
                    <p className="font-semibold">{data.heading}°</p>
                  </div>
                  {data.anomaly_detected && (
                    <Badge className={getSeverityColor("warning")}>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Anomaly
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {(!atcData || atcData.length === 0) && (
            <div className="text-center py-12">
              <Radio className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No ATC Data Available</h3>
              <p className="text-muted-foreground">Waiting for real-time telemetry data from aircraft</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
