-- Update "Jellycat Flower Box Arrangement" to "Stuff Toy Flower Box Arrangement"
UPDATE diy_projects 
SET 
  project_name = 'Stuff Toy Flower Box Arrangement',
  description = 'A beautiful flower box arrangement featuring preserved flowers and a cute stuffed toy companion.',
  materials = ARRAY['Flower Box', 'Preserved Flowers', 'Stuffed Toy', 'Ribbon']
WHERE id = 14;

-- Verify the update
SELECT id, project_name, description, materials FROM diy_projects WHERE id = 14;
