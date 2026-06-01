
-- Memories table for vault gallery
CREATE TABLE public.vault_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date DATE,
  caption TEXT,
  image_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.vault_memories TO service_role;

ALTER TABLE public.vault_memories ENABLE ROW LEVEL SECURITY;

-- No public/authenticated policies: all access goes through server functions
-- using the service role (PIN-validated).

-- Private storage bucket for vault images
INSERT INTO storage.buckets (id, name, public)
VALUES ('vault-memories', 'vault-memories', false)
ON CONFLICT (id) DO NOTHING;
