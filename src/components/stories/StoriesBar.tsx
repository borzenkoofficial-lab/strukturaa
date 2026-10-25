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
      <div className="skol-stories-bar sticky top-[60px] sm:top-[68px] z-40 bg-background/95 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5">
        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-1">
          {stories.map((story, i) => (
            <motion.button
              key={story.id}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              onClick={() => setActiveIndex(i)}
            >
              <div className="skol-story-ring relative w-[58px] h-[58px] sm:w-[66px] sm:h-[66px] rounded-full p-[2px] group-hover:scale-[1.03] transition-transform duration-300">
                <div className="w-full h-full rounded-full border-2 border-background overflow-hidden">
                  <img
                    src={story.image_url}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-foreground/65 group-hover:text-foreground max-w-[70px] sm:max-w-[76px] truncate text-center transition-colors">
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
