-- ============================================
-- FINAL FIX FOR SIGNUP AND ADMIN FEATURES
-- Run this script in Supabase SQL Editor
-- ============================================

-- Step 1: Ensure profiles table has all required columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS birthday DATE;

-- Step 2: Ensure orders table has birthday_year column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS birthday_year INTEGER;

-- Step 3: Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user_birthday_year 
ON orders(user_id, birthday_year);

-- Step 4: Add comments for documentation
COMMENT ON COLUMN orders.birthday_year IS 'The birthday year this gift is for (e.g., 2026)';
COMMENT ON COLUMN profiles.birthday IS 'User birthday in YYYY-MM-DD format';

-- Step 5: Verify the profiles table structure
-- Run this to check if everything is correct:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Step 6: Verify the orders table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'orders'
ORDER BY ordinal_position;

-- Step 7: Verify the birthdays table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'birthdays'
ORDER BY ordinal_position;

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- profiles table should have:
--   - id (uuid, primary key, linked to auth.users.id)
--   - email (text)
--   - full_name (text, nullable)
--   - phone_number (text, nullable)
--   - address (text, nullable)
--   - is_admin (boolean, default false)
--   - birthday (date, nullable) <- NEW
--   - created_at (timestamp)
--   - updated_at (timestamp)
--
-- orders table should have:
--   - id (uuid, primary key)
--   - user_id (uuid, foreign key to auth.users.id)
--   - user_name (text)
--   - user_email (text)
--   - user_phone (text, nullable)
--   - user_address (text, nullable)
--   - birthday_date (date, nullable)
--   - birthday_year (integer, nullable) <- NEW
--   - status (text)
--   - created_at (timestamp)
--   - updated_at (timestamp)
--
-- birthdays table should have:
--   - id (uuid, primary key)
--   - user_id (uuid, foreign key to auth.users.id)
--   - name (text)
--   - date (date) <- Note: column is called 'date', not 'birthday'
--   - notes (text, nullable)
--   - created_at (timestamp)
--   - updated_at (timestamp)
-- ============================================
