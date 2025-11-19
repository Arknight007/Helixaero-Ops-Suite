"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type EditAircraftDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  aircraft: any
  onAircraftUpdated: (aircraft: any) => void
}

export function EditAircraftDialog({ open, onOpenChange, aircraft, onAircraftUpdated }: EditAircraftDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    tail_number: "",
    aircraft_type: "",
    manufacturer: "",
    model: "",
    year_manufactured: "",
    status: "operational",
    total_flight_hours: "0",
    total_cycles: "0",
  })

  useEffect(() => {
    if (aircraft) {
      setFormData({
        tail_number: aircraft.tail_number || "",
        aircraft_type: aircraft.aircraft_type || "",
        manufacturer: aircraft.manufacturer || "",
        model: aircraft.model || "",
        year_manufactured: aircraft.year_manufactured?.toString() || "",
        status: aircraft.status || "operational",
        total_flight_hours: aircraft.total_flight_hours?.toString() || "0",
        total_cycles: aircraft.total_cycles?.toString() || "0",
      })
    }
  }, [aircraft])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("aircraft")
        .update({
          tail_number: formData.tail_number,
          aircraft_type: formData.aircraft_type,
          manufacturer: formData.manufacturer || null,
          model: formData.model || null,
          year_manufactured: formData.year_manufactured ? Number.parseInt(formData.year_manufactured) : null,
          status: formData.status,
          total_flight_hours: Number.parseInt(formData.total_flight_hours),
          total_cycles: Number.parseInt(formData.total_cycles),
        })
        .eq("id", aircraft.id)
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Aircraft Updated",
        description: `${formData.tail_number} has been updated successfully.`,
      })

      onAircraftUpdated(data)
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update aircraft",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Aircraft</DialogTitle>
          <DialogDescription>Update the details of {aircraft?.tail_number}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tail_number">Tail Number *</Label>
              <Input
                id="tail_number"
                placeholder="N12345"
                value={formData.tail_number}
                onChange={(e) => setFormData({ ...formData, tail_number: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aircraft_type">Aircraft Type *</Label>
              <Input
                id="aircraft_type"
                placeholder="Boeing 737-800"
                value={formData.aircraft_type}
                onChange={(e) => setFormData({ ...formData, aircraft_type: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                placeholder="Boeing"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="737-800"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year_manufactured">Year Manufactured</Label>
              <Input
                id="year_manufactured"
                type="number"
                placeholder="2020"
                value={formData.year_manufactured}
                onChange={(e) => setFormData({ ...formData, year_manufactured: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="grounded">Grounded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_flight_hours">Total Flight Hours</Label>
              <Input
                id="total_flight_hours"
                type="number"
                placeholder="0"
                value={formData.total_flight_hours}
                onChange={(e) => setFormData({ ...formData, total_flight_hours: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_cycles">Total Cycles</Label>
              <Input
                id="total_cycles"
                type="number"
                placeholder="0"
                value={formData.total_cycles}
                onChange={(e) => setFormData({ ...formData, total_cycles: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Aircraft
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
