-- Check if your profile exists and has admin role
SELECT id, email, role, created_at 
FROM profiles 
WHERE email = 'ariel40927@gmail.com';

-- If the above shows no results or role = 'user', run this:
-- UPDATE profiles SET role = 'admin' WHERE email = 'ariel40927@gmail.com';

-- Show all profiles to see what we have
SELECT id, email, role, created_at FROM profiles ORDER BY created_at DESC;
