import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send } from "lucide-react";
import { toast } from "sonner";
import type { About } from "@/lib/content.functions";
import { PROFILE } from "@/lib/profile";
import { Section } from "@/components/Section";

export function Contact({ about }: { about: About | null }) {
  const [sending, setSending] = useState(false);
  const email = about?.email ?? PROFILE.email;
  const github = about?.github_url ?? PROFILE.github;
  const linkedin = about?.linkedin_url ?? PROFILE.linkedin;
  const name = about?.name ?? PROFILE.name;
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const from = String(data.get("name") ?? "").trim();
    const fromEmail = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!from || !fromEmail || !message) { toast.error("Please fill out every field."); return; }
    setSending(true);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Portfolio message from ${from}`)}&body=${encodeURIComponent(`From: ${from} <${fromEmail}>\n\n${message}`)}`;
    setTimeout(() => { setSending(false); toast.success("Opening your email app…"); form.reset(); }, 600);
  };
  return (
    <Section id="contact" index="11" label="contact" title="Let’s build something." intro={`Have a project, question or thoughtful hello? Write to ${name}.`}>
      <div className="grid gap-px border border-border bg-border lg:grid-cols-[0.8fr_1.2fr]">
        <div className="bg-background p-6 sm:p-10">
          <div className="label text-cyan">open channel</div>
          <div className="mt-8 space-y-4 font-mono text-xs uppercase tracking-[0.18em]">
            <a href={`mailto:${email}`} className="flex items-center gap-3 transition hover:text-cyan"><Mail className="h-4 w-4 text-cyan" /> {email}</a>
            <a href={linkedin} target="_blank" rel="noreferrer noopener" className="flex items-center gap-3 transition hover:text-cyan"><Linkedin className="h-4 w-4 text-cyan" /> LinkedIn ↗</a>
            <a href={github} target="_blank" rel="noreferrer noopener" className="flex items-center gap-3 transition hover:text-cyan"><Github className="h-4 w-4 text-cyan" /> GitHub ↗</a>
          </div>
          <p className="mt-16 max-w-xs text-sm leading-relaxed text-muted-foreground">No contact number — email and professional links are the best way to reach me.</p>
        </div>
        <motion.form onSubmit={onSubmit} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.55 }} className="bg-background p-6 sm:p-10">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block"><span className="label">Your name</span><input name="name" required maxLength={100} className="mt-3 w-full border-b border-border bg-transparent px-0 py-3 text-sm outline-none transition focus:border-cyan" /></label>
            <label className="block"><span className="label">Email address</span><input name="email" type="email" required maxLength={160} className="mt-3 w-full border-b border-border bg-transparent px-0 py-3 text-sm outline-none transition focus:border-cyan" /></label>
          </div>
          <label className="mt-8 block"><span className="label">Message</span><textarea name="message" required maxLength={2000} rows={5} className="mt-3 w-full resize-y border-b border-border bg-transparent px-0 py-3 text-sm outline-none transition focus:border-cyan" /></label>
          <button type="submit" disabled={sending} className="mt-8 inline-flex items-center gap-2 bg-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-background transition hover:bg-cyan disabled:opacity-40"><Send className="h-3.5 w-3.5" /> {sending ? "opening…" : "send message"}</button>
        </motion.form>
      </div>
      <footer className="flex flex-wrap justify-between gap-3 border-t border-border pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"><span>© {new Date().getFullYear()} Prem Shinde</span><span>designed & built from scratch · &lt;/&gt; with care</span></footer>
    </Section>
  );
}
