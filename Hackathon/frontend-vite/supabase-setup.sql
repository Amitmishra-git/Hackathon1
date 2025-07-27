-- Create users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    phone VARCHAR,
    user_type VARCHAR CHECK (user_type IN ('vendor', 'supplier')) NOT NULL,
    language VARCHAR DEFAULT 'english',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendors table
CREATE TABLE vendors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    description TEXT,
    location VARCHAR NOT NULL,
    business_license VARCHAR,
    gst_number VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    products TEXT[] NOT NULL,
    rating DECIMAL(3,2) DEFAULT 4.5,
    location VARCHAR NOT NULL,
    contact_info JSONB NOT NULL,
    price_range VARCHAR NOT NULL,
    description TEXT NOT NULL,
    established VARCHAR NOT NULL,
    certifications TEXT[] DEFAULT '{}',
    business_license VARCHAR,
    gst_number VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_category ON vendors(category);
CREATE INDEX idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX idx_suppliers_category ON suppliers(category);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read their own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (true);

-- Create policies for vendors table
CREATE POLICY "Vendors can read all vendors" ON vendors FOR SELECT USING (true);
CREATE POLICY "Vendors can insert their own data" ON vendors FOR INSERT WITH CHECK (true);
CREATE POLICY "Vendors can update their own data" ON vendors FOR UPDATE USING (true);

-- Create policies for suppliers table
CREATE POLICY "Suppliers can read all suppliers" ON suppliers FOR SELECT USING (true);
CREATE POLICY "Suppliers can insert their own data" ON suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "Suppliers can update their own data" ON suppliers FOR UPDATE USING (true);

-- Insert sample data for testing
INSERT INTO users (name, email, phone, user_type, language) VALUES
('Test Supplier 1', 'supplier1@test.com', '+91 98765 43210', 'supplier', 'english'),
('Test Supplier 2', 'supplier2@test.com', '+91 87654 32109', 'supplier', 'english'),
('Test Vendor 1', 'vendor1@test.com', '+91 76543 21098', 'vendor', 'english');

-- Insert sample suppliers
INSERT INTO suppliers (
    user_id, 
    business_name, 
    category, 
    products, 
    rating, 
    location, 
    contact_info, 
    price_range, 
    description, 
    established, 
    certifications
) VALUES
(
    (SELECT id FROM users WHERE email = 'supplier1@test.com'),
    'Organic Farm Direct',
    'Fresh Fruits & Vegetables',
    ARRAY['Organic Apples', 'Fresh Spinach', 'Tomatoes', 'Carrots', 'Bananas'],
    4.8,
    'Mumbai, Maharashtra',
    '{"phone": "+91 98765 43210", "email": "supplier1@test.com"}',
    '₹20 - ₹500 per kg',
    'Premium organic fruits and vegetables directly from certified organic farms',
    '2015',
    ARRAY['Organic India Certified', 'FSSAI Licensed', 'Fair Trade']
),
(
    (SELECT id FROM users WHERE email = 'supplier2@test.com'),
    'Spice Kingdom',
    'Spices & Condiments',
    ARRAY['Whole Spices', 'Ground Spices', 'Masala Blends', 'Pickles', 'Chutneys'],
    4.7,
    'Pune, Maharashtra',
    '{"phone": "+91 87654 32109", "email": "supplier2@test.com"}',
    '₹100 - ₹2,000 per kg',
    'Authentic Indian spices and condiments with traditional flavors',
    '2005',
    ARRAY['FSSAI Licensed', 'Spices Board Certified', 'Organic Certified']
);