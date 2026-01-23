-- Verify your admin role is set correctly
SELECT id, email, role, created_at 
FROM profiles 
WHERE email = 'ariel40927@gmail.com';

-- This should show role = 'admin'
-- If it shows role = 'user', run this:
-- UPDATE profiles SET role = 'admin' WHERE email = 'ariel40927@gmail.com';
