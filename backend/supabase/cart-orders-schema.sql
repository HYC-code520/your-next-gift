-- ============================================
-- Shopping Cart & Orders System Schema
-- Run this in Supabase SQL Editor AFTER the main schema
-- ============================================

-- ============================================
-- Table: carts
-- Each user has one cart
-- ============================================
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- Table: cart_items
-- Items in each user's cart
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES diy_projects(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  recipient_name TEXT,
  birthday TEXT,
  color_preference TEXT,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Table: orders
-- Submitted carts become orders
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  total_items INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Table: order_items
-- Items in each order
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES diy_projects(id),
  project_name TEXT NOT NULL,
  project_description TEXT,
  project_image TEXT,
  quantity INTEGER DEFAULT 1,
  recipient_name TEXT,
  birthday TEXT,
  color_preference TEXT,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Row Level Security for Carts
-- ============================================
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

-- Users can only see and manage their own cart
CREATE POLICY "Users can view their own cart"
  ON carts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cart"
  ON carts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart"
  ON carts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- Row Level Security for Cart Items
-- ============================================
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Users can manage items in their own cart
CREATE POLICY "Users can view their own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can add items to their cart"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete their cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
  );

-- ============================================
-- Row Level Security for Orders
-- ============================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
-- Admins can view all orders (we'll handle admin check in app)
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow admin to update order status (anyone authenticated can update for now - refine later)
CREATE POLICY "Users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true);

-- ============================================
-- Row Level Security for Order Items
-- ============================================
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can view items in their own orders
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ============================================
-- Function: Update timestamp on update
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Triggers: Auto-update timestamps
-- ============================================
CREATE TRIGGER update_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Success Message
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Shopping cart and orders tables created successfully!';
END $$;
