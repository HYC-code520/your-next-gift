-- Check specifically for INSERT policies on profiles table
SELECT 
  policyname,
  cmd,
  permissive,
  with_check
FROM pg_policies
WHERE tablename = 'profiles' AND cmd = 'INSERT';

-- If no INSERT policy exists, this will show nothing
-- Let's also check all policies again
SELECT 
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;
