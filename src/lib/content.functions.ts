import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { enforceRateLimit } from "@/lib/rate-limit.server";

const BUCKET = "moments";

// ---------- TYPES ----------
export type About = {
  id: string;
  name: string;
  initials: string;
  tagline: string;
  long_bio: string;
  location: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  resume_url: string;
  current_focus: string | null;
};
export type Project = {
  id: string;
  name: string;
  description: string;
  stack: string[];
  categories: string[];
  github_url: string | null;
  live_url: string | null;
  year: string | null;
  featured: boolean;
  sort_order: number;
};
export type Experience = {
  id: string;
  title: string;
  org: string;
  period: string;
  detail: string;
  kind: "edu" | "exp";
  sort_order: number;
};
export type SkillsGroup = { id: string; name: string; items: string[]; sort_order: number };
export type Moment = {
  id: string;
  title: string;
  event_date: string | null;
  caption: string | null;
  image_path: string;
  url: string | null;
  sort_order: number;
};

// ---------- PUBLIC FETCH ----------
export const getPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [aboutQ, projectsQ, expQ, skillsQ, momentsQ] = await Promise.all([
    supabaseAdmin.from("about_profile").select("*").limit(1).maybeSingle(),
    supabaseAdmin.from("projects").select("*").order("sort_order", { ascending: true }),
    supabaseAdmin.from("experiences").select("*").order("sort_order", { ascending: true }),
    supabaseAdmin.from("skills_groups").select("*").order("sort_order", { ascending: true }),
    supabaseAdmin
      .from("moments")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  const moments: Moment[] = await Promise.all(
    (momentsQ.data ?? []).map(async (m: any) => {
      const { data: signed } = await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUrl(m.image_path, 60 * 60 * 6);
      return { ...m, url: signed?.signedUrl ?? null } as Moment;
    }),
  );

  return {
    about: (aboutQ.data ?? null) as About | null,
    projects: (projectsQ.data ?? []) as Project[],
    experiences: (expQ.data ?? []) as Experience[],
    skills: (skillsQ.data ?? []) as SkillsGroup[],
    moments,
  };
});

// ---------- ADMIN HELPER ----------
async function assertAdmin(supabase: any) {
  enforceRateLimit("admin");
  const { data, error } = await supabase.rpc("is_admin");
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

// ---------- ABOUT ----------
export const updateAbout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: Partial<About> & { id: string }) =>
    z
      .object({
        id: z.string().uuid(),
        name: z.string().min(1).max(120).optional(),
        initials: z.string().min(1).max(8).optional(),
        tagline: z.string().min(1).max(280).optional(),
        long_bio: z.string().min(1).max(2000).optional(),
        location: z.string().min(1).max(200).optional(),
        email: z.string().email().optional(),
        github_url: z.string().url().optional(),
        linkedin_url: z.string().url().optional(),
        resume_url: z.string().min(1).max(500).optional(),
        current_focus: z.string().max(200).nullable().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    await assertAdmin(supabase);
    const { id, ...patch } = data;
    const { error } = await supabase.from("about_profile").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------- PROJECTS ----------
const projectInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(1500),
  stack: z.array(z.string().min(1).max(40)).max(20),
  categories: z.array(z.string().min(1).max(40)).max(8),
  github_url: z.string().url().nullable().optional(),
  live_url: z.string().url().nullable().optional(),
  year: z.string().max(20).nullable().optional(),
  featured: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

export const upsertProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof projectInput>) => projectInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    await assertAdmin(supabase);
    const payload = {
      ...data,
      github_url: data.github_url || null,
      live_url: data.live_url || null,
      year: data.year || null,
      featured: data.featured ?? false,
      sort_order: data.sort_order ?? 999,
    };
    const { error } = data.id
      ? await supabase.from("projects").update(payload).eq("id", data.id)
      : await supabase.from("projects").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const { error } = await context.supabase.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------- EXPERIENCES ----------
const expInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(160),
  org: z.string().min(1).max(160),
  period: z.string().min(1).max(80),
  detail: z.string().min(1).max(1000),
  kind: z.enum(["edu", "exp"]),
  sort_order: z.number().int().optional(),
});

export const upsertExperience = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof expInput>) => expInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const payload = { ...data, sort_order: data.sort_order ?? 999 };
    const { error } = data.id
      ? await context.supabase.from("experiences").update(payload).eq("id", data.id)
      : await context.supabase.from("experiences").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteExperience = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const { error } = await context.supabase.from("experiences").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------- SKILLS ----------
const skillInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(60),
  items: z.array(z.string().min(1).max(40)).max(40),
  sort_order: z.number().int().optional(),
});

export const upsertSkillGroup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof skillInput>) => skillInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const payload = { ...data, sort_order: data.sort_order ?? 999 };
    const { error } = data.id
      ? await context.supabase.from("skills_groups").update(payload).eq("id", data.id)
      : await context.supabase.from("skills_groups").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteSkillGroup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const { error } = await context.supabase.from("skills_groups").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------- MOMENTS ----------
const momentInput = z.object({
  title: z.string().min(1).max(200),
  event_date: z.string().nullable().optional(),
  caption: z.string().max(500).nullable().optional(),
  image_base64: z.string().min(10),
  content_type: z.string().regex(/^image\//),
  filename: z.string().min(1).max(200),
  sort_order: z.number().int().optional(),
});

export const createMoment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof momentInput>) => momentInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const bin = Buffer.from(data.image_base64, "base64");
    const safe = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, bin, { contentType: data.content_type, upsert: false });
    if (upErr) throw new Error(upErr.message);
    const { error } = await supabaseAdmin.from("moments").insert({
      title: data.title,
      event_date: data.event_date || null,
      caption: data.caption || null,
      image_path: path,
      sort_order: data.sort_order ?? 999,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteMoment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("moments")
      .select("image_path")
      .eq("id", data.id)
      .single();
    if (row?.image_path) await supabaseAdmin.storage.from(BUCKET).remove([row.image_path]);
    const { error } = await supabaseAdmin.from("moments").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = (context.claims?.email as string | undefined)?.toLowerCase();
    if (!email) return { isAdmin: false };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("admin_emails")
      .select("email")
      .ilike("email", email)
      .maybeSingle();
    if (error) return { isAdmin: false };
    return { isAdmin: !!data };
  });
