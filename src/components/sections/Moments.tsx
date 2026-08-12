import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Camera } from "lucide-react";
import type { Moment } from "@/lib/content.functions";

export function Moments({ items }: { items: Moment[] }) {
  const [lightbox, setLightbox] = useState<Moment | null>(null);
  if (!items.length) return null;

  return (
    <section id="moments" className="relative w-full py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">/ moments</p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-6xl">
              Events &amp; <span className="text-cyan">memories</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Snapshots from hackathons, workshops, meetups, and life off the keyboard. Tap a cell to
              enlarge.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <Camera className="h-3.5 w-3.5 text-cyan" />
            {items.length} captured
          </span>
        </div>

        {/* Honeycomb grid */}
        <div className="honeycomb mt-12">
          {items.map((m, i) => (
            <div key={m.id} className="hex-cell">
            <motion.button
              type="button"
              onClick={() => setLightbox(m)}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
              className="hex group"
              aria-label={`Open ${m.title}`}
            >
              <span className="hex-inner">
                {m.url && (
                  <img
                    src={m.url}
                    alt={m.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                  />
                )}
                <span className="hex-overlay">
                  <span className="block font-display text-[11px] font-semibold leading-tight text-foreground sm:text-xs">
                    {m.title}
                  </span>
                  {m.event_date && (
                    <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-widest text-cyan sm:text-[9px]">
                      {m.event_date}
                    </span>
                  )}
                </span>
              </span>
            </motion.button>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl sm:p-6"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute right-4 top-4 rounded-full border border-border bg-white/10 p-2 text-foreground transition hover:border-cyan/50 hover:text-cyan"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] flex-col items-center gap-4"
            >
              {lightbox.url && (
                <img
                  src={lightbox.url}
                  alt={lightbox.title}
                  className="max-h-[70vh] max-w-full rounded-xl border border-border shadow-2xl"
                />
              )}
              <div className="max-w-xl px-2 text-center">
                <h3 className="font-display text-lg font-semibold">{lightbox.title}</h3>
                {lightbox.event_date && (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                    {lightbox.event_date}
                  </p>
                )}
                {lightbox.caption && (
                  <p className="mt-2 text-sm text-muted-foreground">{lightbox.caption}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
