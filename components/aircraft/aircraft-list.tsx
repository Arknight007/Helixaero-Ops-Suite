"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plane, AlertCircle, CheckCircle2, Clock, Plus, Pencil, Trash2, Eye } from "lucide-react"
import { AddAircraftDialog } from "./add-aircraft-dialog"
import { EditAircraftDialog } from "./edit-aircraft-dialog"
import { ViewAircraftDialog } from "./view-aircraft-dialog"
import { DeleteAircraftDialog } from "./delete-aircraft-dialog"
import { useRouter } from "next/navigation"

type Aircraft = {
  id: string
  tail_number: string
  aircraft_type: string
  status: string
  total_flight_hours: number
  total_cycles: number
  last_inspection: string | null
  manufacturer?: string
  model?: string
  year_manufactured?: number
}

export function AircraftList({ initialAircraft }: { initialAircraft: Aircraft[] }) {
  const [aircraft, setAircraft] = useState<Aircraft[]>(initialAircraft)
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const router = useRouter()

  const handleAircraftAdded = (newAircraft: Aircraft) => {
    setAircraft([...aircraft, newAircraft])
    router.refresh()
  }

  const handleAircraftUpdated = (updatedAircraft: Aircraft) => {
    setAircraft(aircraft.map((a) => (a.id === updatedAircraft.id ? updatedAircraft : a)))
    router.refresh()
  }

  const handleAircraftDeleted = (id: string) => {
    setAircraft(aircraft.filter((a) => a.id !== id))
    router.refresh()
  }

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
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Aircraft Fleet</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor your entire aircraft fleet</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Aircraft
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {aircraft.map((plane) => (
          <Card key={plane.id} className="hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Plane className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{plane.tail_number}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plane.aircraft_type}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(plane.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(plane.status)}
                    {plane.status}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Flight Hours</p>
                  <p className="font-semibold">{plane.total_flight_hours?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cycles</p>
                  <p className="font-semibold">{plane.total_cycles?.toLocaleString() || 0}</p>
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">Last Inspection</p>
                <p className="text-sm font-medium">
                  {plane.last_inspection ? new Date(plane.last_inspection).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setSelectedAircraft(plane)
                    setIsViewOpen(true)
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedAircraft(plane)
                    setIsEditOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedAircraft(plane)
                    setIsDeleteOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {aircraft.length === 0 && (
        <Card className="p-12 text-center">
          <Plane className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Aircraft Found</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first aircraft to the fleet</p>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Aircraft
          </Button>
        </Card>
      )}

      <AddAircraftDialog open={isAddOpen} onOpenChange={setIsAddOpen} onAircraftAdded={handleAircraftAdded} />

      {selectedAircraft && (
        <>
          <EditAircraftDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            aircraft={selectedAircraft}
            onAircraftUpdated={handleAircraftUpdated}
          />
          <ViewAircraftDialog open={isViewOpen} onOpenChange={setIsViewOpen} aircraft={selectedAircraft} />
          <DeleteAircraftDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            aircraft={selectedAircraft}
            onAircraftDeleted={handleAircraftDeleted}
          />
        </>
      )}
    </div>
  )
}
