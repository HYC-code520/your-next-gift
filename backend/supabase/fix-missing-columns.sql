-- ============================================
-- Fix Missing Columns
-- ============================================

-- 1. Add is_additional_request column to cart_items if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cart_items' AND column_name = 'is_additional_request'
    ) THEN
        ALTER TABLE cart_items 
        ADD COLUMN is_additional_request BOOLEAN DEFAULT FALSE;
        
        RAISE NOTICE '✅ Added is_additional_request column to cart_items';
    ELSE
        RAISE NOTICE 'ℹ️  is_additional_request column already exists in cart_items';
    END IF;
END $$;

-- 2. Add approval_reason column to cart_items if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cart_items' AND column_name = 'approval_reason'
    ) THEN
        ALTER TABLE cart_items 
        ADD COLUMN approval_reason TEXT;
        
        RAISE NOTICE '✅ Added approval_reason column to cart_items';
    ELSE
        RAISE NOTICE 'ℹ️  approval_reason column already exists in cart_items';
    END IF;
END $$;

-- 3. Check birthdays table structure
DO $$ 
DECLARE
    has_date_column BOOLEAN;
    has_birthday_column BOOLEAN;
BEGIN
    -- Check if 'date' column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'birthdays' AND column_name = 'date'
    ) INTO has_date_column;
    
    -- Check if 'birthday' column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'birthdays' AND column_name = 'birthday'
    ) INTO has_birthday_column;
    
    IF has_birthday_column AND NOT has_date_column THEN
        -- Rename 'birthday' to 'date' for consistency
        ALTER TABLE birthdays RENAME COLUMN birthday TO date;
        RAISE NOTICE '✅ Renamed birthday column to date in birthdays table';
    ELSIF has_date_column THEN
        RAISE NOTICE 'ℹ️  date column already exists in birthdays table';
    ELSE
        RAISE NOTICE '⚠️  Neither date nor birthday column found in birthdays table!';
    END IF;
END $$;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database schema update complete!';
    RAISE NOTICE '🔄 Please refresh your browser to clear errors';
END $$;
