import { motion } from "framer-motion";
import { useState } from "react";
import { X, Camera } from "lucide-react";
import type { Moment } from "@/lib/content.functions";

export function Moments({ items }: { items: Moment[] }) {
  const [lightbox, setLightbox] = useState<Moment | null>(null);
  if (!items.length) return null;

  return (
    <section id="moments" className="relative w-full py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">/ moments</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Events &amp; <span className="text-cyan">memories</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Snapshots from hackathons, workshops, meetups, and life off the keyboard.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <Camera className="h-3.5 w-3.5 text-cyan" />
            {items.length} captured
          </span>
        </div>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {items.map((m, i) => (
            <motion.button
              key={m.id}
              type="button"
              onClick={() => setLightbox(m)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
              className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl border border-border glass text-left transition hover:border-cyan/40 hover:glow-cyan"
            >
              {m.url && (
                <img
                  src={m.url}
                  alt={m.title}
                  loading="lazy"
                  className="w-full transition duration-500 group-hover:scale-[1.02]"
                />
              )}
              <div className="p-3">
                <h3 className="font-display text-sm font-semibold">{m.title}</h3>
                {m.event_date && (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                    {m.event_date}
                  </p>
                )}
                {m.caption && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.caption}</p>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
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
            <img
              src={lightbox.url}
              alt={lightbox.title}
              className="max-h-[90vh] max-w-full rounded-lg"
            />
          )}
        </div>
      )}
    </section>
  );
}
