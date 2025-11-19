-- HelixAero Ops Suite Database Schema
-- Aviation Maintenance Management System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('flight_ops', 'maintenance_tech', 'aviation_manager', 'admin');
CREATE TYPE aircraft_status AS ENUM ('operational', 'maintenance', 'grounded', 'in_flight');
CREATE TYPE work_order_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled', 'deferred');
CREATE TYPE work_order_priority AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE maintenance_type AS ENUM ('scheduled', 'unscheduled', 'predictive', 'corrective');
CREATE TYPE part_status AS ENUM ('available', 'in_use', 'ordered', 'depleted');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'maintenance_tech',
  phone TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aircraft table
CREATE TABLE IF NOT EXISTS public.aircraft (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tail_number TEXT UNIQUE NOT NULL,
  aircraft_type TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT UNIQUE NOT NULL,
  year_manufactured INTEGER,
  status aircraft_status DEFAULT 'operational',
  total_flight_hours DECIMAL(10, 2) DEFAULT 0,
  total_cycles INTEGER DEFAULT 0,
  last_maintenance_date TIMESTAMPTZ,
  next_maintenance_due TIMESTAMPTZ,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATC Data (Real-time flight data)
CREATE TABLE IF NOT EXISTS public.atc_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aircraft_id UUID REFERENCES public.aircraft(id) ON DELETE CASCADE,
  flight_number TEXT,
  altitude DECIMAL(10, 2),
  speed DECIMAL(10, 2),
  heading DECIMAL(5, 2),
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  fuel_level DECIMAL(5, 2),
  engine_temp DECIMAL(5, 2),
  hydraulic_pressure DECIMAL(5, 2),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Work Orders table
CREATE TABLE IF NOT EXISTS public.work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aircraft_id UUID REFERENCES public.aircraft(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  maintenance_type maintenance_type NOT NULL,
  status work_order_status DEFAULT 'pending',
  priority work_order_priority DEFAULT 'medium',
  assigned_to UUID REFERENCES public.profiles(id),
  created_by UUID REFERENCES public.profiles(id),
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  estimated_hours DECIMAL(5, 2),
  actual_hours DECIMAL(5, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parts Inventory table
CREATE TABLE IF NOT EXISTS public.parts_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_number TEXT UNIQUE NOT NULL,
  part_name TEXT NOT NULL,
  description TEXT,
  manufacturer TEXT,
  quantity_available INTEGER DEFAULT 0,
  quantity_minimum INTEGER DEFAULT 0,
  unit_cost DECIMAL(10, 2),
  status part_status DEFAULT 'available',
  location TEXT,
  last_ordered TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work Order Parts (junction table)
CREATE TABLE IF NOT EXISTS public.work_order_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_order_id UUID REFERENCES public.work_orders(id) ON DELETE CASCADE,
  part_id UUID REFERENCES public.parts_inventory(id) ON DELETE CASCADE,
  quantity_used INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Schedule table
CREATE TABLE IF NOT EXISTS public.maintenance_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aircraft_id UUID REFERENCES public.aircraft(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL,
  description TEXT,
  interval_hours DECIMAL(10, 2),
  interval_days INTEGER,
  last_performed TIMESTAMPTZ,
  next_due TIMESTAMPTZ NOT NULL,
  is_overdue BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Predictive Maintenance Alerts table
CREATE TABLE IF NOT EXISTS public.predictive_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aircraft_id UUID REFERENCES public.aircraft(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  component TEXT NOT NULL,
  predicted_failure_date TIMESTAMPTZ,
  confidence_score DECIMAL(5, 2),
  description TEXT,
  is_acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID REFERENCES public.profiles(id),
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Records table
CREATE TABLE IF NOT EXISTS public.compliance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aircraft_id UUID REFERENCES public.aircraft(id) ON DELETE CASCADE,
  regulation_type TEXT NOT NULL,
  regulation_reference TEXT,
  compliance_date TIMESTAMPTZ NOT NULL,
  expiry_date TIMESTAMPTZ,
  status TEXT DEFAULT 'compliant',
  inspector_name TEXT,
  certificate_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Trail table (blockchain-anchored)
CREATE TABLE IF NOT EXISTS public.audit_trail (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  performed_by UUID REFERENCES public.profiles(id),
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  blockchain_hash TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aircraft ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atc_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for aircraft (all authenticated users can view)
CREATE POLICY "Authenticated users can view aircraft" ON public.aircraft FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can insert aircraft" ON public.aircraft FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('aviation_manager', 'admin'))
);
CREATE POLICY "Managers can update aircraft" ON public.aircraft FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('aviation_manager', 'admin'))
);

-- RLS Policies for ATC data
CREATE POLICY "Authenticated users can view ATC data" ON public.atc_data FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "System can insert ATC data" ON public.atc_data FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for work orders
CREATE POLICY "Authenticated users can view work orders" ON public.work_orders FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can create work orders" ON public.work_orders FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Assigned users can update work orders" ON public.work_orders FOR UPDATE USING (
  assigned_to = auth.uid() OR created_by = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('aviation_manager', 'admin'))
);

-- RLS Policies for parts inventory
CREATE POLICY "Authenticated users can view parts" ON public.parts_inventory FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Techs and managers can update parts" ON public.parts_inventory FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('maintenance_tech', 'aviation_manager', 'admin'))
);

-- RLS Policies for work order parts
CREATE POLICY "Authenticated users can view work order parts" ON public.work_order_parts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Techs can insert work order parts" ON public.work_order_parts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for maintenance schedule
CREATE POLICY "Authenticated users can view maintenance schedule" ON public.maintenance_schedule FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can manage maintenance schedule" ON public.maintenance_schedule FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('aviation_manager', 'admin'))
);

-- RLS Policies for predictive alerts
CREATE POLICY "Authenticated users can view alerts" ON public.predictive_alerts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "System can create alerts" ON public.predictive_alerts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can acknowledge alerts" ON public.predictive_alerts FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for compliance records
CREATE POLICY "Authenticated users can view compliance" ON public.compliance_records FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can manage compliance" ON public.compliance_records FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('aviation_manager', 'admin'))
);

-- RLS Policies for audit trail (read-only for all, system writes)
CREATE POLICY "Authenticated users can view audit trail" ON public.audit_trail FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "System can insert audit trail" ON public.audit_trail FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_aircraft_status ON public.aircraft(status);
CREATE INDEX idx_aircraft_tail_number ON public.aircraft(tail_number);
CREATE INDEX idx_atc_data_aircraft_id ON public.atc_data(aircraft_id);
CREATE INDEX idx_atc_data_timestamp ON public.atc_data(timestamp DESC);
CREATE INDEX idx_work_orders_aircraft_id ON public.work_orders(aircraft_id);
CREATE INDEX idx_work_orders_status ON public.work_orders(status);
CREATE INDEX idx_work_orders_assigned_to ON public.work_orders(assigned_to);
CREATE INDEX idx_parts_inventory_part_number ON public.parts_inventory(part_number);
CREATE INDEX idx_maintenance_schedule_aircraft_id ON public.maintenance_schedule(aircraft_id);
CREATE INDEX idx_maintenance_schedule_next_due ON public.maintenance_schedule(next_due);
CREATE INDEX idx_predictive_alerts_aircraft_id ON public.predictive_alerts(aircraft_id);
CREATE INDEX idx_compliance_records_aircraft_id ON public.compliance_records(aircraft_id);
CREATE INDEX idx_audit_trail_entity ON public.audit_trail(entity_type, entity_id);
CREATE INDEX idx_audit_trail_timestamp ON public.audit_trail(timestamp DESC);
