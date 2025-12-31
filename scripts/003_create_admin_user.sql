-- Insert admin user (you'll need to set the password through Supabase auth UI)
-- This script creates the user record, but you may need to manually set the password
-- OR use Supabase dashboard to create admin user with email: admin@example.com, password: admin

INSERT INTO auth.users (
  id, 
  email, 
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  crypt('admin', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;
