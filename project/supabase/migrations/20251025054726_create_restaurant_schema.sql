/*
  # Get Berg Restaurant Database Schema

  ## Overview
  Creates the complete database structure for Get Berg restaurant ordering system
  with admin management capabilities.

  ## Tables Created
  
  ### 1. menu_items
  - `id` (uuid, primary key) - Unique identifier for each menu item
  - `name` (text) - Name of the dish
  - `price` (numeric) - Price of the dish
  - `image_url` (text) - URL to the dish image
  - `description` (text, optional) - Description of the dish
  - `is_available` (boolean) - Whether the item is currently available
  - `created_at` (timestamptz) - When the item was added
  - `updated_at` (timestamptz) - Last update time

  ### 2. orders
  - `id` (uuid, primary key) - Unique identifier for each order
  - `order_number` (text, unique) - Human-readable order number
  - `customer_name` (text) - Name of the customer
  - `customer_phone` (text) - Contact number
  - `items` (jsonb) - Array of ordered items with quantities
  - `total_amount` (numeric) - Total order amount
  - `status` (text) - Order status: pending, preparing, delivered
  - `payment_status` (text) - Payment status: unpaid, paid
  - `created_at` (timestamptz) - Order creation time
  - `updated_at` (timestamptz) - Last update time

  ### 3. about_info
  - `id` (uuid, primary key) - Single row identifier
  - `story` (text) - Restaurant story/description
  - `mission` (text) - Mission statement
  - `facebook_url` (text) - Facebook page link
  - `instagram_url` (text) - Instagram profile link
  - `updated_at` (timestamptz) - Last update time

  ## Security
  - All tables have RLS enabled
  - Public can read menu items and about info
  - Public can insert orders (for customer ordering)
  - Only authenticated users (admin) can modify menu, update orders, and edit about info
  - Separate policies for each operation type

  ## Important Notes
  - Uses `gen_random_uuid()` for automatic ID generation
  - Timestamps auto-update using triggers
  - Default values set for boolean and status fields
  - JSONB used for flexible order items storage
*/

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  image_url text NOT NULL,
  description text DEFAULT '',
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_amount numeric(10, 2) NOT NULL CHECK (total_amount >= 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'delivered')),
  payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create about_info table (single row table)
CREATE TABLE IF NOT EXISTS about_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story text DEFAULT '',
  mission text DEFAULT '',
  facebook_url text DEFAULT '',
  instagram_url text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Insert initial about info if not exists
INSERT INTO about_info (story, mission, facebook_url, instagram_url)
SELECT 
  'Welcome to Get Berg, where good food meets good mood! Located in the heart of Rudrapur, we serve delicious meals crafted with love and the finest ingredients.',
  'Our mission is to bring joy to every meal and create memorable dining experiences for our community.',
  '',
  ''
WHERE NOT EXISTS (SELECT 1 FROM about_info);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_about_info_updated_at ON about_info;
CREATE TRIGGER update_about_info_updated_at
  BEFORE UPDATE ON about_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies for menu_items
CREATE POLICY "Anyone can view available menu items"
  ON menu_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert menu items"
  ON menu_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update menu items"
  ON menu_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete menu items"
  ON menu_items FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for orders
CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for about_info
CREATE POLICY "Anyone can view about info"
  ON about_info FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update about info"
  ON about_info FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster order lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON menu_items(is_available);
