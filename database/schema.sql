-- TMS Database Schema
-- Database: tms_db

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS order_documents CASCADE;
DROP TABLE IF EXISTS order_history CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS gps_locations CASCADE;

-- Users table (for authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'DISPATCHER', -- DISPATCHER, ADMIN, DRIVER
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    year_of_production INTEGER,
    load_capacity DECIMAL(10, 2), -- in tons
    insurance_expiry DATE,
    inspection_expiry DATE,
    current_mileage INTEGER DEFAULT 0,
    service_notes TEXT,
    status VARCHAR(50) DEFAULT 'AVAILABLE', -- AVAILABLE, IN_TRANSIT, SERVICE
    assigned_driver_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers table
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, VACATION
    hire_date DATE,
    contract_expiry DATE,
    license_number VARCHAR(50),
    license_expiry DATE,
    medical_exam_expiry DATE,
    vacation_start DATE,
    vacation_end DATE,
    assigned_vehicle_id INTEGER,
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Add foreign key to vehicles after drivers table is created
ALTER TABLE vehicles 
    ADD CONSTRAINT fk_vehicle_driver 
    FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    client_reference VARCHAR(100),
    order_number_internal VARCHAR(100),
    client_name VARCHAR(200) NOT NULL,
    client_phone VARCHAR(20),
    pickup_address TEXT,
    pickup_latitude DECIMAL(10, 8),
    pickup_longitude DECIMAL(11, 8),
    delivery_address TEXT NOT NULL,
    delivery_latitude DECIMAL(10, 8),
    delivery_longitude DECIMAL(11, 8),
    delivery_time_from TIME,
    delivery_time_to TIME,
    weight DECIMAL(10, 2), -- in kg
    notes TEXT,
    status VARCHAR(50) DEFAULT 'NEW', -- NEW, PLANNED, IN_PROGRESS, DELIVERED, PROBLEM, CANCELLED
    assigned_driver_id INTEGER,
    assigned_vehicle_id INTEGER,
    planned_date DATE,
    sequence_number INTEGER,
    pod_photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id),
    FOREIGN KEY (assigned_vehicle_id) REFERENCES vehicles(id)
);

-- Order history table
CREATE TABLE order_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Order documents table
CREATE TABLE order_documents (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    uploaded_by VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- GPS locations table (for driver tracking)
CREATE TABLE gps_locations (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_driver ON orders(assigned_driver_id);
CREATE INDEX idx_orders_date ON orders(planned_date);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_gps_locations_driver ON gps_locations(driver_id);
CREATE INDEX idx_gps_locations_recorded_at ON gps_locations(recorded_at);
CREATE INDEX idx_order_history_order ON order_history(order_id);

-- Insert sample data

-- Sample users
INSERT INTO users (username, password, email, first_name, last_name, role) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', 'admin@tms.pl', 'Admin', 'System', 'ADMIN'),
('dispatcher', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', 'dispatcher@tms.pl', 'Jan', 'Kowalski', 'DISPATCHER');

-- Sample vehicles
INSERT INTO vehicles (registration_number, brand, model, year_of_production, load_capacity, insurance_expiry, inspection_expiry, current_mileage, status) VALUES
('KR12345', 'Volvo', 'FH16', 2020, 25.00, '2026-12-31', '2026-11-15', 150000, 'AVAILABLE'),
('KR67890', 'Mercedes', 'Actros', 2021, 24.00, '2026-10-20', '2026-09-30', 120000, 'AVAILABLE'),
('KR11111', 'Scania', 'R450', 2019, 26.00, '2026-08-15', '2026-07-20', 180000, 'AVAILABLE'),
('KR22222', 'MAN', 'TGX', 2022, 25.50, '2027-01-10', '2026-12-05', 80000, 'AVAILABLE'),
('KR33333', 'DAF', 'XF', 2020, 24.50, '2026-06-30', '2026-05-25', 140000, 'SERVICE');

-- Sample drivers
INSERT INTO drivers (first_name, last_name, phone, email, status, hire_date, contract_expiry, license_number, license_expiry, medical_exam_expiry, assigned_vehicle_id) VALUES
('Piotr', 'Nowak', '500111222', 'piotr.nowak@email.pl', 'ACTIVE', '2020-01-15', '2026-12-31', 'DL123456', '2027-03-15', '2026-09-20', 1),
('Marek', 'Wiśniewski', '500333444', 'marek.wisniewski@email.pl', 'ACTIVE', '2021-03-01', '2026-11-30', 'DL234567', '2026-08-10', '2026-07-15', 2),
('Tomasz', 'Kowalczyk', '500555666', 'tomasz.kowalczyk@email.pl', 'ACTIVE', '2019-06-10', '2027-02-28', 'DL345678', '2027-01-20', '2026-10-05', 3),
('Andrzej', 'Lewandowski', '500777888', 'andrzej.lewandowski@email.pl', 'VACATION', '2022-01-10', '2026-10-15', 'DL456789', '2026-12-01', '2026-08-30', 4),
('Krzysztof', 'Wójcik', '500999000', 'krzysztof.wojcik@email.pl', 'INACTIVE', '2020-09-01', '2026-04-30', 'DL567890', '2026-05-15', '2026-04-10', NULL);

-- Update vehicles with assigned drivers
UPDATE vehicles SET assigned_driver_id = 1 WHERE id = 1;
UPDATE vehicles SET assigned_driver_id = 2 WHERE id = 2;
UPDATE vehicles SET assigned_driver_id = 3 WHERE id = 3;
UPDATE vehicles SET assigned_driver_id = 4 WHERE id = 4;

-- Sample orders
INSERT INTO orders (order_number, client_reference, client_name, client_phone, pickup_address, delivery_address, delivery_time_from, delivery_time_to, weight, notes, status, assigned_driver_id, assigned_vehicle_id, planned_date, sequence_number) VALUES
('ZL-2026-0001', 'REF001', 'ABC Sp. z o.o.', '123456789', 'ul. Wielicka 1, Kraków', 'ul. Floriańska 15, Kraków', '09:00', '12:00', 5000.00, 'Dostawa pilna', 'DELIVERED', 1, 1, CURRENT_DATE - 1, 1),
('ZL-2026-0002', 'REF002', 'XYZ S.A.', '987654321', 'ul. Balicka 50, Kraków', 'ul. Grodzka 20, Kraków', '10:00', '14:00', 3500.00, 'Uwaga na kruche towary', 'IN_PROGRESS', 2, 2, CURRENT_DATE, 1),
('ZL-2026-0003', 'REF003', 'Firmex Sp. z o.o.', '555666777', 'ul. Zakopiańska 100, Kraków', 'ul. Starowiślna 30, Kraków', '08:00', '11:00', 4200.00, NULL, 'PLANNED', 1, 1, CURRENT_DATE, 2),
('ZL-2026-0004', 'REF004', 'BuildCorp', '111222333', 'ul. Wielicka 25, Kraków', 'ul. Dietla 45, Kraków', '13:00', '16:00', 8000.00, 'Winda towarowa', 'NEW', NULL, NULL, CURRENT_DATE + 1, NULL),
('ZL-2026-0005', 'REF005', 'PharmaPol', '444555666', 'ul. Balicka 10, Kraków', 'ul. Szewska 5, Kraków', '09:30', '12:30', 1200.00, 'Wymagana chłodnia', 'PLANNED', 3, 3, CURRENT_DATE, 1),
('ZL-2026-0006', 'REF006', 'FoodDist', '777888999', 'ul. Zakopiańska 75, Kraków', 'ul. Sławkowska 8, Kraków', '11:00', '15:00', 6500.00, NULL, 'PROBLEM', 2, 2, CURRENT_DATE, 2),
('ZL-2026-0007', 'REF007', 'MarketChain', '000111222', 'ul. Wielicka 40, Kraków', 'ul. Poselska 12, Kraków', '14:00', '17:00', 2800.00, NULL, 'NEW', NULL, NULL, CURRENT_DATE + 2, NULL),
('ZL-2026-0008', 'REF008', 'LogiTrans', '333444555', 'ul. Balicka 30, Kraków', 'ul. Kanonicza 3, Kraków', '08:30', '11:30', 5500.00, 'Dostawa do magazynu', 'DELIVERED', 3, 3, CURRENT_DATE - 1, 1);

-- Sample order history
INSERT INTO order_history (order_id, status, notes, created_by, created_at) VALUES
(1, 'NEW', 'Zlecenie utworzone', 'dispatcher', CURRENT_DATE - 2),
(1, 'PLANNED', 'Przypisano kierowcę: Piotr Nowak', 'dispatcher', CURRENT_DATE - 2),
(1, 'IN_PROGRESS', 'Kierowca rozpoczął trasę', 'system', CURRENT_DATE - 1),
(1, 'DELIVERED', 'Dostawa zakończona sukcesem', 'system', CURRENT_DATE - 1),
(2, 'NEW', 'Zlecenie utworzone', 'dispatcher', CURRENT_DATE - 1),
(2, 'PLANNED', 'Przypisano kierowcę: Marek Wiśniewski', 'dispatcher', CURRENT_DATE - 1),
(2, 'IN_PROGRESS', 'Kierowca rozpoczął trasę', 'system', CURRENT_DATE),
(6, 'NEW', 'Zlecenie utworzone', 'dispatcher', CURRENT_DATE - 1),
(6, 'PLANNED', 'Przypisano kierowcę: Marek Wiśniewski', 'dispatcher', CURRENT_DATE - 1),
(6, 'IN_PROGRESS', 'Kierowca rozpoczął trasę', 'system', CURRENT_DATE),
(6, 'PROBLEM', 'Awaria pojazdu - opóźnienie', 'system', CURRENT_DATE);

-- Sample GPS locations
INSERT INTO gps_locations (driver_id, latitude, longitude, recorded_at) VALUES
(1, 50.061897, 19.936756, CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
(2, 50.064650, 19.944979, CURRENT_TIMESTAMP - INTERVAL '3 minutes'),
(3, 50.058000, 19.920000, CURRENT_TIMESTAMP - INTERVAL '7 minutes');
