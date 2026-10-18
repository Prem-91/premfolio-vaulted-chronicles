/**
 * Automatic backup of all portfolio content to the owner's own Supabase project.
 * Credentials come from the DB_PROJECT_URL / DB_SERVICE_ROLE_KEY secrets (server-only).
 * Backup failures never block admin saves — they are logged and reported.
 */

const TABLES = [
  "about_profile",
  "projects",
  "experiences",
  "skills_groups",
  "achievements",
  "moments",
  "contact_messages",
] as const;

export type BackupResult =
  | { ok: true; backedUpAt: string; counts: Record<string, number> }
  | { ok: false; reason: string };

export async function runBackup(): Promise<BackupResult> {
  const url = process.env["DB_PROJECT_URL"];
  const serviceKey = process.env["DB_SERVICE_ROLE_KEY"];
  if (!url || !serviceKey) return { ok: false, reason: "Backup destination is not configured." };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const snapshot: Record<string, unknown[]> = {};
  const counts: Record<string, number> = {};
  for (const table of TABLES) {
    const { data, error } = await supabaseAdmin.from(table).select("*");
    if (error) return { ok: false, reason: `Could not read ${table}: ${error.message}` };
    snapshot[table] = data ?? [];
    counts[table] = data?.length ?? 0;
  }

  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/portfolio_backups`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ payload: snapshot }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Backup to external project failed [${res.status}]: ${body}`);
    return { ok: false, reason: `Backup destination rejected the snapshot (${res.status}).` };
  }

  return { ok: true, backedUpAt: new Date().toISOString(), counts };
}

/** Fire-and-forget backup after admin writes; never throws. */
export function scheduleBackup(): void {
  void runBackup().then((result) => {
    if (!result.ok) console.error(`Automatic backup skipped: ${result.reason}`);
  });
}
