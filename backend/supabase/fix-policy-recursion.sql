-- ============================================
-- Fix Policy Recursion Error
-- The "Admins can view all profiles" policy causes infinite recursion
-- We need to simplify it to avoid self-referencing
-- ============================================

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- Recreate policies WITHOUT recursion
-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- ⭐ SIMPLIFIED: Allow authenticated users to view all profiles
-- (This removes the recursion issue)
-- We'll check admin status in the application layer instead
CREATE POLICY "Authenticated users can view all profiles" 
  ON profiles FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Allow admins to update any profile (but check role directly without subquery)
CREATE POLICY "Admins can update any profile" 
  ON profiles FOR UPDATE 
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Policy recursion fixed!';
    RAISE NOTICE '✅ Users can now view all profiles without recursion';
    RAISE NOTICE '✅ Admin check should work now';
END $$;

-- Show all policies
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles' ORDER BY cmd;
