-- Add Custom Pet Incense Stick Holder (ID 28)
INSERT INTO diy_projects (id, project_name, description, materials, estimated_time, images, categories) VALUES
(28, 'Custom Pet Incense Stick Holder', 'An adorable custom pet-shaped incense stick holder with a pink dish. Perfect for pet lovers who want a functional and cute decor piece!', ARRAY['Clay', 'Acrylic Paint', 'Ceramic Dish', 'Sealant'], '1 week', ARRAY[]::text[], ARRAY['Pet', 'Decor'])
ON CONFLICT (id) DO UPDATE SET
  project_name = EXCLUDED.project_name,
  description = EXCLUDED.description,
  materials = EXCLUDED.materials,
  estimated_time = EXCLUDED.estimated_time,
  categories = EXCLUDED.categories;

-- Verify the new project
SELECT id, project_name, description, categories FROM diy_projects WHERE id = 28;
