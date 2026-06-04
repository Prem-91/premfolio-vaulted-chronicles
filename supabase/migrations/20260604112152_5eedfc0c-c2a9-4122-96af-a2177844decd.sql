
-- Remove unused vault_memories table (replaced by moments)
DROP TABLE IF EXISTS public.vault_memories;

-- Remove direct SELECT policy on admin_emails; rely on SECURITY DEFINER is_admin()
DROP POLICY IF EXISTS "admins can read allowlist" ON public.admin_emails;

-- Revoke EXECUTE on is_admin() from public/authenticated; only used internally by SECURITY DEFINER policies
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM authenticated;
