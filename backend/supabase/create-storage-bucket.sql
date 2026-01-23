-- ============================================
-- Create Storage Bucket for Project Photos
-- ============================================

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-photos', 'project-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the bucket
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-photos');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-photos' 
  AND auth.role() = 'authenticated'
);

-- Allow admins to delete
CREATE POLICY "Admins can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-photos' 
  AND is_admin()
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Storage bucket "project-photos" created successfully!';
    RAISE NOTICE '✅ Public read access enabled';
    RAISE NOTICE '✅ Authenticated users can upload';
    RAISE NOTICE '✅ Admins can delete';
    RAISE NOTICE '🎉 You can now upload photos from your computer!';
END $$;
