-- Add customization columns to cart_items table
ALTER TABLE cart_items
ADD COLUMN IF NOT EXISTS customization JSONB DEFAULT '{}';

-- Add customization columns to order_items table  
ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS customization JSONB DEFAULT '{}';

-- Add comments to explain the customization structure
COMMENT ON COLUMN cart_items.customization IS 'Stores customization options as JSON: {colors: [], size: "", personalization: "", notes: ""}';
COMMENT ON COLUMN order_items.customization IS 'Stores customization options as JSON: {colors: [], size: "", personalization: "", notes: ""}';

-- Add birthday_date to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS birthday_date DATE;

COMMENT ON COLUMN orders.birthday_date IS 'The birthday date for which this gift is intended';
