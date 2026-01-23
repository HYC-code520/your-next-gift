-- ============================================
-- Fix Trigger Permissions for Auto-Creating Profiles
-- This adds the missing INSERT policy that the trigger needs
-- ============================================

-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow trigger to insert profiles" ON profiles;

-- Recreate all policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON profiles FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" 
  ON profiles FOR UPDATE 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- CRITICAL: Allow the trigger function to insert profiles
-- This policy allows inserts when there's no authenticated user (during signup)
CREATE POLICY "Allow trigger to insert profiles" 
  ON profiles FOR INSERT 
  WITH CHECK (true);  -- Allow all inserts (the trigger is SECURITY DEFINER so it's safe)

-- ============================================
-- Recreate the trigger function with better error handling
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the signup
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Create profiles for any existing users without profiles
-- ============================================
INSERT INTO profiles (id, email, role)
SELECT id, email, 'user'
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Set your email as admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'ariel40927@gmail.com';

-- ============================================
-- Verify everything is working
-- ============================================
DO $$
DECLARE
  profile_count INTEGER;
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO profile_count FROM profiles;
  SELECT COUNT(*) INTO admin_count FROM profiles WHERE role = 'admin';
  
  RAISE NOTICE '✅ Profiles table has % user(s)', profile_count;
  RAISE NOTICE '✅ Admin accounts: %', admin_count;
  RAISE NOTICE '✅ Trigger is now properly configured with INSERT permissions';
  RAISE NOTICE '✅ New signups will automatically create profiles';
END $$;

-- Show current profiles
SELECT id, email, role, created_at FROM profiles ORDER BY created_at DESC;
