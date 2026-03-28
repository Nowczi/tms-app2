-- ========================================================
-- TMS Database Sample Data
-- Flyway Migration V2 - Sample Data Insertion
-- ========================================================

-- =====================================================
-- USERS
-- =====================================================
-- Admin user (password: admin - BCrypt encoded)
INSERT INTO users (username, password, email, first_name, last_name, role, is_active, created_at, updated_at)
VALUES ('admin', '$2a$10$Q3vzDJiN2FJx.sCv7Nhwr.AmQa5bIsx5CGTF7zGnVAQ/VuWYzQaw.', 'admin@tms.com', 'System', 'Administrator', 'ADMIN', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

-- Sample dispatcher users
INSERT INTO users (username, password, email, first_name, last_name, role, is_active, created_at, updated_at)
VALUES 
    ('dispatcher1', '$2a$10$Q3vzDJiN2FJx.sCv7Nhwr.AmQa5bIsx5CGTF7zGnVAQ/VuWYzQaw.', 'dispatcher1@tms.com', 'Jan', 'Kowalski', 'DISPATCHER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('dispatcher2', '$2a$10$Q3vzDJiN2FJx.sCv7Nhwr.AmQa5bIsx5CGTF7zGnVAQ/VuWYzQaw.', 'dispatcher2@tms.com', 'Anna', 'Nowak', 'DISPATCHER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- DRIVERS
-- =====================================================
INSERT INTO drivers (first_name, last_name, phone, email, status, hire_date, contract_expiry, license_number, license_expiry, medical_exam_expiry, created_at, updated_at)
VALUES 
    ('Piotr', 'Wiśniewski', '+48 501 123 456', 'piotr.wisniewski@email.com', 'ACTIVE', '2020-01-15', '2025-01-15', 'DL123456', '2026-03-20', '2025-06-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Marek', 'Wójcik', '+48 502 234 567', 'marek.wojcik@email.com', 'ACTIVE', '2019-06-01', '2024-12-31', 'DL234567', '2025-08-10', '2025-04-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Krzysztof', 'Kowalczyk', '+48 503 345 678', 'krzysztof.kowalczyk@email.com', 'ACTIVE', '2021-03-10', '2025-03-10', 'DL345678', '2026-01-15', '2025-09-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Tomasz', 'Lewandowski', '+48 504 456 789', 'tomasz.lewandowski@email.com', 'ON_VACATION', '2018-09-20', '2024-09-20', 'DL456789', '2025-05-25', '2025-03-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Andrzej', 'Dąbrowski', '+48 505 567 890', 'andrzej.dabrowski@email.com', 'ACTIVE', '2022-01-05', '2025-01-05', 'DL567890', '2026-02-28', '2025-07-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Robert', 'Zieliński', '+48 506 678 901', 'robert.zielinski@email.com', 'INACTIVE', '2020-11-15', '2023-11-15', 'DL678901', '2024-12-01', '2024-10-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- VEHICLES
-- =====================================================
INSERT INTO vehicles (registration_number, brand, model, year_of_production, load_capacity, insurance_expiry, inspection_expiry, current_mileage, service_notes, status, assigned_driver_id, created_at, updated_at)
VALUES 
    ('KR 12345', 'Mercedes-Benz', 'Sprinter 316', 2021, 3500.00, '2025-06-15', '2025-04-20', 125000, 'Regular maintenance completed', 'AVAILABLE', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('KR 23456', 'Volkswagen', 'Crafter', 2020, 3500.00, '2025-05-20', '2025-03-15', 158000, 'New tires installed', 'AVAILABLE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('KR 34567', 'Iveco', 'Daily 35S14', 2022, 3500.00, '2025-08-10', '2025-06-30', 89000, 'All systems operational', 'AVAILABLE', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('KR 45678', 'Fiat', 'Ducato', 2019, 3500.00, '2025-04-25', '2025-02-28', 195000, 'Scheduled for service', 'IN_SERVICE', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('KR 56789', 'Renault', 'Master', 2021, 3500.00, '2025-07-30', '2025-05-15', 112000, 'Good condition', 'AVAILABLE', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('KR 67890', 'Ford', 'Transit', 2020, 3500.00, '2024-12-31', '2024-11-30', 178000, 'Needs brake inspection', 'UNAVAILABLE', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- ORDERS
-- =====================================================
INSERT INTO orders (order_number, client_reference, order_number_internal, client_name, client_phone, pickup_address, pickup_latitude, pickup_longitude, delivery_address, delivery_latitude, delivery_longitude, delivery_time_from, delivery_time_to, delivery_date, cargo_description, cargo_weight, cargo_volume, pallet_count, special_instructions, status, priority, payment_status, payment_amount, notes, assigned_driver_id, assigned_vehicle_id, created_by_id, created_at, updated_at)
VALUES 
    -- Completed orders
    ('ORD-2024-0001', 'REF-001', 'INT-001', 'ABC Sp. z o.o.', '+48 12 345 67 89', 'ul. Wielicka 100, 30-552 Kraków', 50.0469, 19.9345, 'ul. Mogilska 50, 31-545 Kraków', 50.0721, 19.9552, '08:00:00', '12:00:00', CURRENT_DATE - INTERVAL '5 days', 'Elektronika - monitory', 150.50, 2.5, 5, 'Handle with care', 'DELIVERED', 'NORMAL', 'PAID', 1250.00, 'Delivered on time', 1, 1, 1, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP),
    
    ('ORD-2024-0002', 'REF-002', 'INT-002', 'XYZ Polska S.A.', '+48 22 123 45 67', 'ul. Domaniewska 39, 02-672 Warszawa', 52.1844, 21.0022, 'ul. Wielicka 150, 30-552 Kraków', 50.0469, 19.9345, '10:00:00', '14:00:00', CURRENT_DATE - INTERVAL '3 days', 'Części samochodowe', 850.00, 8.0, 12, 'Wymagana winda', 'DELIVERED', 'HIGH', 'PAID', 2800.00, 'Client satisfied', 2, 2, 1, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP),
    
    -- In progress orders
    ('ORD-2024-0003', 'REF-003', 'INT-003', 'Best Products Ltd.', '+48 71 234 56 78', 'ul. Legnicka 50, 54-204 Wrocław', 51.1079, 17.0385, 'ul. Pawia 5, 31-154 Kraków', 50.0670, 19.9450, '09:00:00', '13:00:00', CURRENT_DATE, 'Artykuły biurowe', 320.00, 4.2, 8, NULL, 'IN_PROGRESS', 'NORMAL', 'PENDING', 950.00, 'Driver on route', 1, 1, 2, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP),
    
    ('ORD-2024-0004', 'REF-004', 'INT-004', 'Fast Delivery Co.', '+48 32 345 67 89', 'ul. Mickiewicza 10, 40-092 Katowice', 50.2649, 19.0238, 'ul. Starowiślna 50, 31-035 Kraków', 50.0580, 19.9450, '14:00:00', '18:00:00', CURRENT_DATE, 'Żywność - produkty mrożone', 1200.00, 12.0, 20, 'Wymagana chłodnia', 'IN_PROGRESS', 'HIGH', 'PENDING', 3500.00, 'Temperature controlled', 3, 3, 2, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP),
    
    -- Planned orders
    ('ORD-2024-0005', 'REF-005', 'INT-005', 'Green Garden Sp. z o.o.', '+48 61 234 56 78', 'ul. Głogowska 100, 60-104 Poznań', 52.4064, 16.9252, 'ul. Kalwaryjska 50, 30-504 Kraków', 50.0406, 19.9415, '08:00:00', '12:00:00', CURRENT_DATE + INTERVAL '1 day', 'Rośliny doniczkowe', 450.00, 6.5, 15, 'Ostrożnie, rośliny delikatne', 'PLANNED', 'NORMAL', 'PENDING', 1800.00, NULL, 2, 2, 1, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP),
    
    ('ORD-2024-0006', 'REF-006', 'INT-006', 'Tech Solutions', '+48 58 345 67 89', 'ul. Grunwaldzka 50, 80-241 Gdańsk', 54.3520, 18.6466, 'ul. Rakowicka 20, 31-510 Kraków', 50.0665, 19.9580, '10:00:00', '16:00:00', CURRENT_DATE + INTERVAL '2 days', 'Sprzęt IT - serwery', 2500.00, 15.0, 25, 'Wymagane ubezpieczenie', 'PLANNED', 'HIGH', 'PENDING', 7500.00, 'High value cargo', 5, 5, 1, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP),
    
    -- New orders (unassigned)
    ('ORD-2024-0007', 'REF-007', 'INT-007', 'Market Plus', '+48 42 234 56 78', 'ul. Piotrkowska 100, 90-001 Łódź', 51.7730, 19.4584, 'ul. Grodzka 30, 31-044 Kraków', 50.0575, 19.9375, '09:00:00', '15:00:00', CURRENT_DATE + INTERVAL '1 day', 'Artykuły spożywcze', 1800.00, 18.0, 30, NULL, 'NEW', 'NORMAL', 'PENDING', 2200.00, 'Waiting for driver assignment', NULL, NULL, 2, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP),
    
    ('ORD-2024-0008', 'REF-008', 'INT-008', 'Build Corp', '+48 17 345 67 89', 'ul. Lwowska 50, 35-301 Rzeszów', 50.0413, 21.9990, 'ul. Dietla 80, 31-039 Kraków', 50.0500, 19.9420, '07:00:00', '11:00:00', CURRENT_DATE + INTERVAL '3 days', 'Materiały budowlane', 3500.00, 20.0, 0, 'Wymagana plandeka', 'NEW', 'HIGH', 'PENDING', 4500.00, 'Heavy load', NULL, NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    
    -- Problem orders
    ('ORD-2024-0009', 'REF-009', 'INT-009', 'Urgent Cargo Ltd.', '+48 15 234 56 78', 'ul. Warszawska 100, 15-201 Białystok', 53.1325, 23.1688, 'ul. Sławkowska 20, 31-014 Kraków', 50.0625, 19.9375, '12:00:00', '16:00:00', CURRENT_DATE - INTERVAL '1 day', 'Dokumenty poufne', 25.00, 0.5, 1, 'Doręczyć osobiście', 'PROBLEM', 'URGENT', 'PENDING', 500.00, 'Delivery failed - client not available', 1, 1, 2, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP),
    
    ('ORD-2024-0010', 'REF-010', 'INT-010', 'Med Supply Co.', '+48 81 345 67 89', 'ul. Lubelska 50, 20-400 Lublin', 51.2465, 22.5684, 'ul. Kopernika 30, 31-501 Kraków', 50.0642, 19.9465, '08:00:00', '10:00:00', CURRENT_DATE, 'Suplementy diety', 800.00, 5.0, 10, 'Priorytet - produkty medyczne', 'PROBLEM', 'URGENT', 'PENDING', 1500.00, 'Vehicle breakdown - need replacement', 3, 3, 1, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP);

-- =====================================================
-- ORDER HISTORY
-- =====================================================
INSERT INTO order_history (order_id, previous_status, new_status, changed_by_id, change_reason, created_at)
VALUES 
    (1, 'NEW', 'PLANNED', 1, 'Order accepted and planned', CURRENT_TIMESTAMP - INTERVAL '7 days'),
    (1, 'PLANNED', 'IN_PROGRESS', 1, 'Driver started delivery', CURRENT_TIMESTAMP - INTERVAL '5 days'),
    (1, 'IN_PROGRESS', 'DELIVERED', 1, 'Successfully delivered', CURRENT_TIMESTAMP - INTERVAL '5 days'),
    
    (2, 'NEW', 'PLANNED', 1, 'Order accepted and planned', CURRENT_TIMESTAMP - INTERVAL '5 days'),
    (2, 'PLANNED', 'IN_PROGRESS', 2, 'Driver started delivery', CURRENT_TIMESTAMP - INTERVAL '3 days'),
    (2, 'IN_PROGRESS', 'DELIVERED', 2, 'Successfully delivered', CURRENT_TIMESTAMP - INTERVAL '3 days'),
    
    (3, 'NEW', 'PLANNED', 2, 'Order accepted and planned', CURRENT_TIMESTAMP - INTERVAL '2 days'),
    (3, 'PLANNED', 'IN_PROGRESS', 2, 'Driver started delivery', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    
    (4, 'NEW', 'PLANNED', 2, 'Order accepted and planned', CURRENT_TIMESTAMP - INTERVAL '2 days'),
    (4, 'PLANNED', 'IN_PROGRESS', 2, 'Driver started delivery', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    
    (5, 'NEW', 'PLANNED', 1, 'Order accepted and planned', CURRENT_TIMESTAMP - INTERVAL '2 days'),
    
    (6, 'NEW', 'PLANNED', 1, 'Order accepted and planned', CURRENT_TIMESTAMP - INTERVAL '3 days'),
    
    (9, 'NEW', 'PLANNED', 2, 'Order accepted and planned', CURRENT_TIMESTAMP - INTERVAL '3 days'),
    (9, 'PLANNED', 'IN_PROGRESS', 2, 'Driver started delivery', CURRENT_TIMESTAMP - INTERVAL '2 days'),
    (9, 'IN_PROGRESS', 'PROBLEM', 2, 'Client not available at delivery address', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    
    (10, 'NEW', 'PLANNED', 1, 'Order accepted and planned', CURRENT_TIMESTAMP - INTERVAL '2 days'),
    (10, 'PLANNED', 'IN_PROGRESS', 1, 'Driver started delivery', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    (10, 'IN_PROGRESS', 'PROBLEM', 1, 'Vehicle breakdown during delivery', CURRENT_TIMESTAMP - INTERVAL '12 hours');

-- =====================================================
-- GPS LOCATIONS (Sample tracking data)
-- =====================================================
INSERT INTO gps_locations (driver_id, latitude, longitude, accuracy, speed, heading, recorded_at, created_at)
VALUES 
    -- Driver 1 - currently delivering order 3
    (1, 50.0600, 19.9400, 5.0, 45.5, 90.0, CURRENT_TIMESTAMP - INTERVAL '5 minutes', CURRENT_TIMESTAMP),
    (1, 50.0610, 19.9410, 4.0, 42.0, 85.0, CURRENT_TIMESTAMP - INTERVAL '10 minutes', CURRENT_TIMESTAMP),
    (1, 50.0620, 19.9420, 6.0, 48.0, 95.0, CURRENT_TIMESTAMP - INTERVAL '15 minutes', CURRENT_TIMESTAMP),
    
    -- Driver 2 - currently delivering order 4
    (2, 50.0550, 19.9480, 3.0, 38.5, 180.0, CURRENT_TIMESTAMP - INTERVAL '5 minutes', CURRENT_TIMESTAMP),
    (2, 50.0540, 19.9470, 4.0, 40.0, 175.0, CURRENT_TIMESTAMP - INTERVAL '10 minutes', CURRENT_TIMESTAMP),
    
    -- Driver 3 - parked/waiting
    (3, 50.0650, 19.9500, 2.0, 0.0, 0.0, CURRENT_TIMESTAMP - INTERVAL '5 minutes', CURRENT_TIMESTAMP),
    
    -- Driver 5 - active
    (5, 50.0700, 19.9350, 5.0, 52.0, 270.0, CURRENT_TIMESTAMP - INTERVAL '5 minutes', CURRENT_TIMESTAMP);

-- =====================================================
-- DOCUMENTS (Sample documents)
-- =====================================================
INSERT INTO documents (file_name, file_type, file_size, file_path, description, upload_date, expiry_date, document_type, created_at, updated_at)
VALUES 
    ('umowa_przewozu_001.pdf', 'application/pdf', 245760, '/documents/contracts/umowa_przewozu_001.pdf', 'Umowa przewozu - ABC Sp. z o.o.', CURRENT_TIMESTAMP - INTERVAL '7 days', NULL, 'CONTRACT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('faktura_001.pdf', 'application/pdf', 125952, '/documents/invoices/faktura_001.pdf', 'Faktura za przewóz - ORD-2024-0001', CURRENT_TIMESTAMP - INTERVAL '5 days', NULL, 'INVOICE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('polisa_ubezpieczeniowa.pdf', 'application/pdf', 512000, '/documents/insurance/polisa_ubezpieczeniowa.pdf', 'Polisa ubezpieczeniowa - pojazd KR 12345', CURRENT_TIMESTAMP - INTERVAL '30 days', '2025-06-15', 'INSURANCE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('prawo_jazdy_piotr.pdf', 'image/jpeg', 1048576, '/documents/licenses/prawo_jazdy_piotr.pdf', 'Prawo jazdy - Piotr Wiśniewski', CURRENT_TIMESTAMP - INTERVAL '365 days', '2026-03-20', 'LICENSE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- ORDER DOCUMENTS (Junction table)
-- =====================================================
INSERT INTO order_documents (order_id, document_id, document_type, created_at)
VALUES 
    (1, 1, 'CONTRACT', CURRENT_TIMESTAMP),
    (1, 2, 'INVOICE', CURRENT_TIMESTAMP);
