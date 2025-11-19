-- Seed sample data for HelixAero Ops Suite

-- Insert sample aircraft
INSERT INTO public.aircraft (tail_number, aircraft_type, manufacturer, model, serial_number, year_manufactured, status, total_flight_hours, total_cycles, location) VALUES
('N12345', 'Commercial', 'Boeing', '737-800', 'SN-001-2015', 2015, 'operational', 15234.5, 8456, 'Gate A12'),
('N67890', 'Commercial', 'Airbus', 'A320-200', 'SN-002-2018', 2018, 'operational', 9876.3, 5234, 'Gate B7'),
('N24680', 'Commercial', 'Boeing', '787-9', 'SN-003-2020', 2020, 'maintenance', 5432.1, 2890, 'Hangar 3'),
('N13579', 'Commercial', 'Airbus', 'A350-900', 'SN-004-2021', 2021, 'operational', 3210.8, 1567, 'Gate C4'),
('N98765', 'Cargo', 'Boeing', '777F', 'SN-005-2017', 2017, 'operational', 12456.7, 6789, 'Cargo Terminal');

-- Insert sample parts inventory
INSERT INTO public.parts_inventory (part_number, part_name, description, manufacturer, quantity_available, quantity_minimum, unit_cost, status, location) VALUES
('ENG-001', 'Turbine Blade', 'High-pressure turbine blade', 'GE Aviation', 25, 10, 15000.00, 'available', 'Warehouse A'),
('HYD-002', 'Hydraulic Pump', 'Main hydraulic system pump', 'Parker Aerospace', 12, 5, 8500.00, 'available', 'Warehouse A'),
('AVION-003', 'Flight Computer', 'Primary flight control computer', 'Honeywell', 8, 3, 45000.00, 'available', 'Warehouse B'),
('LAND-004', 'Landing Gear Strut', 'Main landing gear strut assembly', 'Safran Landing Systems', 6, 2, 32000.00, 'available', 'Warehouse C'),
('FUEL-005', 'Fuel Pump', 'Wing fuel transfer pump', 'Eaton', 18, 8, 5200.00, 'available', 'Warehouse A'),
('ELEC-006', 'Generator', 'Integrated drive generator', 'Hamilton Sundstrand', 10, 4, 28000.00, 'available', 'Warehouse B'),
('BRAKE-007', 'Brake Assembly', 'Carbon brake assembly', 'Honeywell', 20, 10, 12000.00, 'available', 'Warehouse C'),
('APU-008', 'APU Starter', 'Auxiliary power unit starter', 'Honeywell', 5, 2, 18000.00, 'ordered', 'Warehouse B');

-- Insert sample maintenance schedules
INSERT INTO public.maintenance_schedule (aircraft_id, maintenance_type, description, interval_hours, interval_days, next_due, is_overdue)
SELECT 
  id,
  'A-Check',
  'Routine inspection and minor maintenance',
  500,
  60,
  NOW() + INTERVAL '15 days',
  false
FROM public.aircraft WHERE tail_number = 'N12345';

INSERT INTO public.maintenance_schedule (aircraft_id, maintenance_type, description, interval_hours, interval_days, next_due, is_overdue)
SELECT 
  id,
  'C-Check',
  'Comprehensive structural inspection',
  4000,
  365,
  NOW() + INTERVAL '90 days',
  false
FROM public.aircraft WHERE tail_number = 'N67890';

-- Insert sample work orders
INSERT INTO public.work_orders (aircraft_id, title, description, maintenance_type, status, priority, scheduled_start, scheduled_end, estimated_hours)
SELECT 
  id,
  'Engine Oil Change',
  'Replace engine oil and filters on both engines',
  'scheduled',
  'pending',
  'medium',
  NOW() + INTERVAL '2 days',
  NOW() + INTERVAL '2 days 4 hours',
  4.0
FROM public.aircraft WHERE tail_number = 'N12345';

INSERT INTO public.work_orders (aircraft_id, title, description, maintenance_type, status, priority, scheduled_start, scheduled_end, estimated_hours)
SELECT 
  id,
  'Hydraulic System Inspection',
  'Inspect hydraulic lines and replace pump',
  'unscheduled',
  'in_progress',
  'high',
  NOW(),
  NOW() + INTERVAL '8 hours',
  8.0
FROM public.aircraft WHERE tail_number = 'N24680';

-- Insert sample predictive alerts
INSERT INTO public.predictive_alerts (aircraft_id, alert_type, severity, component, predicted_failure_date, confidence_score, description)
SELECT 
  id,
  'Component Degradation',
  'medium',
  'Landing Gear Actuator',
  NOW() + INTERVAL '30 days',
  0.78,
  'Landing gear actuator showing signs of wear. Recommend inspection within 30 days.'
FROM public.aircraft WHERE tail_number = 'N67890';

INSERT INTO public.predictive_alerts (aircraft_id, alert_type, severity, component, predicted_failure_date, confidence_score, description)
SELECT 
  id,
  'Performance Anomaly',
  'high',
  'Engine #2 Fuel Flow',
  NOW() + INTERVAL '15 days',
  0.85,
  'Abnormal fuel flow pattern detected in Engine #2. Immediate inspection recommended.'
FROM public.aircraft WHERE tail_number = 'N13579';

-- Insert sample compliance records
INSERT INTO public.compliance_records (aircraft_id, regulation_type, regulation_reference, compliance_date, expiry_date, status, inspector_name, certificate_number)
SELECT 
  id,
  'Airworthiness Certificate',
  'FAA Part 121',
  NOW() - INTERVAL '6 months',
  NOW() + INTERVAL '6 months',
  'compliant',
  'John Smith',
  'AWC-2024-001'
FROM public.aircraft WHERE tail_number = 'N12345';

INSERT INTO public.compliance_records (aircraft_id, regulation_type, regulation_reference, compliance_date, expiry_date, status, inspector_name, certificate_number)
SELECT 
  id,
  'Annual Inspection',
  'FAA Part 91.409',
  NOW() - INTERVAL '3 months',
  NOW() + INTERVAL '9 months',
  'compliant',
  'Sarah Johnson',
  'AI-2024-045'
FROM public.aircraft WHERE tail_number = 'N67890';

-- Fixed numeric overflow by adjusting hydraulic_pressure values to fit DECIMAL(5,2) constraint
-- Insert sample ATC data (simulated real-time data)
INSERT INTO public.atc_data (aircraft_id, flight_number, altitude, speed, heading, latitude, longitude, fuel_level, engine_temp, hydraulic_pressure, timestamp)
SELECT 
  id,
  'UA1234',
  35000,
  485.5,
  270.0,
  40.7128,
  -74.0060,
  78.5,
  650.0,
  285.0,
  NOW() - INTERVAL '5 minutes'
FROM public.aircraft WHERE tail_number = 'N12345';

INSERT INTO public.atc_data (aircraft_id, flight_number, altitude, speed, heading, latitude, longitude, fuel_level, engine_temp, hydraulic_pressure, timestamp)
SELECT 
  id,
  'DL5678',
  38000,
  510.2,
  180.0,
  34.0522,
  -118.2437,
  82.3,
  645.0,
  290.0,
  NOW() - INTERVAL '3 minutes'
FROM public.aircraft WHERE tail_number = 'N67890';
