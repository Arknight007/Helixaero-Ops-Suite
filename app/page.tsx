import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plane, Shield, Activity, BarChart3, CheckCircle2, Zap, Globe } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(14,165,233,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 relative">
        <div className="flex flex-col items-center text-center space-y-12 animate-fade-in">
          <div className="relative">
            {/* Outer glow rings */}
            <div className="absolute inset-0 -m-8">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-primary/10 scale-110 animate-pulse delay-75" />
              <div className="absolute inset-0 rounded-full border border-primary/5 scale-125 animate-pulse delay-150" />
            </div>

            {/* Logo container with enhanced styling */}
            <div className="relative bg-card/50 backdrop-blur-sm rounded-full p-8 border border-border/50 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-full" />
              <Image
                src="/images/helixaero-logo.png"
                alt="HelixAero Logo"
                width={240}
                height={240}
                className="w-60 h-60 relative z-10"
                priority
              />
            </div>
          </div>

          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
              <Zap className="w-4 h-4" />
              Innovation in Flight
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-balance bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              HelixAero Ops Suite
            </h1>

            <p className="text-2xl md:text-3xl font-semibold text-muted-foreground text-balance">
              Integrated Air Traffic Services & Aircraft Maintenance Management
            </p>

            <p className="text-lg text-muted-foreground/80 text-pretty max-w-2xl mx-auto leading-relaxed">
              Bridging the critical gap between Avionic ATC and Maintenance Management Systems with real-time
              monitoring, predictive analytics, and comprehensive compliance tracking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              asChild
              size="lg"
              className="text-lg px-10 py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <Link href="/auth/login">
                <Globe className="w-5 h-5 mr-2" />
                Access Dashboard
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-10 py-6 rounded-full border-2 hover:bg-primary/5 bg-transparent"
            >
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>DO-178C Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>ARINC 653 Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>FAA/EASA Certified</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32">
          <FeatureCard
            icon={<Activity className="w-8 h-8" />}
            title="Real-Time Monitoring"
            description="Live ATC data integration with aircraft telemetry and health monitoring"
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Predictive Maintenance"
            description="AI-powered analytics for proactive maintenance scheduling and fault detection"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Compliance Tracking"
            description="Automated regulatory compliance with blockchain-anchored audit trails"
          />
          <FeatureCard
            icon={<Plane className="w-8 h-8" />}
            title="Fleet Management"
            description="Comprehensive aircraft status, work orders, and inventory management"
          />
        </div>

        <div className="mt-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl blur-3xl" />
          <div className="relative grid md:grid-cols-3 gap-8 p-12 bg-card/80 backdrop-blur-sm border border-border rounded-2xl">
            <StatCard value="99.9%" label="System Uptime" sublabel="Mission-Critical Reliability" />
            <StatCard value="15-25%" label="Cost Reduction" sublabel="Operational Efficiency" />
            <StatCard value="24/7" label="Real-Time Monitoring" sublabel="Continuous Operations" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group relative p-8 bg-card/50 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function StatCard({ value, label, sublabel }: { value: string; label: string; sublabel?: string }) {
  return (
    <div className="text-center space-y-2">
      <div className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-base font-semibold text-foreground">{label}</div>
      {sublabel && <div className="text-sm text-muted-foreground">{sublabel}</div>}
    </div>
  )
}
