/**
 * Automatic backup of all portfolio content to the owner's own external project.
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

async function recordAttempt(ok: boolean, counts: Record<string, number> | null, note: string | null): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("backup_log").insert({ ok, counts, note });
    if (error) console.error(`Could not record backup attempt: ${error.message}`);
    else {
      // Keep the log small: drop attempts older than the latest 50.
      const { data: keep } = await supabaseAdmin
        .from("backup_log")
        .select("backed_up_at")
        .order("backed_up_at", { ascending: false })
        .range(49, 49);
      if (keep?.[0]?.backed_up_at) {
        await supabaseAdmin.from("backup_log").delete().lt("backed_up_at", keep[0].backed_up_at);
      }
    }
  } catch (e) {
    console.error(`Could not record backup attempt: ${e instanceof Error ? e.message : e}`);
  }
}

export async function runBackup(): Promise<BackupResult> {
  const url = process.env["DB_PROJECT_URL"];
  const serviceKey = process.env["DB_SERVICE_ROLE_KEY"];
  if (!url || !serviceKey) {
    return { ok: false, reason: "Backup destination is not configured." };
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const snapshot: Record<string, unknown[]> = {};
  const counts: Record<string, number> = {};
  for (const table of TABLES) {
    const { data, error } = await supabaseAdmin.from(table).select("*");
    if (error) {
      const reason = `Could not read ${table}: ${error.message}`;
      await recordAttempt(false, null, reason);
      return { ok: false, reason };
    }
    snapshot[table] = data ?? [];
    counts[table] = data?.length ?? 0;
  }

  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/portfolio_backups`;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ payload: snapshot }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Backup to external project failed [${res.status}]: ${body}`);
      const reason =
        res.status === 401 || res.status === 403
          ? "Backup destination rejected the saved key — check the secret key."
          : `Backup destination rejected the snapshot (${res.status}).`;
      await recordAttempt(false, counts, reason);
      return { ok: false, reason };
    }
  } catch (e) {
    // Network failure: destination unreachable (bad URL, deleted/paused project, timeout).
    console.error(`Backup fetch failed: ${e instanceof Error ? e.message : e}`);
    const reason = "Backup destination is not reachable — check the saved project address.";
    await recordAttempt(false, counts, reason);
    return { ok: false, reason };
  }

  const backedUpAt = new Date().toISOString();
  await recordAttempt(true, counts, null);
  return { ok: true, backedUpAt, counts };
}

/** Fire-and-forget backup after admin writes; never throws. */
export function scheduleBackup(): void {
  void runBackup().then((result) => {
    if (!result.ok) console.error(`Automatic backup skipped: ${result.reason}`);
  });
}
