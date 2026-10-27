import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
      <section className="skol-stories-bar sticky top-[60px] sm:top-[68px] z-40 px-3 sm:px-6 py-1.5 sm:py-2">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-xl border border-border/45 bg-card/75 backdrop-blur-xl">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              maskImage: "linear-gradient(to right, black, transparent 82%)",
            }}
          />
          <div className="relative flex items-center gap-2.5 px-2.5 py-2 sm:gap-3 sm:px-3">
            <div className="hidden sm:flex shrink-0 items-center gap-2 border-r border-border/50 pr-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Истории</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {stories.map((story, i) => (
                  <motion.button
                    key={story.id}
                    type="button"
                    aria-label={`Открыть историю: ${story.title}`}
                    className="group relative flex w-[62px] shrink-0 flex-col items-center gap-1 rounded-lg px-1 py-1 transition-colors hover:bg-primary/[0.06] sm:w-[72px]"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.035, duration: 0.24 }}
                    onClick={() => setActiveIndex(i)}
                  >
                    <span className="skol-story-ring relative block h-[44px] w-[44px] rounded-full p-[2px] transition-transform duration-300 group-hover:scale-[1.04] sm:h-[48px] sm:w-[48px]">
                      <span className="block h-full w-full overflow-hidden rounded-full border-2 border-background bg-muted">
                        <img
                          src={story.image_url}
                          alt={story.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </span>
                    </span>
                    <span className="w-full truncate text-center text-[9px] font-medium leading-tight text-foreground/75 transition-colors group-hover:text-foreground sm:text-[10px]">
                      {story.title}
                    </span>
                  </motion.button>
                ))}
              </div>
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
