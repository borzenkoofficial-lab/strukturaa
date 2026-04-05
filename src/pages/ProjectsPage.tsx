import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import { supabase } from "@/integrations/supabase/client";
import heroDemolition from "@/assets/hero-demolition.jpg";
import serviceConstruction from "@/assets/service-construction.jpg";
import serviceRenovation from "@/assets/service-renovation.jpg";
import teamWorker from "@/assets/team-worker.jpg";
import projectWallDemo from "@/assets/project-wall-demolition.jpg";
import projectFacade from "@/assets/project-facade.jpg";
import projectIndustrial from "@/assets/project-industrial-demo.jpg";
import projectApartment from "@/assets/project-apartment-reno.jpg";
import projectDiamond from "@/assets/project-diamond-cut.jpg";
import projectWaste from "@/assets/project-waste-removal.jpg";

interface StaticProject {
  titleKey: TranslationKey;
  descKey: TranslationKey;
  image: string;
  area: string;
  duration: string;
  category: string;
}

const staticProjects: StaticProject[] = [
  { titleKey: "projects.7.title", descKey: "projects.7.desc", image: projectIndustrial, area: "25 000 м²", duration: "120 дней", category: "Демонтаж" },
  { titleKey: "projects.1.title", descKey: "projects.1.desc", image: heroDemolition, area: "8 500 м²", duration: "60 дней", category: "Демонтаж" },
  { titleKey: "projects.6.title", descKey: "projects.6.desc", image: projectFacade, area: "9 600 м²", duration: "45 дней", category: "Фасад" },
  { titleKey: "projects.3.title", descKey: "projects.3.desc", image: serviceRenovation, area: "12 000 м²", duration: "90 дней", category: "Демонтаж" },
  { titleKey: "projects.5.title", descKey: "projects.5.desc", image: projectWallDemo, area: "3 200 м²", duration: "18 дней", category: "Демонтаж стен" },
  { titleKey: "projects.8.title", descKey: "projects.8.desc", image: projectApartment, area: "1 800 м²", duration: "35 дней", category: "Ремонт" },
  { titleKey: "projects.4.title", descKey: "projects.4.desc", image: teamWorker, area: "15 000 м²", duration: "40 дней", category: "Демонтаж" },
  { titleKey: "projects.2.title", descKey: "projects.2.desc", image: serviceConstruction, area: "4 200 м²", duration: "30 дней", category: "Реконструкция" },
  { titleKey: "projects.9.title", descKey: "projects.9.desc", image: projectDiamond, area: "48 проёмов", duration: "12 дней", category: "Алмазная резка" },
  { titleKey: "projects.10.title", descKey: "projects.10.desc", image: projectWaste, area: "1 200 м³", duration: "5 дней", category: "Вывоз мусора" },
];

interface PortfolioArticle {
  id: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  tags: string[] | null;
}

interface SelectedProject {
  title: string;
  description: string;
  image: string;
  area: string;
  duration: string;
  category: string;
}

const ProjectsPage = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<SelectedProject | null>(null);
  const [portfolioArticles, setPortfolioArticles] = useState<PortfolioArticle[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchPortfolio = async () => {
      const { data } = await supabase
        .from("articles")
        .select("id, title, excerpt, featured_image, tags")
        .eq("published", true)
        .contains("tags", ["portfolio"])
        .order("created_at", { ascending: false });
      setPortfolioArticles(data || []);
    };
    fetchPortfolio();
  }, []);

  const categories = ["all", ...new Set(staticProjects.map(p => p.category))];
  const filteredStatic = activeFilter === "all" ? staticProjects : staticProjects.filter(p => p.category === activeFilter);

  return (
    <>
      <SEOHead title="Портфолио — STRUKTURA" description="Портфолио выполненных проектов STRUKTURA: демонтаж, строительство, реновация." canonical="/projects" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <AnimatedSection>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{t("projects.title")}</h1>
          <p className="text-muted-foreground mb-6 sm:mb-8">{t("projects.subtitle")}</p>
        </AnimatedSection>

        {/* Category filter */}
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

        {/* Portfolio articles from admin */}
        {portfolioArticles.length > 0 && (
          <AnimatedSection delay={0.15}>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 mt-2">Из блога</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {portfolioArticles.map((article) => (
                <motion.div
                  key={article.id}
                  className="glass-card overflow-hidden group cursor-pointer"
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={() => setSelected({
                    title: article.title,
                    description: article.excerpt || "",
                    image: article.featured_image || "",
                    area: "—",
                    duration: "—",
                    category: "Портфолио",
                  })}
                >
                  <div className="aspect-video overflow-hidden">
                    {article.featured_image ? (
                      <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">Нет фото</div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-primary/15 text-[10px] font-semibold text-primary uppercase tracking-wider">Портфолио</span>
                    <h3 className="text-base font-display font-semibold text-foreground mt-2 line-clamp-1">{article.title}</h3>
                    {article.excerpt && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.excerpt}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Static projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredStatic.map((p, i) => (
            <AnimatedSection key={p.titleKey} delay={i * 0.06}>
              <motion.div
                className={`glass-card overflow-hidden group cursor-pointer ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelected({
                  title: t(p.titleKey),
                  description: t(p.descKey),
                  image: p.image,
                  area: p.area,
                  duration: p.duration,
                  category: p.category,
                })}
              >
                <div className={`overflow-hidden ${i === 0 ? "aspect-[2/1]" : "aspect-video"}`}>
                  <motion.img
                    src={p.image}
                    alt={t(p.titleKey)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary/15 text-[10px] font-semibold text-primary uppercase tracking-wider">
                      {p.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-semibold text-foreground mb-2">{t(p.titleKey)}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">{t(p.descKey)}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{t("projects.area")}: <strong className="text-foreground">{p.area}</strong></span>
                    <span>{t("projects.duration")}: <strong className="text-foreground">{p.duration}</strong></span>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <ProjectDetailModal
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectsPage;
