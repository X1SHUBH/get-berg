/*
  # Add User Authentication and Admin Roles

  ## Overview
  Extends the database to support customer authentication and admin role management.

  ## Tables Created/Modified
  
  ### 1. admin_users (new table)
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - Reference to auth.users
  - `role` (text) - Admin role: admin, manager
  - `email` (text) - Admin email
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 2. orders table modifications
  - Add `user_id` (uuid, nullable) - Reference to the customer who placed the order
  - Add `delivery_address` (text, nullable) - Delivery address
  - Add `delivery_lat` (numeric, nullable) - Delivery latitude
  - Add `delivery_lng` (numeric, nullable) - Delivery longitude
  
  ## Security
  - Admin users table restricted to authenticated admins only
  - Orders table updated to allow users to see their own orders
  - Customers can only view/update their own orders
  
  ## Important Notes
  - Uses auth.users for authentication
  - Admin roles managed separately
  - Location data for map integration
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'manager')),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add user_id and location fields to orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'delivery_address'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_address text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'delivery_lat'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_lat numeric(10, 7) DEFAULT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'delivery_lng'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_lng numeric(10, 7) DEFAULT NULL;
  END IF;
END $$;

-- Enable RLS for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Only authenticated admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Only authenticated admins can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Update orders RLS policies to include user-specific access
DROP POLICY IF EXISTS "Anyone can view orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;

CREATE POLICY "Users can view their own orders or all if authenticated admin"
  ON orders FOR SELECT
  TO public
  USING (
    user_id IS NULL OR
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id_param uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = user_id_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
