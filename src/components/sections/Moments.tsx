import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import type { Moment } from "@/lib/content.functions";
import { Section, Reveal } from "@/components/Section";

const PAGE_SIZE = 12;

export function Moments({ items }: { items: Moment[] }) {
  const [lightbox, setLightbox] = useState<Moment | null>(null);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  if (!items.length) return null;

  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const shown = items.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);
  const go = (step: number) => {
    setDir(step);
    setPage((prev) => (prev + step + pages) % pages);
  };

  return (
    <Section id="moments" index="07" label="beyond the code" title="Events & memories" intro="Snapshots from the rooms, communities and conversations that happen away from the keyboard." wide aside={<span className="label inline-flex items-center gap-2"><Camera className="h-3 w-3 text-cyan" /> {items.length} captured</span>}>
      <div className="moments-scroll max-h-[62vh] overflow-y-auto overflow-x-hidden px-1 pb-16 pt-2 sm:max-h-[70vh]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="honeycomb"
          >
            {shown.map((m, i) => (
              <div key={m.id} className="hex-cell">
                <Reveal
                  as="button"
                  type="button"
                  onClick={() => setLightbox(m)}
                  variant="scale"
                  duration={0.7}
                  amount={0.1}
                  delay={(i % 8) * 0.05}
                  className="hex group"
                  aria-label={`Open ${m.title}`}
                >
                  <span className="hex-inner">
                    {m.url && <img src={m.url} alt={`${m.title}${m.location ? ` — ${m.location}` : ""}`} loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110" />}
                    <span className="hex-overlay">
                      <span className="block font-display text-[11px] leading-tight sm:text-xs">{m.title}</span>
                      {(m.category || m.location) && <span className="mt-1 block font-mono text-[8px] uppercase tracking-widest text-cyan">{m.category}{m.category && m.location ? " · " : ""}{m.location}</span>}
                    </span>
                  </span>
                </Reveal>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {pages > 1 && (
        <div className="mt-px flex items-center justify-between border border-border">
          <div className="flex">
            <button type="button" onClick={() => go(-1)} aria-label="Previous moments" className="flex h-12 w-12 items-center justify-center border-r border-border transition hover:bg-ink hover:text-background"><ChevronLeft className="h-4 w-4" /></button>
            <button type="button" onClick={() => go(1)} aria-label="Next moments" className="flex h-12 w-12 items-center justify-center border-r border-border transition hover:bg-ink hover:text-background"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <span className="label pr-4">{String(current + 1).padStart(2, "0")} / {String(pages).padStart(2, "0")}</span>
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm sm:p-8">
            <button onClick={() => setLightbox(null)} className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center border-b border-l border-border bg-background transition hover:bg-ink hover:text-background" aria-label="Close moment"><X className="h-5 w-5" /></button>
            <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="relative max-w-4xl border border-border bg-background p-3 sm:p-5">
              {lightbox.url && <img src={lightbox.url} alt={`${lightbox.title}${lightbox.location ? ` — ${lightbox.location}` : ""}`} className="max-h-[72vh] max-w-full object-contain" />}
              <div className="px-2 pb-2 pt-4"><h3 className="display-thin text-xl">{lightbox.title}</h3><p className="label mt-2 text-cyan">{lightbox.category}{lightbox.category && lightbox.location ? " · " : ""}{lightbox.location}{lightbox.event_date ? ` · ${lightbox.event_date}` : ""}</p>{lightbox.caption && <p className="mt-3 text-sm text-muted-foreground">{lightbox.caption}</p>}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
