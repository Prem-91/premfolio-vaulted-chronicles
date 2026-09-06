import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Camera } from "lucide-react";
import type { Moment } from "@/lib/content.functions";
import { Section, Reveal } from "@/components/Section";

export function Moments({ items }: { items: Moment[] }) {
  const [lightbox, setLightbox] = useState<Moment | null>(null);
  if (!items.length) return null;
  return (
    <Section id="moments" index="07" label="beyond the code" title="Events & memories" intro="Snapshots from the rooms, communities and conversations that happen away from the keyboard." wide aside={<span className="label inline-flex items-center gap-2"><Camera className="h-3 w-3 text-cyan" /> {items.length} captured</span>}>
      <div className="moments-scroll max-h-[62vh] overflow-y-auto overflow-x-hidden px-1 pb-16 pt-2 sm:max-h-[70vh]">
        <div className="honeycomb">
          {items.map((m, i) => (
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
                  {m.url && <img src={m.url} alt={m.title} loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110" />}
                  <span className="hex-overlay">
                    <span className="block font-display text-[11px] leading-tight sm:text-xs">{m.title}</span>
                    {(m.category || m.location) && <span className="mt-1 block font-mono text-[8px] uppercase tracking-widest text-cyan">{m.category}{m.category && m.location ? " · " : ""}{m.location}</span>}
                  </span>
                </span>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm sm:p-8">
            <button onClick={() => setLightbox(null)} className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center border-b border-l border-border bg-background transition hover:bg-ink hover:text-background" aria-label="Close moment"><X className="h-5 w-5" /></button>
            <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="relative max-w-4xl border border-border bg-background p-3 sm:p-5">
              {lightbox.url && <img src={lightbox.url} alt={lightbox.title} className="max-h-[72vh] max-w-full object-contain" />}
              <div className="px-2 pb-2 pt-4"><h3 className="display-thin text-xl">{lightbox.title}</h3><p className="label mt-2 text-cyan">{lightbox.category}{lightbox.category && lightbox.location ? " · " : ""}{lightbox.location}{lightbox.event_date ? ` · ${lightbox.event_date}` : ""}</p>{lightbox.caption && <p className="mt-3 text-sm text-muted-foreground">{lightbox.caption}</p>}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
