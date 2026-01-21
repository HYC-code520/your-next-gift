-- SQL Schema for Your Next Gift App
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ============================================
-- Table: diy_projects
-- ============================================
CREATE TABLE diy_projects (
  id SERIAL PRIMARY KEY,
  project_name TEXT NOT NULL,
  description TEXT,
  materials TEXT[], -- Array of materials
  estimated_time TEXT,
  images TEXT[], -- Array of image URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Table: request_submissions
-- ============================================
CREATE TABLE request_submissions (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  requested_diy TEXT NOT NULL,
  birthday TEXT,
  color_preference TEXT,
  additional_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE diy_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for diy_projects
-- ============================================

-- Allow anyone to read DIY projects (public read access)
CREATE POLICY "Allow public read access to diy_projects"
  ON diy_projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to insert (optional - for future admin features)
CREATE POLICY "Allow authenticated users to insert diy_projects"
  ON diy_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update (optional - for future admin features)
CREATE POLICY "Allow authenticated users to update diy_projects"
  ON diy_projects
  FOR UPDATE
  TO authenticated
  USING (true);

-- ============================================
-- RLS Policies for request_submissions
-- ============================================

-- Allow anyone to submit a request (public insert access)
CREATE POLICY "Allow public insert access to request_submissions"
  ON request_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow only authenticated users to read requests (so only YOU can see them)
CREATE POLICY "Allow authenticated users to read request_submissions"
  ON request_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- Insert Sample Data (from your db.json)
-- ============================================

INSERT INTO diy_projects (id, project_name, description, materials, estimated_time, images) VALUES
(1, 'Wavy Mirror Frame', 'A decorative frame for mirrors, perfect for any room.', ARRAY['Wood', 'Paint'], '2 weeks', ARRAY['/image/Wavy-frame.JPG', 'https://via.placeholder.com/300/FF0000', 'https://via.placeholder.com/300/00FF00']),
(2, 'Pet Treat Hider Pizza', 'A fun toy to hide pet treats, shaped like a pizza slice.', ARRAY['Fabric', 'Stuffing'], '1 week', ARRAY['https://via.placeholder.com/300', 'https://via.placeholder.com/300/FF0000', 'https://via.placeholder.com/300/0000FF']),
(3, 'Customize Twisty Sticks Pet Bouquet', 'A playful and colorful bouquet for your pet made from twisty sticks.', ARRAY['Twisty Sticks', 'Ribbon'], '3 days', ARRAY['https://via.placeholder.com/300', 'https://via.placeholder.com/300/FFFF00', 'https://via.placeholder.com/300/00FFFF']),
(4, 'Balloon Flower Bouquet', 'A stunning bouquet of flowers made from balloons.', ARRAY['Balloons', 'Pump'], '2 days', ARRAY['https://via.placeholder.com/300', 'https://via.placeholder.com/300/FF00FF', 'https://via.placeholder.com/300/00FF00']),
(5, 'Mini Store Signboard Magnet', 'A tiny, vintage-inspired store signboard as a magnet.', ARRAY['Wood', 'Paint', 'Magnets'], '3 days', ARRAY['https://via.placeholder.com/300', 'https://via.placeholder.com/300/0000FF', 'https://via.placeholder.com/300/FF0000']),
(6, 'Adjustable Crossbody Bag', 'A stylish and customizable crossbody bag with adjustable straps.', ARRAY['Fabric', 'Straps', 'Sewing Kit'], '1 week', ARRAY['https://via.placeholder.com/300', 'https://via.placeholder.com/300/FFFF00', 'https://via.placeholder.com/300/00FFFF']),
(7, 'Fireplace Display Shelf', 'A decorative shelf styled as a miniature fireplace.', ARRAY['Wood', 'Paint'], '1.5 weeks', ARRAY['https://via.placeholder.com/300', 'https://via.placeholder.com/300/FF00FF', 'https://via.placeholder.com/300/00FF00']),
(8, 'Vintage Mini Photo Album TV', 'A nostalgic photo album shaped like a vintage TV.', ARRAY['Cardboard', 'Decorative Paper'], '1 week', ARRAY['https://via.placeholder.com/300', 'https://via.placeholder.com/300/FFFF00', 'https://via.placeholder.com/300/0000FF']),
(9, 'Cookie Seat Cushion', 'A comfy seat cushion designed to look like a cookie.', ARRAY['Fabric', 'Stuffing'], '5 days', ARRAY['https://via.placeholder.com/300', 'https://via.placeholder.com/300/FF0000', 'https://via.placeholder.com/300/00FFFF']),
(10, 'Hamster Hideout', 'A cozy and fun hideout for your hamster.', ARRAY['Wood', 'Paint'], '4 days', ARRAY['https://via.placeholder.com/300', 'https://via.placeholder.com/300/FF00FF', 'https://via.placeholder.com/300/FFFF00']),
(11, 'Cat Hideout', 'A custom hideout for your cat to relax and play.', ARRAY['Wood', 'Fabric', 'Paint'], '1 week', ARRAY['https://via.placeholder.com/300', 'https://via.placeholder.com/300/0000FF', 'https://via.placeholder.com/300/FF0000']);

-- Reset the sequence to continue from 12 for future inserts
SELECT setval('diy_projects_id_seq', 11, true);

-- ============================================
-- Helpful Queries for Testing
-- ============================================

-- View all DIY projects
-- SELECT * FROM diy_projects;

-- View all requests
-- SELECT * FROM request_submissions ORDER BY created_at DESC;

-- Count requests
-- SELECT COUNT(*) FROM request_submissions;
