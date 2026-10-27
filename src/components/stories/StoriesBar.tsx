import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import StoryViewer from "./StoryViewer";

interface Story {
  id: string;
  title: string;
  image_url: string;
  overlay_text: string | null;
  cta_label: string | null;
  cta_link: string | null;
  created_at: string;
}

const StoriesBar = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { data: stories = [] } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Story[];
    },
  });

  if (stories.length === 0) return null;

  return (
    <>
      <section className="skol-stories-bar sticky top-[60px] sm:top-[68px] z-40 px-3 sm:px-6 py-2 sm:py-3">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-2xl border border-border/50 bg-card/90 shadow-[0_12px_36px_-24px_hsl(var(--foreground)/0.35)] backdrop-blur-xl">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage: "linear-gradient(to right, black, transparent 88%)",
            }}
          />
          <div className="relative flex items-center gap-3 sm:gap-5 px-3 py-3 sm:px-5 sm:py-4">
            <div className="hidden sm:block shrink-0 pr-4 border-r border-border/60">
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary">СКОЛ / LIVE</p>
              <h2 className="mt-1 text-sm font-display font-bold text-foreground">Истории</h2>
              <p className="mt-1 text-[10px] text-muted-foreground">Объекты и процессы</p>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex gap-2.5 sm:gap-3 overflow-x-auto scrollbar-hide">
                {stories.map((story, i) => (
                  <motion.button
                    key={story.id}
                    type="button"
                    aria-label={`Открыть историю: ${story.title}`}
                    className="group relative flex w-[82px] sm:w-[94px] shrink-0 flex-col items-center gap-2 rounded-xl border border-border/45 bg-background/65 px-2 py-2.5 transition-colors duration-300 hover:border-primary/45 hover:bg-primary/[0.06]"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.28 }}
                    onClick={() => setActiveIndex(i)}
                  >
                    <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <span className="skol-story-ring relative block h-[54px] w-[54px] rounded-full p-[2px] transition-transform duration-300 group-hover:scale-[1.04] sm:h-[62px] sm:w-[62px]">
                      <span className="block h-full w-full overflow-hidden rounded-full border-2 border-background bg-muted">
                        <img
                          src={story.image_url}
                          alt={story.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </span>
                    </span>
                    <span className="w-full truncate text-center text-[10px] font-medium leading-tight tracking-wide text-foreground/75 transition-colors group-hover:text-foreground sm:text-[11px]">
                      {story.title}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="hidden md:flex shrink-0 items-center gap-2 pl-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.65)]" />
              Смотреть
            </div>
          </div>
        </div>
      </section>

      {activeIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </>
  );
};

export default StoriesBar;
