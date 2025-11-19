"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, FileCheck, Download, ExternalLink } from "lucide-react"
import { AddComplianceDialog } from "./add-compliance-dialog"
import { useToast } from "@/hooks/use-toast"

type ComplianceRecord = {
  id: string
  regulation_type: string
  status: string
  compliance_date: string
  expiry_date: string | null
  inspector_name: string | null
  description: string | null
  document_url: string | null
  aircraft: {
    tail_number: string
    aircraft_type: string
  } | null
}

export function ComplianceList() {
  const [records, setRecords] = useState<ComplianceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  const fetchRecords = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("compliance_records")
      .select("*, aircraft:aircraft_id(tail_number, aircraft_type)")
      .order("compliance_date", { ascending: false })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch compliance records",
        variant: "destructive",
      })
    } else {
      setRecords(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "non_compliant":
        return "bg-red-500/10 text-red-500 border-red-500/20"
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
          <h1 className="text-3xl font-bold text-balance">Regulatory Compliance</h1>
          <p className="text-muted-foreground mt-1">Track FAA/EASA compliance and airworthiness directives</p>
        </div>
        <AddComplianceDialog onSuccess={fetchRecords} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
            <p className="text-xs text-muted-foreground">Compliance documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant</CardTitle>
            <FileCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {records.filter((r) => r.status === "compliant").length}
            </div>
            <p className="text-xs text-muted-foreground">Up to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileCheck className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {records.filter((r) => r.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {records.map((record) => (
          <Card key={record.id} className="hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{record.regulation_type}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {record.aircraft?.tail_number}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{record.aircraft?.aircraft_type}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {record.description && <p className="text-sm text-muted-foreground">{record.description}</p>}

              <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Compliance Date</p>
                  <p className="text-sm font-semibold">{new Date(record.compliance_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expiry Date</p>
                  <p className="text-sm font-semibold">
                    {record.expiry_date ? new Date(record.expiry_date).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Inspector</p>
                  <p className="text-sm font-semibold">{record.inspector_name || "N/A"}</p>
                </div>
              </div>

              {record.document_url && (
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Download Certificate
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <ExternalLink className="h-4 w-4" />
                    View Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {records.length === 0 && (
        <Card className="p-12 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Compliance Records</h3>
          <p className="text-muted-foreground mb-4">
            Start tracking regulatory compliance and airworthiness directives
          </p>
          <AddComplianceDialog onSuccess={fetchRecords} />
        </Card>
      )}
    </div>
  )
}
