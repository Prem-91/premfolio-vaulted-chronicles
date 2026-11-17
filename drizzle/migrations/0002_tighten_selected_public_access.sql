DROP POLICY IF EXISTS "public read moments" ON public.moments;

DROP POLICY IF EXISTS "anyone can submit a contact message" ON public.contact_messages;

DROP POLICY IF EXISTS "public read moments bucket" ON storage.objects;
CREATE POLICY "admin read moments bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'moments'::text AND public.is_admin());