-- Add categories column as TEXT array to support multiple categories per project
ALTER TABLE diy_projects DROP COLUMN IF EXISTS category;
ALTER TABLE diy_projects ADD COLUMN categories TEXT[] DEFAULT '{}';

-- Update existing projects with categories (now supporting multiple categories!)

-- 🪵 Wood (6 projects)
UPDATE diy_projects SET categories = ARRAY['Wood'] WHERE id = 7;  -- Fireplace Display Shelf
UPDATE diy_projects SET categories = ARRAY['Wood'] WHERE id = 1;  -- Wavy Mirror Frame
UPDATE diy_projects SET categories = ARRAY['Wood'] WHERE id = 25; -- Pink Wavy Mirror Frame

-- ID 10, 11: Wood + Pet (Hamster Hideout, Cat Hideout)
UPDATE diy_projects SET categories = ARRAY['Wood', 'Pet'] WHERE id IN (10, 11);

-- ID 18: Wood + Decor (Miffy Character Clock)
UPDATE diy_projects SET categories = ARRAY['Wood', 'Decor'] WHERE id = 18;

-- 👜 Bag (4 projects)
UPDATE diy_projects SET categories = ARRAY['Bag'] WHERE id IN (6, 15, 21, 26);
-- Woven Black Crossbody Bag, Fuji Mountain Woven Bag, Green Woven Shoulder Bag, White Chunky Woven Handbag

-- 🐾 Pet (5 projects) - some already set above with Wood
UPDATE diy_projects SET categories = ARRAY['Pet'] WHERE id IN (2, 27);
-- Dog Treat Hider Pizza, Cat Treat Hider Pizza

-- ID 3: Pet + Bouquet (Customize Twisty Sticks Pet Bouquet)
UPDATE diy_projects SET categories = ARRAY['Pet', 'Bouquet'] WHERE id = 3;

-- 🖼️ Photo Frame (3 projects)
UPDATE diy_projects SET categories = ARRAY['Photo Frame'] WHERE id IN (20, 22, 23);
-- Chiikawa Character Frame, Cat Bow Friendship Frame, Always With You Double Frame

-- 🏠 Decor (7 projects) - ID 18 already set above with Wood
UPDATE diy_projects SET categories = ARRAY['Decor'] WHERE id IN (5, 8, 12, 14, 17);
-- Mini Store Signboard Magnet, Vintage Mini Photo Album TV, Ah-Dai Character Pen Holder, Jellycat Flower Box, Kawaii Twisty Sticks Keychain

-- ID 19: Decor + Bouquet (Twisty Sticks Flower Bouquet)
UPDATE diy_projects SET categories = ARRAY['Decor', 'Bouquet'] WHERE id = 19;

-- 💐 Bouquet (3 projects) - ID 3, 19 already set above
UPDATE diy_projects SET categories = ARRAY['Bouquet'] WHERE id = 4;
-- Balloon Flower Bouquet

-- 🍰 Food (2 projects)
UPDATE diy_projects SET categories = ARRAY['Food'] WHERE id IN (24, 16);
-- Fancy Fruit Basket Arrangement, Vintage Birthday Cake

-- 🏠 Home (1 project)
UPDATE diy_projects SET categories = ARRAY['Home'] WHERE id = 9;
-- Cookie Seat Cushion

-- Verify categories were assigned
SELECT id, project_name, categories FROM diy_projects ORDER BY id;
