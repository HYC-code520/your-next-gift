-- Add Pet category to Cat Bow Friendship Frame (ID 22)
UPDATE diy_projects SET categories = ARRAY['Photo Frame', 'Pet'] WHERE id = 22;

-- Add Pet category to Custom Pet Incense Stick Holder (ID 28)
UPDATE diy_projects SET categories = ARRAY['Pet', 'Decor'] WHERE id = 28;

-- Verify
SELECT id, project_name, categories FROM diy_projects WHERE id IN (22, 28);
