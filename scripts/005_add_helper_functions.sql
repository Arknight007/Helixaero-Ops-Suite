-- Helper functions for the HelixAero Ops Suite

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_aircraft_updated_at ON public.aircraft;
CREATE TRIGGER update_aircraft_updated_at
  BEFORE UPDATE ON public.aircraft
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_work_orders_updated_at ON public.work_orders;
CREATE TRIGGER update_work_orders_updated_at
  BEFORE UPDATE ON public.work_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_parts_inventory_updated_at ON public.parts_inventory;
CREATE TRIGGER update_parts_inventory_updated_at
  BEFORE UPDATE ON public.parts_inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_maintenance_schedule_updated_at ON public.maintenance_schedule;
CREATE TRIGGER update_maintenance_schedule_updated_at
  BEFORE UPDATE ON public.maintenance_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_compliance_records_updated_at ON public.compliance_records;
CREATE TRIGGER update_compliance_records_updated_at
  BEFORE UPDATE ON public.compliance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to check if maintenance is overdue
CREATE OR REPLACE FUNCTION check_maintenance_overdue()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_overdue = (NEW.next_due < NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for maintenance overdue check
DROP TRIGGER IF EXISTS check_maintenance_overdue_trigger ON public.maintenance_schedule;
CREATE TRIGGER check_maintenance_overdue_trigger
  BEFORE INSERT OR UPDATE ON public.maintenance_schedule
  FOR EACH ROW
  EXECUTE FUNCTION check_maintenance_overdue();

-- Fixed JSONB type conversion error by casting row_to_json() to JSONB
-- Function to log audit trail
CREATE OR REPLACE FUNCTION log_audit_trail()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_trail (
    entity_type,
    entity_id,
    action,
    performed_by,
    changes
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    auth.uid(),
    CASE
      WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::jsonb
      WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', row_to_json(OLD)::jsonb, 'new', row_to_json(NEW)::jsonb)
      ELSE row_to_json(NEW)::jsonb
    END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for important tables
DROP TRIGGER IF EXISTS audit_aircraft ON public.aircraft;
CREATE TRIGGER audit_aircraft
  AFTER INSERT OR UPDATE OR DELETE ON public.aircraft
  FOR EACH ROW
  EXECUTE FUNCTION log_audit_trail();

DROP TRIGGER IF EXISTS audit_work_orders ON public.work_orders;
CREATE TRIGGER audit_work_orders
  AFTER INSERT OR UPDATE OR DELETE ON public.work_orders
  FOR EACH ROW
  EXECUTE FUNCTION log_audit_trail();

DROP TRIGGER IF EXISTS audit_compliance_records ON public.compliance_records;
CREATE TRIGGER audit_compliance_records
  AFTER INSERT OR UPDATE OR DELETE ON public.compliance_records
  FOR EACH ROW
  EXECUTE FUNCTION log_audit_trail();
