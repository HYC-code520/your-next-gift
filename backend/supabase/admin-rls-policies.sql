-- ============================================
-- Admin RLS Policies
-- Run this AFTER admin-role-setup.sql
-- Allows admins to access all data
-- ============================================

-- ============================================
-- Orders Table - Admin Access
-- ============================================
CREATE POLICY "Admins can view all orders" 
  ON orders FOR SELECT 
  USING (is_admin());

CREATE POLICY "Admins can update all orders" 
  ON orders FOR UPDATE 
  USING (is_admin());

-- ============================================
-- Order Items Table - Admin Access
-- ============================================
CREATE POLICY "Admins can view all order items" 
  ON order_items FOR SELECT 
  USING (is_admin());

-- ============================================
-- Cart Items Table - Admin Access
-- (For viewing/managing additional requests)
-- ============================================
CREATE POLICY "Admins can view all cart items" 
  ON cart_items FOR SELECT 
  USING (is_admin());

CREATE POLICY "Admins can update cart items" 
  ON cart_items FOR UPDATE 
  USING (is_admin());

CREATE POLICY "Admins can delete cart items" 
  ON cart_items FOR DELETE 
  USING (is_admin());

-- ============================================
-- Carts Table - Admin Access
-- ============================================
CREATE POLICY "Admins can view all carts" 
  ON carts FOR SELECT 
  USING (is_admin());

-- ============================================
-- DIY Projects Table - Admin Access
-- ============================================
CREATE POLICY "Admins can insert projects" 
  ON diy_projects FOR INSERT 
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update projects" 
  ON diy_projects FOR UPDATE 
  USING (is_admin());

CREATE POLICY "Admins can delete projects" 
  ON diy_projects FOR DELETE 
  USING (is_admin());

-- ============================================
-- Birthdays Table - Admin Access
-- ============================================
CREATE POLICY "Admins can view all birthdays" 
  ON birthdays FOR SELECT 
  USING (is_admin());

CREATE POLICY "Admins can update birthdays" 
  ON birthdays FOR UPDATE 
  USING (is_admin());

CREATE POLICY "Admins can delete birthdays" 
  ON birthdays FOR DELETE 
  USING (is_admin());

-- ============================================
-- Success Message
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Admin RLS policies created successfully!';
    RAISE NOTICE '   Admins can now access all orders, projects, birthdays, and cart items.';
END $$;
