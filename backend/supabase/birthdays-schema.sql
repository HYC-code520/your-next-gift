-- Birthday Calendar Schema
-- This table stores birthday information for the user's friends

-- Create birthdays table
CREATE TABLE IF NOT EXISTS birthdays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  birthday DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_birthdays_user_id ON birthdays(user_id);
CREATE INDEX IF NOT EXISTS idx_birthdays_birthday ON birthdays(birthday);

-- Enable Row Level Security
ALTER TABLE birthdays ENABLE ROW LEVEL SECURITY;

-- RLS Policies for birthdays table

-- Policy: Everyone can view birthdays (public read access)
CREATE POLICY "Anyone can view birthdays"
  ON birthdays
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert birthdays
CREATE POLICY "Authenticated users can insert birthdays"
  ON birthdays
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Policy: Users can update their own birthdays
CREATE POLICY "Users can update their own birthdays"
  ON birthdays
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own birthdays
CREATE POLICY "Users can delete their own birthdays"
  ON birthdays
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_birthdays_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER birthdays_updated_at
  BEFORE UPDATE ON birthdays
  FOR EACH ROW
  EXECUTE FUNCTION update_birthdays_updated_at();
