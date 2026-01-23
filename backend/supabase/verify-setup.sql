-- ============================================
-- Verify Admin Setup
-- ============================================

-- Check if trigger exists
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- Check RLS policies on profiles table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Check current profiles
SELECT id, email, role, created_at FROM profiles;

-- Check auth.users (to see if any users exist)
SELECT id, email, created_at FROM auth.users;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Setup verification complete!';
    RAISE NOTICE '   If you see the trigger and policies above, you are ready to sign up!';
END $$;
