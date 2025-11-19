"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Aircraft = {
  id: string
  tail_number: string
  aircraft_type: string
}

export function AddMaintenanceDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [aircraft, setAircraft] = useState<Aircraft[]>([])
  const { toast } = useToast()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    maintenance_type: "",
    aircraft_id: "",
    interval_hours: "",
    interval_cycles: "",
    last_performed: new Date().toISOString().split("T")[0],
    notes: "",
  })

  useEffect(() => {
    if (open) {
      fetchAircraft()
    }
  }, [open])

  const fetchAircraft = async () => {
    const { data } = await supabase.from("aircraft").select("id, tail_number, aircraft_type")
    setAircraft(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const lastPerformed = new Date(formData.last_performed)
    const nextDue = new Date(lastPerformed)

    if (formData.interval_hours) {
      nextDue.setDate(nextDue.getDate() + Math.floor(Number.parseInt(formData.interval_hours) / 24))
    } else if (formData.interval_cycles) {
      nextDue.setDate(nextDue.getDate() + 30)
    }

    const { error } = await supabase.from("maintenance_schedule").insert([
      {
        maintenance_type: formData.maintenance_type,
        aircraft_id: formData.aircraft_id,
        interval_hours: formData.interval_hours ? Number.parseInt(formData.interval_hours) : null,
        interval_cycles: formData.interval_cycles ? Number.parseInt(formData.interval_cycles) : null,
        last_performed: lastPerformed.toISOString(),
        next_due: nextDue.toISOString(),
        notes: formData.notes || null,
      },
    ])

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add maintenance schedule",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Maintenance schedule added successfully",
      })
      setOpen(false)
      setFormData({
        maintenance_type: "",
        aircraft_id: "",
        interval_hours: "",
        interval_cycles: "",
        last_performed: new Date().toISOString().split("T")[0],
        notes: "",
      })
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Maintenance Schedule</DialogTitle>
            <DialogDescription>Create a new maintenance schedule for an aircraft</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="maintenance_type">Maintenance Type</Label>
              <Input
                id="maintenance_type"
                placeholder="e.g., 100-Hour Inspection"
                value={formData.maintenance_type}
                onChange={(e) => setFormData({ ...formData, maintenance_type: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="aircraft">Aircraft</Label>
              <Select
                value={formData.aircraft_id}
                onValueChange={(value) => setFormData({ ...formData, aircraft_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select aircraft" />
                </SelectTrigger>
                <SelectContent>
                  {aircraft.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.tail_number} - {a.aircraft_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="interval_hours">Interval (Hours)</Label>
                <Input
                  id="interval_hours"
                  type="number"
                  min="0"
                  placeholder="e.g., 100"
                  value={formData.interval_hours}
                  onChange={(e) => setFormData({ ...formData, interval_hours: e.target.value, interval_cycles: "" })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interval_cycles">Interval (Cycles)</Label>
                <Input
                  id="interval_cycles"
                  type="number"
                  min="0"
                  placeholder="e.g., 50"
                  value={formData.interval_cycles}
                  onChange={(e) => setFormData({ ...formData, interval_cycles: e.target.value, interval_hours: "" })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_performed">Last Performed</Label>
              <Input
                id="last_performed"
                type="date"
                value={formData.last_performed}
                onChange={(e) => setFormData({ ...formData, last_performed: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
