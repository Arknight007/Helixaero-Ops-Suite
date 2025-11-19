"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plane, Calendar, Clock, Activity, CheckCircle2, AlertCircle } from "lucide-react"

type ViewAircraftDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  aircraft: any
}

export function ViewAircraftDialog({ open, onOpenChange, aircraft }: ViewAircraftDialogProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "grounded":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="h-4 w-4" />
      case "maintenance":
        return <Clock className="h-4 w-4" />
      case "grounded":
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Plane className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{aircraft?.tail_number}</DialogTitle>
              <DialogDescription>{aircraft?.aircraft_type}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge className={getStatusColor(aircraft?.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(aircraft?.status)}
                {aircraft?.status}
              </span>
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Aircraft Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Manufacturer</p>
                  <p className="font-medium">{aircraft?.manufacturer || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Model</p>
                  <p className="font-medium">{aircraft?.model || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Year Manufactured</p>
                  <p className="font-medium">{aircraft?.year_manufactured || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Operational Data
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Flight Hours</p>
                  <p className="font-medium text-lg">{aircraft?.total_flight_hours?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Cycles</p>
                  <p className="font-medium text-lg">{aircraft?.total_cycles?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Maintenance Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Last Inspection</p>
                <p className="font-medium">
                  {aircraft?.last_inspection ? new Date(aircraft.last_inspection).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Next Inspection Due</p>
                <p className="font-medium">
                  {aircraft?.next_inspection
                    ? new Date(aircraft.next_inspection).toLocaleDateString()
                    : "Not scheduled"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
