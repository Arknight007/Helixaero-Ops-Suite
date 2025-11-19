"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, User, Calendar } from "lucide-react"
import { AddWorkOrderDialog } from "./add-work-order-dialog"
import { EditWorkOrderDialog } from "./edit-work-order-dialog"
import { useToast } from "@/hooks/use-toast"

type WorkOrder = {
  id: string
  title: string
  description: string
  priority: string
  status: string
  created_at: string
  completed_at: string | null
  aircraft: { tail_number: string; aircraft_type: string } | null
  profiles: { full_name: string } | null
}

export function WorkOrdersList() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const fetchWorkOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("work_orders")
      .select("*, aircraft(tail_number, aircraft_type), profiles(full_name)")
      .order("created_at", { ascending: false })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch work orders",
        variant: "destructive",
      })
    } else {
      setWorkOrders(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWorkOrders()
  }, [])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("work_orders")
      .update({
        status: newStatus,
        completed_at: newStatus === "completed" ? new Date().toISOString() : null,
      })
      .eq("id", orderId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Work order status updated",
      })
      fetchWorkOrders()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
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
          <h1 className="text-3xl font-bold text-balance">Work Orders</h1>
          <p className="text-muted-foreground mt-1">Manage maintenance tasks and work assignments</p>
        </div>
        <AddWorkOrderDialog onSuccess={fetchWorkOrders} />
      </div>

      <div className="grid gap-4">
        {workOrders.map((order) => (
          <Card key={order.id} className="hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{order.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {order.aircraft?.tail_number}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{order.aircraft?.aircraft_type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{order.description}</p>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Assigned To</p>
                    <p className="font-medium">{order.profiles?.full_name || "Unassigned"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Created</p>
                    <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Completed</p>
                    <p className="font-medium">
                      {order.completed_at ? new Date(order.completed_at).toLocaleDateString() : "In Progress"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => setSelectedOrder(order)}
                >
                  Edit Details
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    const nextStatus =
                      order.status === "pending"
                        ? "in_progress"
                        : order.status === "in_progress"
                          ? "completed"
                          : "pending"
                    handleStatusUpdate(order.id, nextStatus)
                  }}
                >
                  {order.status === "pending" ? "Start Work" : order.status === "in_progress" ? "Complete" : "Reopen"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {workOrders.length === 0 && (
        <Card className="p-12 text-center">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Work Orders</h3>
          <p className="text-muted-foreground mb-4">Create your first work order to start tracking maintenance tasks</p>
          <AddWorkOrderDialog onSuccess={fetchWorkOrders} />
        </Card>
      )}

      {selectedOrder && (
        <EditWorkOrderDialog
          workOrder={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
          onSuccess={fetchWorkOrders}
        />
      )}
    </div>
  )
}
