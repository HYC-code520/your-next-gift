-- ============================================
-- Add Birthday Year Tracking to Orders
-- ============================================

-- Add birthday_year column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS birthday_year INTEGER;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user_birthday_year 
ON orders(user_id, birthday_year);

-- Add birthday column to profiles table (if not exists)
-- Note: profiles table uses 'id' not 'user_id' as the primary key
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS birthday DATE;

-- Comment for documentation
COMMENT ON COLUMN orders.birthday_year IS 'The birthday year this gift is for (e.g., 2026)';
COMMENT ON COLUMN profiles.birthday IS 'User birthday in YYYY-MM-DD format';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Birthday year tracking added successfully!';
    RAISE NOTICE '📝 Remember to update existing orders with their birthday_year if needed';
END $$;
