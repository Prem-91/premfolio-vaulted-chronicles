CREATE TABLE public.backup_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backed_up_at timestamptz NOT NULL DEFAULT now(),
  ok boolean NOT NULL,
  counts jsonb,
  note text
);

GRANT SELECT, INSERT, DELETE ON public.backup_log TO service_role;

ALTER TABLE public.backup_log ENABLE ROW LEVEL SECURITY;
-- No policies: only the server's service-role client reads/writes this table.
COMMENT ON TABLE public.backup_log IS 'History of backups of portfolio content to the owner''s external backup project.';