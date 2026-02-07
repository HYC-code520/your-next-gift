-- Create storage bucket for pet photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-photos', 'pet-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload
CREATE POLICY "Users can upload pet photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pet-photos');

-- Allow public read access
CREATE POLICY "Public can view pet photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pet-photos');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own pet photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pet-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
