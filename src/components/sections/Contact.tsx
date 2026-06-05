import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import type { About } from "@/lib/content.functions";
import { PROFILE } from "@/lib/profile";

export function Contact({ about }: { about: About | null }) {
  const [sending, setSending] = useState(false);
  const email = about?.email ?? PROFILE.email;
  const github = about?.github_url ?? PROFILE.github;
  const linkedin = about?.linkedin_url ?? PROFILE.linkedin;
  const location = about?.location ?? PROFILE.location;
  const name = about?.name ?? PROFILE.name;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const from = String(data.get("name") ?? "").trim();
    const fromEmail = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!from || !fromEmail || !message) {
      toast.error("Please fill out every field.");
      return;
    }
    setSending(true);
    const body = encodeURIComponent(`From: ${from} <${fromEmail}>\n\n${message}`);
    const subject = encodeURIComponent(`Portfolio message from ${from}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      toast.success("Opening your email app…");
      form.reset();
    }, 600);
  };

  return (
    <section id="contact" className="relative w-full py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">/ contact</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Let&apos;s build <span className="text-cyan">something.</span>
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground">
            Open to freelance projects, internships, and collaboration on ambitious products. Drop a
            line — I read everything.
          </p>

          <div className="mt-10 space-y-3 font-mono text-sm">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-foreground transition hover:text-cyan"
            >
              <Mail className="h-4 w-4 text-cyan" /> {email}
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-foreground transition hover:text-cyan"
            >
              <Linkedin className="h-4 w-4 text-cyan" /> linkedin.com/in/
              {linkedin.split("/in/")[1]?.replace(/\/$/, "")}
            </a>
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-foreground transition hover:text-cyan"
            >
              <Github className="h-4 w-4 text-cyan" /> github.com/
              {github.split("github.com/")[1]?.replace(/\/$/, "")}
            </a>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-4 w-4 text-cyan" /> {location} 🇮🇳
            </div>
            <div className="flex items-center gap-4 pt-4">
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border bg-white/5 p-3 transition hover:border-cyan/50 hover:text-cyan"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border bg-white/5 p-3 transition hover:border-cyan/50 hover:text-cyan"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${email}`}
                className="rounded-full border border-border bg-white/5 p-3 transition hover:border-cyan/50 hover:text-cyan"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-border glass p-6 sm:p-8"
        >
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Name
            </span>
            <input
              name="name"
              required
              maxLength={100}
              className="mt-2 w-full rounded-lg border border-border bg-background/40 px-4 py-3 text-foreground outline-none transition focus:border-cyan"
            />
          </label>
          <label className="mt-5 block">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              maxLength={200}
              className="mt-2 w-full rounded-lg border border-border bg-background/40 px-4 py-3 text-foreground outline-none transition focus:border-cyan"
            />
          </label>
          <label className="mt-5 block">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Message
            </span>
            <textarea
              name="message"
              required
              maxLength={2000}
              rows={5}
              className="mt-2 w-full rounded-lg border border-border bg-background/40 px-4 py-3 text-foreground outline-none transition focus:border-cyan"
            />
          </label>
          <button
            disabled={sending}
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-cyan disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send message"} <Send className="h-4 w-4" />
          </button>
        </motion.form>
      </div>

      <footer className="mt-24 border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <span className="font-mono">© {name}</span>
          <span className="font-mono">designed &amp; built from scratch · &lt;/&gt; with care</span>
        </div>
      </footer>
    </section>
  );
}
