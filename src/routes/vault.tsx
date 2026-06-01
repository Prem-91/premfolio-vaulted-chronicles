import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Upload, X, Trash2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import {
  verifyVaultPin,
  listMemories,
  createMemory,
  deleteMemory,
} from "@/lib/vault.functions";

const TOKEN_KEY = "vault_token_v1";

type Memory = {
  id: string;
  title: string;
  event_date: string | null;
  caption: string | null;
  url: string | null;
};

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "Vault" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: VaultPage,
});

function VaultPage() {
  const [token, setToken] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const t = typeof window !== "undefined" ? sessionStorage.getItem(TOKEN_KEY) : null;
    if (t) setToken(t);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await verifyVaultPin({ data: { pin } });
      if (res.ok) {
        sessionStorage.setItem(TOKEN_KEY, res.token);
        setToken(res.token);
        toast.success("Welcome back.");
      } else {
        toast.error("Incorrect PIN.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="grain relative min-h-screen overflow-hidden bg-background">
      <Toaster theme="dark" position="bottom-right" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display text-lg font-bold">
          PS<span className="text-cyan">.</span>
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-cyan">/ vault</span>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        {!token ? (
          <PinGate pin={pin} setPin={setPin} onSubmit={onSubmit} checking={checking} />
        ) : (
          <Gallery
            token={token}
            onLogout={() => {
              sessionStorage.removeItem(TOKEN_KEY);
              setToken(null);
              setPin("");
            }}
          />
        )}
      </main>
    </div>
  );
}

function PinGate({
  pin, setPin, onSubmit, checking,
}: { pin: string; setPin: (v: string) => void; onSubmit: (e: React.FormEvent) => void; checking: boolean }) {
  return (
    <div className="mx-auto mt-20 max-w-md text-center">
      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10">
        <Lock className="h-7 w-7 text-cyan" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-bold">Private moments</h1>
      <p className="mt-3 text-sm text-muted-foreground">Enter the PIN to continue.</p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 rounded-2xl border border-border glass p-6">
        <input
          autoFocus
          inputMode="numeric"
          maxLength={12}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="• • • • • •"
          className="w-full rounded-lg border border-border bg-background/40 px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] outline-none focus:border-cyan"
        />
        <button
          disabled={checking || pin.length < 4}
          type="submit"
          className="rounded-lg bg-cyan py-3 font-semibold text-primary-foreground transition hover:glow-cyan disabled:opacity-40"
        >
          {checking ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}

function Gallery({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [items, setItems] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [lightbox, setLightbox] = useState<Memory | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listMemories({ data: { token } });
      setItems(res.items as Memory[]);
    } catch {
      toast.error("Couldn't load memories.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { refresh(); }, [refresh]);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this memory?")) return;
    try {
      await deleteMemory({ data: { token, id } });
      setItems((xs) => xs.filter((x) => x.id !== id));
      toast.success("Deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Moments</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "memory" : "memories"} captured.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUpload((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-cyan px-4 py-2 text-sm font-semibold text-primary-foreground hover:glow-cyan"
          >
            <Upload className="h-4 w-4" /> Add memory
          </button>
          <button
            onClick={onLogout}
            className="rounded-full border border-border bg-white/5 px-4 py-2 text-sm hover:border-cyan/40 hover:text-cyan"
          >
            Lock
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <UploadForm
              token={token}
              uploading={uploading}
              setUploading={setUploading}
              onUploaded={() => { setShowUpload(false); refresh(); }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10">
        {loading ? (
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">loading…</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">no memories yet</p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {items.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative break-inside-avoid overflow-hidden rounded-xl border border-border glass"
              >
                {m.url && (
                  <button onClick={() => setLightbox(m)} className="block w-full">
                    <img src={m.url} alt={m.title} className="w-full" loading="lazy" />
                  </button>
                )}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-base font-semibold">{m.title}</h3>
                      {m.event_date && (
                        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">{m.event_date}</p>
                      )}
                      {m.caption && <p className="mt-1 text-xs text-muted-foreground">{m.caption}</p>}
                    </div>
                    <button
                      onClick={() => onDelete(m.id)}
                      className="rounded-md p-1 text-muted-foreground opacity-0 transition hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {lightbox.url && (
              <img src={lightbox.url} alt={lightbox.title} className="max-h-[90vh] max-w-full rounded-lg" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UploadForm({
  token, uploading, setUploading, onUploaded,
}: { token: string; uploading: boolean; setUploading: (b: boolean) => void; onUploaded: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [caption, setCaption] = useState("");

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      toast.error("Add a title and image.");
      return;
    }
    setUploading(true);
    try {
      const buf = await file.arrayBuffer();
      let binary = "";
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
      const b64 = btoa(binary);
      await createMemory({
        data: {
          token,
          title: title.trim(),
          event_date: date || null,
          caption: caption.trim() || null,
          image_base64: b64,
          content_type: file.type || "image/jpeg",
          filename: file.name,
        },
      });
      toast.success("Memory saved.");
      setFile(null); setPreview(null); setTitle(""); setDate(""); setCaption("");
      onUploaded();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 rounded-2xl border border-border glass p-6">
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

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Title *</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className="mt-1 w-full rounded-lg border border-border bg-background/40 px-3 py-2 outline-none focus:border-cyan" />
        </label>
        <label>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background/40 px-3 py-2 outline-none focus:border-cyan" />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Caption</span>
        <textarea value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={1000} rows={2} className="mt-1 w-full rounded-lg border border-border bg-background/40 px-3 py-2 outline-none focus:border-cyan" />
      </label>
      <button
        disabled={uploading}
        type="submit"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:glow-cyan disabled:opacity-50"
      >
        {uploading ? "Uploading…" : "Save memory"}
      </button>
    </form>
  );
}
