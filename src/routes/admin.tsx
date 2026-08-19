import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import {
  LogOut,
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  Upload,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  Camera,
  Trophy,
  Lock,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  getPortfolio,
  updateAbout,
  upsertProject,
  deleteProject,
  upsertExperience,
  deleteExperience,
  upsertSkillGroup,
  deleteSkillGroup,
  createMoment,
  deleteMoment,
  upsertAchievement,
  deleteAchievement,
  type Achievement,
  checkIsAdmin,
  type About,
  type Project,
  type Experience,
  type SkillsGroup,
  type Moment,
  uploadResume,
} from "@/lib/content.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Prem Shinde" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Session = { user: { id: string; email?: string } } | null;

function AdminPage() {
  const [session, setSession] = useState<Session>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ? { user: { id: data.session.user.id, email: data.session.user.email } } : null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ? { user: { id: s.user.id, email: s.user.email } } : null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    checkIsAdmin()
      .then((r) => setIsAdmin(r.isAdmin))
      .catch(() => setIsAdmin(false));
  }, [session]);

  return (
    <div className="grain relative min-h-screen overflow-hidden bg-background">
      <Toaster theme="dark" position="bottom-right" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display text-lg font-bold">
          PS<span className="text-cyan">.</span>
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-cyan">/ admin</span>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        {loading ? (
          <p className="mt-20 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            loading…
          </p>
        ) : !session ? (
          <AuthGate />
        ) : isAdmin === null ? (
          <p className="mt-20 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            checking access…
          </p>
        ) : !isAdmin ? (
          <NotAuthorized email={session.user.email} />
        ) : (
          <Dashboard email={session.user.email} />
        )}
      </main>
    </div>
  );
}

function AuthGate() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. Signing in…");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Auth failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md">
      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10">
        <Lock className="h-7 w-7 text-cyan" />
      </div>
      <h1 className="mt-6 text-center font-display text-4xl font-bold">Admin access</h1>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Only your email is allowed in. Sign up once, then sign in next time.
      </p>
      <form onSubmit={submit} className="mt-8 space-y-3 rounded-2xl border border-border glass p-6">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background/40 px-3 py-2 outline-none focus:border-cyan"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Password
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background/40 px-3 py-2 outline-none focus:border-cyan"
          />
        </label>
        <button
          disabled={busy}
          type="submit"
          className="w-full rounded-lg bg-cyan py-3 font-semibold text-primary-foreground transition hover:glow-cyan disabled:opacity-40"
        >
          {busy ? "…" : mode === "in" ? "Sign in" : "Sign up"}
        </button>
        <button
          type="button"
          onClick={() => setMode((m) => (m === "in" ? "up" : "in"))}
          className="block w-full text-center font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-cyan"
        >
          {mode === "in" ? "First time? Sign up" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}

function NotAuthorized({ email }: { email?: string }) {
  return (
    <div className="mx-auto mt-20 max-w-md text-center">
      <h1 className="font-display text-3xl font-bold">Not authorized</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {email ? `${email} is not on the admin allowlist.` : "Your account isn't an admin."}
      </p>
      <button
        onClick={() => supabase.auth.signOut()}
        className="mt-6 rounded-full border border-border bg-white/5 px-4 py-2 text-sm hover:border-cyan/40 hover:text-cyan"
      >
        Sign out
      </button>
    </div>
  );
}

// ---------------- DASHBOARD ----------------

type Tab = "about" | "projects" | "experiences" | "achievements" | "skills" | "moments";

function Dashboard({ email }: { email?: string }) {
  const [tab, setTab] = useState<Tab>("about");
  const [data, setData] = useState<Awaited<ReturnType<typeof getPortfolio>> | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const d = await getPortfolio();
      setData(d);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: "about", label: "About", icon: User },
    { id: "projects", label: "Work", icon: Briefcase, count: data?.projects.length },
    { id: "experiences", label: "Journey", icon: GraduationCap, count: data?.experiences.length },
    {
      id: "achievements",
      label: "Achievements",
      icon: Trophy,
      count: data?.achievements.length,
    },
    { id: "skills", label: "Stack", icon: Code2, count: data?.skills.length },
    { id: "moments", label: "Moments", icon: Camera, count: data?.moments.length },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Dashboard</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            signed in as {email}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-2 text-sm hover:border-cyan/40 hover:text-cyan"
          >
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-2 text-sm hover:border-cyan/40 hover:text-cyan"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
              tab === t.id
                ? "border-cyan bg-cyan/15 text-cyan"
                : "border-border bg-white/5 text-muted-foreground hover:border-cyan/40 hover:text-foreground"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
            {typeof t.count === "number" && (
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {loading || !data ? (
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            loading…
          </p>
        ) : tab === "about" ? (
          <AboutEditor about={data.about} onSaved={refresh} />
        ) : tab === "projects" ? (
          <ProjectsEditor items={data.projects} onChanged={refresh} />
        ) : tab === "experiences" ? (
          <ExperienceEditor items={data.experiences} onChanged={refresh} />
        ) : tab === "achievements" ? (
          <AchievementsEditor items={data.achievements} onChanged={refresh} />
        ) : tab === "skills" ? (
          <SkillsEditor items={data.skills} onChanged={refresh} />
        ) : (
          <MomentsEditor items={data.moments} onChanged={refresh} />
        )}
      </div>
    </div>
  );
}

// ---------------- shared form pieces ----------------

const inputCls =
  "mt-1 w-full rounded-lg border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-cyan";
const labelCls = "font-mono text-[11px] uppercase tracking-widest text-muted-foreground";
const cardCls = "rounded-2xl border border-border glass p-5";
const btnPrimary =
  "inline-flex items-center gap-2 rounded-full bg-cyan px-4 py-2 text-sm font-semibold text-primary-foreground hover:glow-cyan disabled:opacity-40";
const btnGhost =
  "inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-2 text-sm hover:border-cyan/40 hover:text-cyan";

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className={btnPrimary}>
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

// ---------------- ABOUT ----------------

function AboutEditor({ about, onSaved }: { about: About | null; onSaved: () => void }) {
  const [form, setForm] = useState<About | null>(about);
  const [busy, setBusy] = useState(false);
  if (!form) return <p>No profile row found.</p>;

  const save = async () => {
    setBusy(true);
    try {
      await updateAbout({ data: form });
      toast.success("Profile updated.");
      onSaved();
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const F = (k: keyof About, label: string, type: "text" | "textarea" = "text") => (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {type === "textarea" ? (
        <textarea
          rows={4}
          value={(form[k] as string) ?? ""}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          className={inputCls}
        />
      ) : (
        <input
          value={(form[k] as string) ?? ""}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          className={inputCls}
        />
      )}
    </label>
  );

  return (
    <div className={cardCls}>
      <div className="grid gap-4 sm:grid-cols-2">
        {F("name", "Name")}
        {F("initials", "Initials")}
        {F("tagline", "Tagline")}
        {F("location", "Location")}
        {F("email", "Email")}
        {F("current_focus", "Current focus")}
        {F("github_url", "GitHub URL")}
        {F("linkedin_url", "LinkedIn URL")}
        {F("resume_url", "Resume URL / storage ref")}
      </div>
      <ResumeUpload aboutId={form.id} onDone={onSaved} />
      <div className="mt-4">{F("long_bio", "Long bio", "textarea")}</div>
      <div className="mt-5 flex justify-end">
        <button onClick={save} disabled={busy} className={btnPrimary}>
          <Save className="h-4 w-4" /> {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function ResumeUpload({ aboutId, onDone }: { aboutId: string; onDone: () => void }) {
  const [busy, setBusy] = useState(false);

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      if (file.size > 8 * 1024 * 1024) {
        toast.error("File too large (max 8MB).");
        return;
      }
      setBusy(true);
      try {
        const buf = await file.arrayBuffer();
        let binary = "";
        const bytes = new Uint8Array(buf);
        for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
        await uploadResume({
          data: {
            id: aboutId,
            file_base64: btoa(binary),
            content_type: file.type || "application/pdf",
            filename: file.name,
          },
        });
        toast.success("Resume updated.");
        onDone();
      } catch (e: any) {
        toast.error(e?.message ?? "Upload failed");
      } finally {
        setBusy(false);
      }
    },
    [aboutId, onDone],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition ${
        isDragActive ? "border-cyan bg-cyan/5" : "border-border bg-white/5 hover:border-cyan/50"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="h-5 w-5 text-cyan" />
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {busy ? "uploading…" : "drop new resume (pdf) or click to replace"}
      </p>
    </div>
  );
}



// ---------------- PROJECTS ----------------

const emptyProject: Omit<Project, "id"> & { id?: string } = {
  name: "",
  description: "",
  stack: [],
  categories: [],
  github_url: null,
  live_url: null,
  year: "",
  featured: false,
  sort_order: 999,
  problem: null,
  solution: null,
  features: [],
  challenges: null,
  learning: null,
  status: "shipped",
};

function ProjectsEditor({ items, onChanged }: { items: Project[]; onChanged: () => void }) {
  const [editing, setEditing] = useState<(Omit<Project, "id"> & { id?: string }) | null>(null);

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject({ data: { id } });
      toast.success("Deleted.");
      onChanged();
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed");
    }
  };

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <AddButton onClick={() => setEditing({ ...emptyProject })} label="Add project" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((p) => (
          <div key={p.id} className={cardCls}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                  {p.year} {p.featured && "· featured"}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditing(p)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-white/10 hover:text-cyan"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.stack.slice(0, 6).map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-border bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <ProjectForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              onChanged();
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function ProjectForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial: Omit<Project, "id"> & { id?: string };
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [stackText, setStackText] = useState(initial.stack.join(", "));
  const [catsText, setCatsText] = useState(initial.categories.join(", "));
  const [featuresText, setFeaturesText] = useState((initial.features ?? []).join("\n"));
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await upsertProject({
        data: {
          ...form,
          stack: stackText.split(",").map((s) => s.trim()).filter(Boolean),
          categories: catsText.split(",").map((s) => s.trim()).filter(Boolean),
          features: featuresText
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          status: (form.status === "building" || form.status === "concept"
            ? form.status
            : "shipped") as "shipped" | "building" | "concept",
        },
      });
      toast.success("Saved.");
      onSaved();
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold">
        {form.id ? "Edit project" : "Add project"}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Year</span>
          <input value={form.year ?? ""} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputCls} />
        </label>
      </div>
      <label className="block">
        <span className={labelCls}>Description</span>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputCls}
        />
      </label>
      <label className="block">
        <span className={labelCls}>Tech stack (comma-separated)</span>
        <input value={stackText} onChange={(e) => setStackText(e.target.value)} className={inputCls} />
      </label>
      <label className="block">
        <span className={labelCls}>Categories (Full-Stack, AI, Backend, Open Source)</span>
        <input value={catsText} onChange={(e) => setCatsText(e.target.value)} className={inputCls} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>GitHub URL</span>
          <input
            value={form.github_url ?? ""}
            onChange={(e) => setForm({ ...form, github_url: e.target.value || null })}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className={labelCls}>Live URL</span>
          <input
            value={form.live_url ?? ""}
            onChange={(e) => setForm({ ...form, live_url: e.target.value || null })}
            className={inputCls}
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Problem</span>
          <textarea
            rows={3}
            value={form.problem ?? ""}
            onChange={(e) => setForm({ ...form, problem: e.target.value || null })}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className={labelCls}>Solution</span>
          <textarea
            rows={3}
            value={form.solution ?? ""}
            onChange={(e) => setForm({ ...form, solution: e.target.value || null })}
            className={inputCls}
          />
        </label>
      </div>
      <label className="block">
        <span className={labelCls}>Key features (one per line)</span>
        <textarea
          rows={4}
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          className={inputCls}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Challenges</span>
          <textarea
            rows={3}
            value={form.challenges ?? ""}
            onChange={(e) => setForm({ ...form, challenges: e.target.value || null })}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className={labelCls}>What I learned</span>
          <textarea
            rows={3}
            value={form.learning ?? ""}
            onChange={(e) => setForm({ ...form, learning: e.target.value || null })}
            className={inputCls}
          />
        </label>
      </div>
      <label className="block sm:w-56">
        <span className={labelCls}>Status</span>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className={inputCls}
        >
          <option value="shipped">shipped</option>
          <option value="building">currently building</option>
          <option value="concept">concept</option>
        </select>
      </label>
      <div className="flex items-center gap-4">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <span className={labelCls}>Order</span>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            className="w-20 rounded-lg border border-border bg-background/40 px-2 py-1 text-sm outline-none focus:border-cyan"
          />
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className={btnGhost}>Cancel</button>
        <button onClick={save} disabled={busy} className={btnPrimary}>
          <Save className="h-4 w-4" /> {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ---------------- EXPERIENCES ----------------

const emptyExp: Omit<Experience, "id"> & { id?: string } = {
  title: "",
  org: "",
  period: "",
  detail: "",
  kind: "exp",
  sort_order: 999,
};

function ExperienceEditor({ items, onChanged }: { items: Experience[]; onChanged: () => void }) {
  const [editing, setEditing] = useState<(Omit<Experience, "id"> & { id?: string }) | null>(null);

  const remove = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await deleteExperience({ data: { id } });
      toast.success("Deleted.");
      onChanged();
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed");
    }
  };

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <AddButton onClick={() => setEditing({ ...emptyExp })} label="Add entry" />
      </div>
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className={cardCls}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                  {it.period} · {it.kind === "edu" ? "Education" : "Experience"}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold">{it.title}</h3>
                <p className="text-sm text-muted-foreground">{it.org}</p>
                <p className="mt-2 text-sm text-foreground/80">{it.detail}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditing(it)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-white/10 hover:text-cyan"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(it.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <ExperienceForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              onChanged();
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function ExperienceForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial: Omit<Experience, "id"> & { id?: string };
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await upsertExperience({ data: form });
      toast.success("Saved.");
      onSaved();
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold">
        {form.id ? "Edit entry" : "Add entry"}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Title</span>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Organization</span>
          <input value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Period (e.g. "2024 — Present")</span>
          <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Kind</span>
          <select
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value as "edu" | "exp" })}
            className={inputCls}
          >
            <option value="exp">Experience</option>
            <option value="edu">Education</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className={labelCls}>Details</span>
        <textarea
          rows={4}
          value={form.detail}
          onChange={(e) => setForm({ ...form, detail: e.target.value })}
          className={inputCls}
        />
      </label>
      <label className="inline-flex items-center gap-2 text-sm">
        <span className={labelCls}>Order</span>
        <input
          type="number"
          value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          className="w-20 rounded-lg border border-border bg-background/40 px-2 py-1 text-sm outline-none focus:border-cyan"
        />
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className={btnGhost}>Cancel</button>
        <button onClick={save} disabled={busy} className={btnPrimary}>
          <Save className="h-4 w-4" /> {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ---------------- SKILLS ----------------

function SkillsEditor({ items, onChanged }: { items: SkillsGroup[]; onChanged: () => void }) {
  const [editing, setEditing] = useState<
    (Omit<SkillsGroup, "id"> & { id?: string }) | null
  >(null);

  const remove = async (id: string) => {
    if (!confirm("Delete this group?")) return;
    try {
      await deleteSkillGroup({ data: { id } });
      toast.success("Deleted.");
      onChanged();
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed");
    }
  };

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <AddButton
          onClick={() => setEditing({ name: "", items: [], sort_order: 999 })}
          label="Add group"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g) => (
          <div key={g.id} className={cardCls}>
            <div className="flex items-start justify-between gap-3">
              <div className="font-mono text-xs uppercase tracking-widest text-cyan">{g.name}</div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditing(g)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-white/10 hover:text-cyan"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(g.id)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-border bg-white/5 px-2 py-0.5 text-xs text-foreground/85"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <SkillForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              onChanged();
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function SkillForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial: Omit<SkillsGroup, "id"> & { id?: string };
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [itemsText, setItemsText] = useState(initial.items.join(", "));
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await upsertSkillGroup({
        data: {
          ...form,
          items: itemsText.split(",").map((s) => s.trim()).filter(Boolean),
        },
      });
      toast.success("Saved.");
      onSaved();
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold">
        {form.id ? "Edit group" : "Add group"}
      </h2>
      <label className="block">
        <span className={labelCls}>Group name</span>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
      </label>
      <label className="block">
        <span className={labelCls}>Items (comma-separated)</span>
        <textarea
          rows={3}
          value={itemsText}
          onChange={(e) => setItemsText(e.target.value)}
          className={inputCls}
        />
      </label>
      <label className="inline-flex items-center gap-2 text-sm">
        <span className={labelCls}>Order</span>
        <input
          type="number"
          value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          className="w-20 rounded-lg border border-border bg-background/40 px-2 py-1 text-sm outline-none focus:border-cyan"
        />
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className={btnGhost}>Cancel</button>
        <button onClick={save} disabled={busy} className={btnPrimary}>
          <Save className="h-4 w-4" /> {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ---------------- ACHIEVEMENTS ----------------

const emptyAchievement: Omit<Achievement, "id"> & { id?: string } = {
  title: "",
  org: "",
  period: "",
  detail: "",
  sort_order: 999,
};

function AchievementsEditor({
  items,
  onChanged,
}: {
  items: Achievement[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<(Omit<Achievement, "id"> & { id?: string }) | null>(null);

  const remove = async (id: string) => {
    if (!confirm("Delete this achievement?")) return;
    try {
      await deleteAchievement({ data: { id } });
      toast.success("Deleted.");
      onChanged();
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed");
    }
  };

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <AddButton onClick={() => setEditing({ ...emptyAchievement })} label="Add achievement" />
      </div>
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className={cardCls}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                  {it.period ?? "—"}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold">{it.title}</h3>
                <p className="text-sm text-muted-foreground">{it.org}</p>
                {it.detail && <p className="mt-2 text-sm text-foreground/80">{it.detail}</p>}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditing(it)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-white/10 hover:text-cyan"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(it.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <AchievementForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              onChanged();
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function AchievementForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial: Omit<Achievement, "id"> & { id?: string };
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await upsertAchievement({ data: form });
      toast.success("Saved.");
      onSaved();
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold">
        {form.id ? "Edit achievement" : "Add achievement"}
      </h2>
      <label className="block">
        <span className={labelCls}>Title</span>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputCls}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Organisation</span>
          <input
            value={form.org ?? ""}
            onChange={(e) => setForm({ ...form, org: e.target.value || null })}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className={labelCls}>Period</span>
          <input
            value={form.period ?? ""}
            onChange={(e) => setForm({ ...form, period: e.target.value || null })}
            className={inputCls}
          />
        </label>
      </div>
      <label className="block">
        <span className={labelCls}>Detail</span>
        <textarea
          rows={3}
          value={form.detail ?? ""}
          onChange={(e) => setForm({ ...form, detail: e.target.value || null })}
          className={inputCls}
        />
      </label>
      <label className="inline-flex items-center gap-2 text-sm">
        <span className={labelCls}>Order</span>
        <input
          type="number"
          value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          className="w-20 rounded-lg border border-border bg-background/40 px-2 py-1 text-sm outline-none focus:border-cyan"
        />
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className={btnGhost}>
          Cancel
        </button>
        <button onClick={save} disabled={busy} className={btnPrimary}>
          <Save className="h-4 w-4" /> {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ---------------- MOMENTS ----------------

function MomentsEditor({ items, onChanged }: { items: Moment[]; onChanged: () => void }) {
  const [open, setOpen] = useState(false);

  const remove = async (id: string) => {
    if (!confirm("Delete this moment?")) return;
    try {
      await deleteMoment({ data: { id } });
      toast.success("Deleted.");
      onChanged();
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed");
    }
  };

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <AddButton onClick={() => setOpen(true)} label="Add moment" />
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <Camera className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            no moments yet — click "Add moment" to upload one
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((m) => (
            <div key={m.id} className="group relative overflow-hidden rounded-xl border border-border glass">
              {m.url && <img src={m.url} alt={m.title} className="aspect-square w-full object-cover" loading="lazy" />}
              <div className="p-3">
                <h3 className="truncate font-display text-sm font-semibold">{m.title}</h3>
                {m.event_date && (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">{m.event_date}</p>
                )}
                {m.caption && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.caption}</p>}
              </div>
              <button
                onClick={() => remove(m.id)}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <MomentForm
          onCancel={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            onChanged();
          }}
        />
      </Modal>
    </div>
  );
}

function MomentForm({ onCancel, onSaved }: { onCancel: () => void; onSaved: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);

  const onDrop = useCallback((acc: File[]) => {
    const f = acc[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  });

  const save = async () => {
    if (!file || !title.trim()) {
      toast.error("Add a title and image.");
      return;
    }
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      let bin = "";
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
      await createMoment({
        data: {
          title: title.trim(),
          event_date: date || null,
          caption: caption.trim() || null,
          image_base64: btoa(bin),
          content_type: file.type || "image/jpeg",
          filename: file.name,
          category: category.trim() || null,
          location: location.trim() || null,
        },
      });
      toast.success("Saved.");
      onSaved();
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold">Add moment</h2>
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
          isDragActive ? "border-cyan bg-cyan/10" : "border-border bg-white/5 hover:border-cyan/40"
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="preview" className="max-h-48 rounded-lg" />
        ) : (
          <>
            <Upload className="h-7 w-7 text-cyan" />
            <p className="mt-3 text-sm">Drop an image, or click to pick.</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">max 10 MB</p>
          </>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Title *</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        </label>
      </div>
      <label className="block">
        <span className={labelCls}>Caption</span>
        <textarea
          rows={2}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={500}
          className={inputCls}
        />
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className={btnGhost}>Cancel</button>
        <button onClick={save} disabled={busy} className={btnPrimary}>
          <Save className="h-4 w-4" /> {busy ? "Uploading…" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ---------------- Modal ----------------

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur sm:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-2xl border border-border bg-background/95 p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:bg-white/10 hover:text-cyan"
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
