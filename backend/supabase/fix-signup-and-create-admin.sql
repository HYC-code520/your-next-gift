-- ============================================
-- Fix Signup Issue & Create Admin Profile
-- Run this in Supabase SQL Editor
-- ============================================

-- First, let's make sure the trigger function exists and is correct
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO NOTHING;  -- Prevent duplicate key errors
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger to ensure it's working
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Manually create profile for existing user (if signup already happened)
-- Replace 'ariel40927@gmail.com' with your actual email if different
-- ============================================

-- This will create a profile for any existing auth.users that don't have a profile yet
INSERT INTO profiles (id, email, role)
SELECT id, email, 'user'
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Now set YOUR email as admin
-- IMPORTANT: Replace this email with yours!
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'ariel40927@gmail.com';

-- ============================================
-- Verify the setup
-- ============================================
DO $$
DECLARE
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM profiles WHERE role = 'admin';
  
  IF admin_count > 0 THEN
    RAISE NOTICE '✅ Success! You have % admin account(s)', admin_count;
    RAISE NOTICE '✅ Trigger is set up for future signups';
    RAISE NOTICE '✅ You can now log in and access /admin';
  ELSE
    RAISE NOTICE '⚠️  No admin accounts found. Make sure to update the email in line 36!';
  END IF;
END $$;

-- Show all profiles (for verification)
SELECT id, email, role, created_at FROM profiles;
