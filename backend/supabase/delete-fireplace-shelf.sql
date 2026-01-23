-- Delete "Fireplace Display Shelf" (ID 7)
DELETE FROM diy_projects WHERE id = 7;

-- Verify deletion
SELECT id, project_name FROM diy_projects ORDER BY id;
