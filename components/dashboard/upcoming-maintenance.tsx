import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Maintenance {
  id: string
  maintenance_type: string
  description: string
  next_due: string
  is_overdue: boolean
  aircraft: { tail_number: string; aircraft_type: string } | null
}

export function UpcomingMaintenance({ maintenance }: { maintenance: Maintenance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Maintenance</CardTitle>
        <CardDescription>Scheduled maintenance operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {maintenance.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No upcoming maintenance scheduled.</p>
          ) : (
            maintenance.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="mt-0.5">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{item.maintenance_type}</p>
                    {item.is_overdue && (
                      <Badge variant="destructive" className="text-xs">
                        Overdue
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.aircraft?.tail_number} • {item.aircraft?.aircraft_type}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Due {formatDistanceToNow(new Date(item.next_due), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
