-- Update all DIY projects to use a nice placeholder image
-- Run this in Supabase SQL Editor to update existing data

UPDATE diy_projects 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1484069560501-87d72b0c3669?w=800&h=800&fit=crop'
]
WHERE id = 1;

UPDATE diy_projects 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
]
WHERE id = 2;

UPDATE diy_projects 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1484069560501-87d72b0c3669?w=800&h=800&fit=crop'
]
WHERE id = 3;

UPDATE diy_projects 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
]
WHERE id = 4;

UPDATE diy_projects 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=800&h=800&fit=crop'
]
WHERE id = 5;

UPDATE diy_projects 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1484069560501-87d72b0c3669?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=800&fit=crop'
]
WHERE id = 6;

UPDATE diy_projects 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop'
]
WHERE id = 7;

UPDATE diy_projects 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1484069560501-87d72b0c3669?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=800&fit=crop'
]
WHERE id = 8;

UPDATE diy_projects 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=800&h=800&fit=crop'
]
WHERE id = 9;

UPDATE diy_projects 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
]
WHERE id = 10;

UPDATE diy_projects 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1484069560501-87d72b0c3669?w=800&h=800&fit=crop'
]
WHERE id = 11;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ All projects updated with Unsplash placeholder images!';
END $$;
