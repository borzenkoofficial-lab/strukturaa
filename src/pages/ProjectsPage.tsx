import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import { supabase } from "@/integrations/supabase/client";

interface DbProject {
  id: string;
  title: string;
  description: string;
  category: string;
  area: string;
  duration: string;
  featured_image: string | null;
  gallery: string[];
  sort_order: number;
}

interface SelectedProject {
  title: string;
  description: string;
  image: string;
  area: string;
  duration: string;
  category: string;
  gallery?: string[];
}

const ProjectsPage = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<SelectedProject | null>(null);
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("portfolio_projects")
        .select("id, title, description, category, area, duration, featured_image, gallery, sort_order")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      setProjects((data as any[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const categories = ["all", ...new Set(projects.map(p => p.category))];
  const filtered = activeFilter === "all" ? projects : projects.filter(p => p.category === activeFilter);

  return (
    <>
      <SEOHead title="Проекты — STRUKTURA" description="Портфолио выполненных проектов STRUKTURA: демонтаж, строительство, реновация." canonical="/projects" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <AnimatedSection>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{t("projects.title")}</h1>
          <p className="text-muted-foreground mb-6 sm:mb-8">{t("projects.subtitle")}</p>
        </AnimatedSection>

        {/* Category filter */}
        {categories.length > 1 && (
          <AnimatedSection delay={0.1}>
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeFilter === cat
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-card text-muted-foreground hover:bg-secondary border border-border/50"
                  }`}
                >
                  {cat === "all" ? "Все" : cat}
                </button>
              ))}
            </div>
          </AnimatedSection>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-video bg-muted/30 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center text-muted-foreground">
            Проектов пока нет
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((p, i) => (
              <AnimatedSection key={p.id} delay={i * 0.06}>
                <motion.div
                  className={`glass-card overflow-hidden group cursor-pointer ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelected({
                    title: p.title,
                    description: p.description,
                    image: p.featured_image || "",
                    area: p.area,
                    duration: p.duration,
                    category: p.category,
                    gallery: p.gallery,
                  })}
                >
                  <div className={`overflow-hidden ${i === 0 ? "aspect-[2/1]" : "aspect-video"}`}>
                    {p.featured_image ? (
                      <motion.img
                        src={p.featured_image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">Нет фото</div>
                    )}
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-primary/15 text-[10px] font-semibold text-primary uppercase tracking-wider">
                        {p.category}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-display font-semibold text-foreground mb-2">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {p.area && <span>{t("projects.area")}: <strong className="text-foreground">{p.area}</strong></span>}
                      {p.duration && <span>{t("projects.duration")}: <strong className="text-foreground">{p.duration}</strong></span>}
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectsPage;
