-- Add missing RLS policies for parts inventory
-- This allows authenticated users to insert new parts

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Techs can insert parts" ON public.parts_inventory;
DROP POLICY IF EXISTS "Managers can delete parts" ON public.parts_inventory;
DROP POLICY IF EXISTS "Techs can delete work order parts" ON public.work_order_parts;
DROP POLICY IF EXISTS "Managers can insert maintenance" ON public.maintenance_schedule;
DROP POLICY IF EXISTS "Techs can insert maintenance" ON public.maintenance_schedule;
DROP POLICY IF EXISTS "Managers can insert compliance" ON public.compliance_records;
DROP POLICY IF EXISTS "Managers can delete aircraft" ON public.aircraft;

-- Parts Inventory: Allow techs and managers to insert new parts
CREATE POLICY "Techs can insert parts" ON public.parts_inventory FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('maintenance_tech', 'aviation_manager', 'admin'))
);

-- Parts Inventory: Allow managers to delete parts
CREATE POLICY "Managers can delete parts" ON public.parts_inventory FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('aviation_manager', 'admin'))
);

-- Work Order Parts: Allow techs to delete work order parts
CREATE POLICY "Techs can delete work order parts" ON public.work_order_parts FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('maintenance_tech', 'aviation_manager', 'admin'))
);

-- Maintenance Schedule: Allow managers to insert maintenance schedules
CREATE POLICY "Managers can insert maintenance" ON public.maintenance_schedule FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('aviation_manager', 'admin'))
);

-- Maintenance Schedule: Allow techs to insert maintenance schedules
CREATE POLICY "Techs can insert maintenance" ON public.maintenance_schedule FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('maintenance_tech', 'aviation_manager', 'admin'))
);

-- Compliance Records: Allow managers to insert compliance records
CREATE POLICY "Managers can insert compliance" ON public.compliance_records FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('aviation_manager', 'admin'))
);

-- Aircraft: Allow managers to delete aircraft
CREATE POLICY "Managers can delete aircraft" ON public.aircraft FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('aviation_manager', 'admin'))
);

-- Work Orders: Allow users to delete their own work orders or managers to delete any
DROP POLICY IF EXISTS "Users can delete work orders" ON public.work_orders;
CREATE POLICY "Users can delete work orders" ON public.work_orders FOR DELETE USING (
  created_by = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('aviation_manager', 'admin'))
);

-- Predictive Alerts: Allow managers to delete alerts
DROP POLICY IF EXISTS "Managers can delete alerts" ON public.predictive_alerts;
CREATE POLICY "Managers can delete alerts" ON public.predictive_alerts FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('aviation_manager', 'admin'))
);
