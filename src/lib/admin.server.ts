// Server-only admin helpers. Lives in a .server.ts file so it never enters the client bundle.
import { enforceRateLimit } from "@/lib/rate-limit.server";

export async function resolveUserEmail(claims: any, userId: string): Promise<string | null> {
  const fromClaims = (claims?.email as string | undefined)?.toLowerCase();
  if (fromClaims) return fromClaims;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.auth.admin.getUserById(userId);
  return data?.user?.email?.toLowerCase() ?? null;
}

export async function isAllowlistedEmail(email: string): Promise<boolean> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("admin_emails")
    .select("email")
    .ilike("email", email)
    .maybeSingle();
  return !!data;
}

export async function assertAdmin(_supabase: any, claims?: any, userId?: string) {
  enforceRateLimit("admin");
  const email = await resolveUserEmail(claims, userId ?? "");
  if (!email || !(await isAllowlistedEmail(email))) throw new Error("Forbidden: admin only");
}
