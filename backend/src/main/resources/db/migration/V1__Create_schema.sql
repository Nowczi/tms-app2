-- ========================================================-- TMS Database Schema Creation-- Flyway Migration V1 - Initial Schema-- ========================================================-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'DISPATCHER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    hire_date DATE,
    contract_expiry DATE,
    license_number VARCHAR(50),
    license_expiry DATE,
    medical_exam_expiry DATE,
    vacation_start DATE,
    vacation_end DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGSERIAL PRIMARY KEY,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    brand VARCHAR(100),
    model VARCHAR(100),
    year_of_production INTEGER,
    load_capacity DECIMAL(10, 2),
    insurance_expiry DATE,
    inspection_expiry DATE,
    current_mileage INTEGER,
    service_notes TEXT,
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    assigned_driver_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehicle_driver FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

-- Documents table - Using UUID to match entity
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    uploaded_by VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
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
    delivery_date DATE,
    cargo_description TEXT,
    cargo_weight DECIMAL(10, 2),
    cargo_volume DECIMAL(10, 2),
    pallet_count INTEGER,
    special_instructions TEXT,
    status VARCHAR(50) DEFAULT 'NEW',
    priority VARCHAR(50) DEFAULT 'NORMAL',
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    payment_amount DECIMAL(12, 2),
    notes TEXT,
    assigned_driver_id BIGINT,
    assigned_vehicle_id BIGINT,
    created_by_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_order_driver FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
    CONSTRAINT fk_order_vehicle FOREIGN KEY (assigned_vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
    CONSTRAINT fk_order_creator FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order history table
CREATE TABLE IF NOT EXISTS order_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by_id BIGINT,
    change_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_changer FOREIGN KEY (changed_by_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order documents table - Standalone entity table (not junction table)
CREATE TABLE IF NOT EXISTS order_documents (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    uploaded_by VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orderdoc_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- GPS locations table
CREATE TABLE IF NOT EXISTS gps_locations (
    id BIGSERIAL PRIMARY KEY,
    driver_id BIGINT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(10, 2),
    speed DECIMAL(8, 2),
    heading DECIMAL(5, 2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gps_driver FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_license_expiry ON drivers(license_expiry);
CREATE INDEX IF NOT EXISTS idx_drivers_contract_expiry ON drivers(contract_expiry);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_reg_number ON vehicles(registration_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_insurance_expiry ON vehicles(insurance_expiry);
CREATE INDEX IF NOT EXISTS idx_vehicles_inspection_expiry ON vehicles(inspection_expiry);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_client_name ON orders(client_name);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_orders_assigned_driver ON orders(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

CREATE INDEX IF NOT EXISTS idx_order_history_order_id ON order_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_history_created_at ON order_history(created_at);

CREATE INDEX IF NOT EXISTS idx_gps_locations_driver ON gps_locations(driver_id);
CREATE INDEX IF NOT EXISTS idx_gps_locations_recorded_at ON gps_locations(recorded_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
