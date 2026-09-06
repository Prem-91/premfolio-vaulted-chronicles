CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit a contact message"
ON public.contact_messages FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "admin can read contact messages"
ON public.contact_messages FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "admin can update contact messages"
ON public.contact_messages FOR UPDATE TO authenticated
USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admin can delete contact messages"
ON public.contact_messages FOR DELETE TO authenticated
USING (is_admin());