"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type Part = {
  id: string
  part_number: string
  part_name: string
  quantity_available: number
}

export function AdjustStockDialog({
  part,
  open,
  onOpenChange,
  onSuccess,
}: {
  part: Part
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add")
  const [quantity, setQuantity] = useState(0)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const newQuantity =
      adjustmentType === "add" ? part.quantity_available + quantity : part.quantity_available - quantity

    if (newQuantity < 0) {
      toast({
        title: "Error",
        description: "Cannot remove more than available quantity",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from("parts_inventory")
      .update({ quantity_available: newQuantity })
      .eq("id", part.id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to adjust stock",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Stock adjusted successfully",
      })
      onOpenChange(false)
      setQuantity(0)
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              {part.part_number} - {part.part_name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Current Quantity</Label>
              <div className="text-2xl font-bold">{part.quantity_available}</div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Adjustment Type</Label>
              <Select value={adjustmentType} onValueChange={(value: "add" | "remove") => setAdjustmentType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Stock</SelectItem>
                  <SelectItem value="remove">Remove Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>New Quantity</Label>
              <div className="text-xl font-semibold">
                {adjustmentType === "add" ? part.quantity_available + quantity : part.quantity_available - quantity}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adjusting..." : "Adjust Stock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
