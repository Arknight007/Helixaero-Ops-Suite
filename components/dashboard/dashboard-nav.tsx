"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Plane,
  LayoutDashboard,
  Wrench,
  Package,
  Calendar,
  AlertTriangle,
  FileText,
  Settings,
  LogOut,
  Radio,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DashboardNavProps {
  user: any
  profile: any
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Aircraft Fleet",
    href: "/dashboard/aircraft",
    icon: Plane,
  },
  {
    title: "ATC Data",
    href: "/dashboard/atc",
    icon: Radio,
  },
  {
    title: "Work Orders",
    href: "/dashboard/work-orders",
    icon: Wrench,
  },
  {
    title: "Maintenance Schedule",
    href: "/dashboard/maintenance",
    icon: Calendar,
  },
  {
    title: "Parts Inventory",
    href: "/dashboard/inventory",
    icon: Package,
  },
  {
    title: "Predictive Alerts",
    href: "/dashboard/alerts",
    icon: AlertTriangle,
  },
  {
    title: "Compliance",
    href: "/dashboard/compliance",
    icon: FileText,
  },
]

export function DashboardNav({ user, profile }: DashboardNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col animate-slide-in">
      {/* Logo/Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-center">
          <Image src="/images/helixaero-logo.png" alt="HelixAero Logo" width={120} height={120} className="w-32 h-32" />
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name || "User"}</p>
            <p className="text-xs text-muted-foreground capitalize">{profile?.role?.replace("_", " ") || "User"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/dashboard/settings">
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
