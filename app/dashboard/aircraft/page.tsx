import { createClient } from "@/lib/supabase/server"
import { AircraftList } from "@/components/aircraft/aircraft-list"

export default async function AircraftPage() {
  const supabase = await createClient()

  const { data: aircraft } = await supabase.from("aircraft").select("*").order("tail_number", { ascending: true })

  return <AircraftList initialAircraft={aircraft || []} />
}
