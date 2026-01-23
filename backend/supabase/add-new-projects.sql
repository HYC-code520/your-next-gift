-- Add new DIY projects to Supabase
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- First, update existing project #6 to be the Woven Black Crossbody Bag
UPDATE diy_projects 
SET 
  project_name = 'Woven Black Crossbody Bag',
  description = 'A stylish handwoven crossbody bag with adjustable chain strap.',
  materials = ARRAY['Thick Yarn', 'Chain Strap', 'Crochet Hook'],
  estimated_time = '1 week'
WHERE id = 6;

-- Insert new projects (IDs 12-20)
INSERT INTO diy_projects (id, project_name, description, materials, estimated_time, images) VALUES
(12, 'Ah-Dai Character Pen Holder', 'An adorable Shin-chan Ah-Dai character mug that doubles as a pen holder. Hand-painted with cute details!', ARRAY['Clay', 'Acrylic Paint', 'Sealant'], '1 week', ARRAY[]::text[]),

(14, 'Stuff Toy Flower Box Arrangement', 'A beautiful flower box arrangement featuring preserved flowers and a cute stuffed toy companion.', ARRAY['Flower Box', 'Preserved Flowers', 'Stuffed Toy', 'Ribbon'], '1 day', ARRAY[]::text[]),

(15, 'Fuji Mountain Woven Bag', 'A stunning woven bag inspired by Mount Fuji with gradient colors.', ARRAY['Thick Yarn', 'Crochet Hook'], '2 weeks', ARRAY[]::text[]),

(16, 'Vintage Birthday Cake Design', 'A beautifully decorated vintage-style birthday cake with intricate piping and elegant design.', ARRAY['Cake Base', 'Buttercream', 'Piping Tips'], '1 day', ARRAY[]::text[]),

(17, 'Kawaii Twisty Sticks Keychain', 'An adorable keychain made from twisty sticks featuring cute character designs with hearts and bows.', ARRAY['Twisty Sticks', 'Keychain Ring', 'Decorations'], '2 days', ARRAY[]::text[]),

(18, 'Miffy Character Clock', 'A cute Miffy-themed clock perfect for any room. Hand-painted with love!', ARRAY['Clock Mechanism', 'Wood Base', 'Acrylic Paint'], '4 days', ARRAY[]::text[]),

(19, 'Twisty Sticks Flower Bouquet', 'A beautiful and everlasting flower bouquet made entirely from twisty sticks. Perfect for any occasion!', ARRAY['Twisty Sticks', 'Ribbon', 'Floral Wire'], '3 days', ARRAY[]::text[]),

(20, 'Chiikawa Character Frame', 'An adorable Chiikawa-themed photo frame with cute character decorations.', ARRAY['Clay', 'Acrylic Paint', 'Frame Base'], '1 week', ARRAY[]::text[])

ON CONFLICT (id) DO UPDATE SET
  project_name = EXCLUDED.project_name,
  description = EXCLUDED.description,
  materials = EXCLUDED.materials,
  estimated_time = EXCLUDED.estimated_time;

-- Add Green Woven Crossbody Bag (ID 21)
INSERT INTO diy_projects (id, project_name, description, materials, estimated_time, images) VALUES
(21, 'Green Woven Shoulder Bag', 'A beautiful sage green woven shoulder bag with chunky texture. Perfect for everyday use!', ARRAY['Chunky Yarn', 'Crochet Hook'], '2 weeks', ARRAY[]::text[])
ON CONFLICT (id) DO UPDATE SET
  project_name = EXCLUDED.project_name,
  description = EXCLUDED.description,
  materials = EXCLUDED.materials,
  estimated_time = EXCLUDED.estimated_time;

-- Add Cat Bow Friendship Frame (ID 22)
INSERT INTO diy_projects (id, project_name, description, materials, estimated_time, images) VALUES
(22, 'Cat Bow Friendship Frame', 'An adorable turquoise photo frame with cute cats, a pink bow, hearts, and stars. Perfect for your bestie!', ARRAY['Clay', 'Acrylic Paint', 'Frame Base'], '1 week', ARRAY[]::text[])
ON CONFLICT (id) DO UPDATE SET
  project_name = EXCLUDED.project_name,
  description = EXCLUDED.description,
  materials = EXCLUDED.materials,
  estimated_time = EXCLUDED.estimated_time;

-- Delete Kawaii Birthday Photo Frame (ID 13)
DELETE FROM diy_projects WHERE id = 13;

-- Add "Always With You" Double Photo Frame (ID 23)
INSERT INTO diy_projects (id, project_name, description, materials, estimated_time, images) VALUES
(23, 'Always With You Double Frame', 'A cute pink polka dot clay photo frame that holds two photos. Features adorable character charms including a girl, dog, star, cupcake, and "Always with you" message.', ARRAY['Clay', 'Acrylic Paint', 'Frame Base', 'Mini Charms'], '1.5 weeks', ARRAY[]::text[])
ON CONFLICT (id) DO UPDATE SET
  project_name = EXCLUDED.project_name,
  description = EXCLUDED.description,
  materials = EXCLUDED.materials,
  estimated_time = EXCLUDED.estimated_time;

-- Add Fancy Fruit Basket (ID 24)
INSERT INTO diy_projects (id, project_name, description, materials, estimated_time, images) VALUES
(24, 'Fancy Fruit Basket Arrangement', 'A beautiful decorative fruit basket arrangement with elegant styling. Perfect as a gift or home decor!', ARRAY['Basket', 'Artificial Fruits', 'Decorative Ribbon', 'Filler'], '1 day', ARRAY[]::text[])
ON CONFLICT (id) DO UPDATE SET
  project_name = EXCLUDED.project_name,
  description = EXCLUDED.description,
  materials = EXCLUDED.materials,
  estimated_time = EXCLUDED.estimated_time;

-- Add Pink Wavy Mirror Frame (ID 25)
INSERT INTO diy_projects (id, project_name, description, materials, estimated_time, images) VALUES
(25, 'Pink Wavy Mirror Frame', 'A gorgeous full-length mirror with a unique pink wavy frame design. Perfect statement piece for any room!', ARRAY['Wood Frame', 'Mirror', 'Pink Paint', 'Wall Hooks'], '2-3 days', ARRAY[]::text[])
ON CONFLICT (id) DO UPDATE SET
  project_name = EXCLUDED.project_name,
  description = EXCLUDED.description,
  materials = EXCLUDED.materials,
  estimated_time = EXCLUDED.estimated_time;

-- Add White Chunky Woven Handbag (ID 26)
INSERT INTO diy_projects (id, project_name, description, materials, estimated_time, images) VALUES
(26, 'White Chunky Woven Handbag', 'A stunning cream-colored chunky knit handbag with braided handles. Super trendy and perfect for everyday use!', ARRAY['Chunky Yarn', 'Knitting Needles', 'Lining Fabric', 'Handles'], '1-2 days', ARRAY[]::text[])
ON CONFLICT (id) DO UPDATE SET
  project_name = EXCLUDED.project_name,
  description = EXCLUDED.description,
  materials = EXCLUDED.materials,
  estimated_time = EXCLUDED.estimated_time;

-- Update project ID 2 (Dog Treat Hider Pizza)
UPDATE diy_projects SET project_name = 'Dog Treat Hider Pizza' WHERE id = 2;

-- Add Cat Treat Hider Pizza (ID 27)
INSERT INTO diy_projects (id, project_name, description, materials, estimated_time, images) VALUES
(27, 'Cat Treat Hider Pizza', 'An adorable pizza-shaped treat puzzle for your cat! Hide treats in the pockets to keep your kitty entertained and mentally stimulated.', ARRAY['Felt Fabric', 'Stuffing', 'Treat Pockets', 'Thread'], '3-4 hours', ARRAY[]::text[])
ON CONFLICT (id) DO UPDATE SET
  project_name = EXCLUDED.project_name,
  description = EXCLUDED.description,
  materials = EXCLUDED.materials,
  estimated_time = EXCLUDED.estimated_time;

-- Verify the new projects were added
SELECT id, project_name FROM diy_projects ORDER BY id;
