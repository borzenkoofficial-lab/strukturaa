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

const portfolioExamples: DbProject[] = [
  {
    id: "skol-project-01",
    title: "Демонтаж административного здания",
    description: "Демонтажные работы на объекте площадью около 500 м². Название заказчика не публикуется.",
    category: "Демонтаж",
    area: "500 м²",
    duration: "",
    featured_image: null,
    gallery: [],
    sort_order: 1,
  },
  {
    id: "skol-project-02",
    title: "Демонтаж актового зала",
    description: "Демонтаж помещения с учётом существующих конструкций и подготовки к следующему этапу работ.",
    category: "Демонтаж",
    area: "",
    duration: "",
    featured_image: null,
    gallery: [],
    sort_order: 2,
  },
  {
    id: "skol-project-03",
    title: "Фасад главного офиса LADA",
    description: "Демонтаж фасада и восстановление фасадного решения, включая работы с окнами и ограждениями.",
    category: "Фасадные работы",
    area: "",
    duration: "",
    featured_image: null,
    gallery: [],
    sort_order: 3,
  },
];

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
      setProjects(data?.length ? (data as DbProject[]) : portfolioExamples);
      setLoading(false);
    };
    fetch();
  }, []);

  const categories = ["all", ...new Set(projects.map(p => p.category))];
  const filtered = activeFilter === "all" ? projects : projects.filter(p => p.category === activeFilter);

  return (
    <>
      <SEOHead title="Портфолио — СКОЛ" description="Примеры демонтажных, монтажных и комплексных строительных работ компании СКОЛ." canonical="/projects" />
      <main className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-14 lg:px-8">
        <AnimatedSection>
          <header className="skol-page-intro">
            <p className="skol-page-kicker">СКОЛ / ВЫПОЛНЕННЫЕ РАБОТЫ</p>
            <h1 className="skol-page-title text-foreground">{t("projects.title")}</h1>
            <p className="skol-page-subtitle">{t("projects.subtitle")}</p>
          </header>
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
                  className={`glass-card group cursor-pointer ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}
                  whileHover={{ y: -2 }}
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
                  <div className={`skol-project-image overflow-hidden ${i === 0 ? "aspect-[2/1]" : "aspect-video"}`}>
                    {p.featured_image ? (
                      <motion.img
                        src={p.featured_image}
                        alt={p.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#242629] p-5 sm:p-7"><div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(241,239,234,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(241,239,234,.08) 1px, transparent 1px)", backgroundSize: "28px 28px" }} /><div className="relative flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.22em] text-white/45">СКОЛ / АРХИВ ОБЪЕКТА</span><span className="font-mono text-xs text-white/55">{String(i + 1).padStart(2, "0")}</span></div><div className="relative"><div className="mb-3 h-px w-14 bg-[#b7838d]" /><p className="max-w-xs font-display text-lg font-medium leading-snug text-white/85 sm:text-xl">Материалы объекта готовятся к публикации</p></div><div className="absolute -right-8 top-1/4 h-44 w-44 rounded-full border border-white/10" /><div className="absolute -right-2 top-1/3 h-28 w-28 rounded-full border border-[#b7838d]/35" /></div>
                    )}
                  </div>
                  <div className="p-5 sm:p-6 lg:p-7">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/80">
                        {p.category}
                      </span>
                    </div>
                    <h2 className="mb-2 text-lg font-display font-semibold tracking-tight text-foreground sm:text-xl">{p.title}</h2>
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
      </main>

      <AnimatePresence>
        {selected && (
          <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectsPage;
