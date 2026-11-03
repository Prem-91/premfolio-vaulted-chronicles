import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { runBackup, type BackupResult } from "@/lib/backup.server";
import { assertAdmin } from "@/lib/content.functions";

export type BackupStatus = {
  configured: boolean;
  lastBackup: { at: string; ok: boolean; note: string | null } | null;
};

export const getBackupStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<BackupStatus> => {
    await assertAdmin(context.supabase, context.claims, context.userId);
    const configured = Boolean(process.env["DB_PROJECT_URL"] && process.env["DB_SERVICE_ROLE_KEY"]);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("backup_log")
      .select("backed_up_at, ok, note")
      .order("backed_up_at", { ascending: false })
      .limit(1);
    const last = data?.[0] ?? null;
    return {
      configured,
      lastBackup: last ? { at: last.backed_up_at as string, ok: last.ok as boolean, note: (last.note as string | null) ?? null } : null,
    };
  });

export const backupNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<BackupResult> => {
    await assertAdmin(context.supabase, context.claims, context.userId);
    return runBackup();
  });
