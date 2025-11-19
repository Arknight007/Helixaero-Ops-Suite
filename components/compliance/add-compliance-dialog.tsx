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
import { FileCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Aircraft = {
  id: string
  tail_number: string
  aircraft_type: string
}

export function AddComplianceDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [aircraft, setAircraft] = useState<Aircraft[]>([])
  const { toast } = useToast()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    regulation_type: "",
    aircraft_id: "",
    status: "compliant",
    compliance_date: new Date().toISOString().split("T")[0],
    expiry_date: "",
    inspector_name: "",
    description: "",
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

    const { error } = await supabase.from("compliance_records").insert([
      {
        ...formData,
        expiry_date: formData.expiry_date || null,
        inspector_name: formData.inspector_name || null,
        description: formData.description || null,
      },
    ])

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add compliance record",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Compliance record added successfully",
      })
      setOpen(false)
      setFormData({
        regulation_type: "",
        aircraft_id: "",
        status: "compliant",
        compliance_date: new Date().toISOString().split("T")[0],
        expiry_date: "",
        inspector_name: "",
        description: "",
      })
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <FileCheck className="h-4 w-4" />
          New Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Compliance Record</DialogTitle>
            <DialogDescription>Create a new regulatory compliance record</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="regulation_type">Regulation Type</Label>
              <Input
                id="regulation_type"
                placeholder="e.g., FAA Annual Inspection"
                value={formData.regulation_type}
                onChange={(e) => setFormData({ ...formData, regulation_type: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="compliance_date">Compliance Date</Label>
                <Input
                  id="compliance_date"
                  type="date"
                  value={formData.compliance_date}
                  onChange={(e) => setFormData({ ...formData, compliance_date: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inspector_name">Inspector Name (Optional)</Label>
              <Input
                id="inspector_name"
                value={formData.inspector_name}
                onChange={(e) => setFormData({ ...formData, inspector_name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
