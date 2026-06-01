import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BUCKET = "vault-memories";

function getPin(): string {
  return process.env.VAULT_PIN ?? "123456";
}

function checkToken(token: string) {
  // Simple shared-secret token derived from PIN — single-user.
  if (token !== `ok:${getPin()}`) {
    throw new Error("Unauthorized");
  }
}

export const verifyVaultPin = createServerFn({ method: "POST" })
  .inputValidator((d: { pin: string }) => z.object({ pin: z.string().min(4).max(12) }).parse(d))
  .handler(async ({ data }) => {
    if (data.pin !== getPin()) {
      return { ok: false as const };
    }
    return { ok: true as const, token: `ok:${getPin()}` };
  });

export const listMemories = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string }) => z.object({ token: z.string() }).parse(d))
  .handler(async ({ data }) => {
    checkToken(data.token);
    const { data: rows, error } = await supabaseAdmin
      .from("vault_memories")
      .select("*")
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const items = await Promise.all(
      (rows ?? []).map(async (r) => {
        const { data: signed } = await supabaseAdmin.storage
          .from(BUCKET)
          .createSignedUrl(r.image_path, 60 * 60);
        return {
          id: r.id as string,
          title: r.title as string,
          event_date: r.event_date as string | null,
          caption: r.caption as string | null,
          url: signed?.signedUrl ?? null,
        };
      }),
    );
    return { items };
  });

export const createMemory = createServerFn({ method: "POST" })
  .inputValidator((d: {
    token: string;
    title: string;
    event_date?: string | null;
    caption?: string | null;
    image_base64: string;
    content_type: string;
    filename: string;
  }) =>
    z
      .object({
        token: z.string(),
        title: z.string().min(1).max(200),
        event_date: z.string().nullable().optional(),
        caption: z.string().max(1000).nullable().optional(),
        image_base64: z.string().min(10),
        content_type: z.string().regex(/^image\//),
        filename: z.string().min(1).max(200),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    checkToken(data.token);
    const bin = Buffer.from(data.image_base64, "base64");
    const safeName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, bin, { contentType: data.content_type, upsert: false });
    if (upErr) throw new Error(upErr.message);

    const { error: dbErr } = await supabaseAdmin.from("vault_memories").insert({
      title: data.title,
      event_date: data.event_date || null,
      caption: data.caption || null,
      image_path: path,
    });
    if (dbErr) throw new Error(dbErr.message);
    return { ok: true as const };
  });

export const deleteMemory = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string; id: string }) =>
    z.object({ token: z.string(), id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    checkToken(data.token);
    const { data: row, error: fetchErr } = await supabaseAdmin
      .from("vault_memories")
      .select("image_path")
      .eq("id", data.id)
      .single();
    if (fetchErr) throw new Error(fetchErr.message);
    if (row?.image_path) {
      await supabaseAdmin.storage.from(BUCKET).remove([row.image_path]);
    }
    const { error } = await supabaseAdmin.from("vault_memories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
