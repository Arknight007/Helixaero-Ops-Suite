"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, AlertTriangle } from "lucide-react"
import { AddPartDialog } from "./add-part-dialog"
import { AdjustStockDialog } from "./adjust-stock-dialog"
import { useToast } from "@/hooks/use-toast"

type Part = {
  id: string
  part_number: string
  part_name: string
  quantity_available: number
  minimum_quantity: number
  unit_cost: number | null
  location: string | null
}

export function InventoryList() {
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const fetchParts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("parts_inventory").select("*").order("part_number", { ascending: true })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch inventory",
        variant: "destructive",
      })
    } else {
      setParts(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchParts()
  }, [])

  const getStockStatus = (quantity: number, minQuantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", color: "bg-red-500/10 text-red-500 border-red-500/20" }
    if (quantity <= minQuantity)
      return { label: "Low Stock", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" }
    return { label: "In Stock", color: "bg-green-500/10 text-green-500 border-green-500/20" }
  }

  const lowStockCount = parts.filter((p) => p.quantity_available <= p.minimum_quantity).length

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
          <h1 className="text-3xl font-bold text-balance">Parts Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage aircraft parts and component inventory</p>
        </div>
        <AddPartDialog onSuccess={fetchParts} />
      </div>

      {lowStockCount > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="font-semibold">Low Stock Alert</p>
              <p className="text-sm text-muted-foreground">
                {lowStockCount} part{lowStockCount > 1 ? "s" : ""} below minimum quantity
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {parts.map((part) => {
          const stockStatus = getStockStatus(part.quantity_available, part.minimum_quantity)
          return (
            <Card key={part.id} className="hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{part.part_number}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{part.part_name}</p>
                    </div>
                  </div>
                  <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="text-lg font-bold">{part.quantity_available}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Min Required</p>
                    <p className="text-lg font-bold">{part.minimum_quantity}</p>
                  </div>
                </div>

                <div className="pt-3 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Unit Cost</span>
                    <span className="font-semibold">${part.unit_cost?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Value</span>
                    <span className="font-semibold">
                      ${((part.unit_cost || 0) * part.quantity_available).toLocaleString()}
                    </span>
                  </div>
                  {part.location && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-semibold">{part.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => setSelectedPart(part)}
                  >
                    Adjust Stock
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {parts.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Parts in Inventory</h3>
          <p className="text-muted-foreground mb-4">Start tracking your aircraft parts and components</p>
          <AddPartDialog onSuccess={fetchParts} />
        </Card>
      )}

      {selectedPart && (
        <AdjustStockDialog
          part={selectedPart}
          open={!!selectedPart}
          onOpenChange={(open) => !open && setSelectedPart(null)}
          onSuccess={fetchParts}
        />
      )}
    </div>
  )
}
