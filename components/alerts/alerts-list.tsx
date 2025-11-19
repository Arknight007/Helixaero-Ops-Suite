"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Alert = {
  id: string
  alert_type: string
  severity: string
  description: string
  component: string
  confidence_score: number
  predicted_failure_date: string | null
  is_acknowledged: boolean
  acknowledged_at: string | null
  created_at: string
  aircraft: {
    tail_number: string
    model: string
    manufacturer: string
  } | null
}

export function AlertsList() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  const fetchAlerts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("predictive_alerts")
      .select("*, aircraft:aircraft_id(tail_number, model, manufacturer)")
      .order("created_at", { ascending: false })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch alerts",
        variant: "destructive",
      })
    } else {
      setAlerts(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const handleAcknowledge = async (alertId: string) => {
    const { error } = await supabase
      .from("predictive_alerts")
      .update({
        is_acknowledged: true,
        acknowledged_at: new Date().toISOString(),
      })
      .eq("id", alertId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to acknowledge alert",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Alert acknowledged",
      })
      fetchAlerts()
    }
  }

  const activeAlerts = alerts.filter((a) => !a.is_acknowledged)
  const acknowledgedAlerts = alerts.filter((a) => a.is_acknowledged)

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-fade-in">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Predictive Alerts</h1>
        <p className="text-muted-foreground">AI-powered maintenance predictions and anomaly detection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-destructive">{activeAlerts.length}</span>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Acknowledged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-yellow-500">{acknowledgedAlerts.length}</span>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-primary">{alerts.length}</span>
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prediction Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-primary">94%</span>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {activeAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Alerts</h2>
          <div className="grid gap-4">
            {activeAlerts.map((alert) => (
              <Card key={alert.id} className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        {alert.alert_type.replace(/_/g, " ").toUpperCase()}
                      </CardTitle>
                      <CardDescription>
                        {alert.aircraft?.tail_number} - {alert.aircraft?.manufacturer} {alert.aircraft?.model}
                      </CardDescription>
                    </div>
                    <Badge variant="destructive" className="capitalize">
                      {alert.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{alert.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Component:</span>
                      <span className="ml-2 font-semibold">{alert.component}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="ml-2 font-semibold">{alert.confidence_score}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {alert.predicted_failure_date && (
                        <>
                          Predicted Failure:{" "}
                          <span className="font-semibold text-foreground">
                            {new Date(alert.predicted_failure_date).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleAcknowledge(alert.id)}>
                        Acknowledge
                      </Button>
                      <Button size="sm">Create Work Order</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {acknowledgedAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Acknowledged Alerts</h2>
          <div className="grid gap-4">
            {acknowledgedAlerts.map((alert) => (
              <Card key={alert.id} className="border-green-500/50 bg-green-500/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        {alert.alert_type.replace(/_/g, " ").toUpperCase()}
                      </CardTitle>
                      <CardDescription>
                        {alert.aircraft?.tail_number} - {alert.aircraft?.manufacturer} {alert.aircraft?.model}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="capitalize border-green-500 text-green-500">
                      {alert.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{alert.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Component:</span>
                      <span className="ml-2 font-semibold">{alert.component}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Acknowledged:</span>
                      <span className="ml-2 font-semibold">
                        {alert.acknowledged_at ? new Date(alert.acknowledged_at).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Alerts</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              All systems operating normally. Predictive maintenance AI is monitoring your fleet 24/7.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
