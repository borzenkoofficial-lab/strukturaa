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
      <div className="sticky top-[64px] sm:top-[76px] z-40 bg-background/90 backdrop-blur-xl border-b border-border/30 shadow-[0_8px_24px_-22px_rgba(0,0,0,0.7)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5">
        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2">
          {stories.map((story, i) => (
            <motion.button
              key={story.id}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              onClick={() => setActiveIndex(i)}
            >
              <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full p-[2.5px] bg-gradient-to-tr from-primary via-accent to-primary group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full border-2 border-background overflow-hidden">
                  <img
                    src={story.image_url}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground max-w-[64px] sm:max-w-[72px] truncate text-center">
                {story.title}
              </span>
            </motion.button>
          ))}
        </div>
        </div>
      </div>

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
