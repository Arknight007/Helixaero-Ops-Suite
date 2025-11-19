"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Wrench } from "lucide-react"
import { AddMaintenanceDialog } from "./add-maintenance-dialog"
import { useToast } from "@/hooks/use-toast"

type MaintenanceSchedule = {
  id: string
  maintenance_type: string
  interval_hours: number | null
  interval_cycles: number | null
  last_performed: string
  next_due: string
  notes: string | null
  aircraft: {
    tail_number: string
    aircraft_type: string
  } | null
}

export function MaintenanceList() {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  const fetchSchedules = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("maintenance_schedule")
      .select("*, aircraft:aircraft_id(tail_number, aircraft_type)")
      .order("next_due", { ascending: true })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch maintenance schedules",
        variant: "destructive",
      })
    } else {
      setSchedules(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSchedules()
  }, [])

  const handleMarkComplete = async (
    scheduleId: string,
    intervalHours: number | null,
    intervalCycles: number | null,
  ) => {
    const now = new Date()
    const nextDue = new Date(now)

    if (intervalHours) {
      nextDue.setDate(nextDue.getDate() + Math.floor(intervalHours / 24))
    } else if (intervalCycles) {
      nextDue.setDate(nextDue.getDate() + 30)
    }

    const { error } = await supabase
      .from("maintenance_schedule")
      .update({
        last_performed: now.toISOString(),
        next_due: nextDue.toISOString(),
      })
      .eq("id", scheduleId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark maintenance complete",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Maintenance marked as complete",
      })
      fetchSchedules()
    }
  }

  const getStatusColor = (nextDue: string) => {
    const daysUntil = Math.ceil((new Date(nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntil < 0) return "bg-red-500/10 text-red-500 border-red-500/20"
    if (daysUntil < 7) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    return "bg-green-500/10 text-green-500 border-green-500/20"
  }

  const getDaysUntil = (nextDue: string) => {
    const daysUntil = Math.ceil((new Date(nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntil < 0) return `${Math.abs(daysUntil)} days overdue`
    if (daysUntil === 0) return "Due today"
    return `${daysUntil} days remaining`
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Maintenance Schedule</h1>
          <p className="text-muted-foreground mt-1">Track and manage scheduled maintenance activities</p>
        </div>
        <AddMaintenanceDialog onSuccess={fetchSchedules} />
      </div>

      <div className="grid gap-4">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className="hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{schedule.maintenance_type}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {schedule.aircraft?.tail_number}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{schedule.aircraft?.aircraft_type}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(schedule.next_due)}>
                  <Clock className="h-3 w-3 mr-1" />
                  {getDaysUntil(schedule.next_due)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Interval</p>
                  <p className="text-sm font-semibold">
                    {schedule.interval_hours
                      ? `${schedule.interval_hours.toLocaleString()} hrs`
                      : `${schedule.interval_cycles} cycles`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Performed</p>
                  <p className="text-sm font-semibold">{new Date(schedule.last_performed).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Next Due</p>
                  <p className="text-sm font-semibold">{new Date(schedule.next_due).toLocaleDateString()}</p>
                </div>
              </div>

              {schedule.notes && (
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{schedule.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleMarkComplete(schedule.id, schedule.interval_hours, schedule.interval_cycles)}
                >
                  Mark Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {schedules.length === 0 && (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Scheduled Maintenance</h3>
          <p className="text-muted-foreground mb-4">Set up maintenance schedules for your aircraft fleet</p>
          <AddMaintenanceDialog onSuccess={fetchSchedules} />
        </Card>
      )}
    </div>
  )
}
