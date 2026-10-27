import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, ArrowRight, Building2, Layers3, Ruler, Sparkles, Flower2 } from "lucide-react";
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

const visualReferences = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=85",
];

const portfolioExamples: DbProject[] = [
  {
    id: "skol-project-01",
    title: "Демонтаж административного здания",
    description: "Демонтажные работы на объекте площадью около 500 м². Название заказчика не публикуется. Подробности по составу работ и подготовке площадки можно уточнить при обсуждении аналогичного объекта.",
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
    description: "Демонтаж помещения с учётом существующих конструкций и подготовки к следующему этапу работ. Конкретный состав и последовательность работ определяются условиями объекта.",
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
    description: "Демонтаж фасада и восстановление фасадного решения, включая работы с окнами и ограждениями. Кейс представлен в обобщённом виде; дополнительные материалы публикуются по мере согласования.",
    category: "Фасадные работы",
    area: "",
    duration: "",
    featured_image: null,
    gallery: [],
    sort_order: 3,
  },
];

const petals = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 37 + 9) % 100,
  delay: (i % 8) * -1.7,
  duration: 13 + (i % 7) * 2.1,
  size: 4 + (i % 4) * 2,
  drift: (i % 2 === 0 ? 1 : -1) * (24 + (i % 5) * 12),
  rotation: (i * 53) % 260,
}));

const ProjectsPage = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<SelectedProject | null>(null);
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("portfolio_projects")
          .select("id, title, description, category, area, duration, featured_image, gallery, sort_order")
          .eq("published", true)
          .order("sort_order", { ascending: true });
        if (error) throw error;
        const validProjects = (data as DbProject[] | null)?.filter((project) => project.title?.trim().length > 8 && project.description?.trim().length > 20) ?? [];
        setProjects(validProjects.length ? validProjects : portfolioExamples);
      } catch {
        setProjects(portfolioExamples);
      } finally {
        setLoading(false);
      }
    };
    void loadProjects();
  }, []);

  const categories = ["all", ...new Set(projects.map((p) => p.category))];
  const filtered = activeFilter === "all" ? projects : projects.filter((p) => p.category === activeFilter);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  const openProject = (p: DbProject, index: number) => {
    const image = p.featured_image || visualReferences[index % visualReferences.length];
    setSelected({
      title: p.title,
      description: p.description,
      image,
      area: p.area,
      duration: p.duration,
      category: p.category,
      gallery: p.gallery?.length ? p.gallery : [],
    });
  };

  return (
    <>
      <SEOHead title="Проекты и портфолио — Структура" description="Портфолио строительных объектов: демонтаж, фасадные работы и подготовка помещений. Истории объектов, фотографии и детали выполненных работ." canonical="/projects" />
      <main className="relative isolate min-h-screen overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_12%,hsl(var(--primary)/0.10),transparent_34%),radial-gradient(ellipse_at_90%_42%,rgba(190,130,151,0.09),transparent_30%)]" />
          <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)/0.06) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/0.06) 1px, transparent 1px)", backgroundSize: "72px 72px", maskImage: "linear-gradient(to bottom, black, transparent 75%)" }} />
          {petals.map((petal, i) => (
            <motion.span
              key={i}
              className="absolute top-[-5%] rounded-[80%_15%_75%_20%] bg-rose-200/70 shadow-[0_0_14px_rgba(236,164,190,0.45)]"
              style={{ left: `${petal.left}%`, width: petal.size, height: petal.size * 1.45, filter: "blur(0.2px)" }}
              animate={{ y: ["0vh", "112vh"], x: [0, petal.drift, petal.drift * -0.45, 0], rotate: [petal.rotation, petal.rotation + 210], opacity: [0, 0.75, 0.65, 0] }}
              transition={{ duration: petal.duration, delay: petal.delay, repeat: Infinity, ease: "linear" }}
            />
          ))}
          <motion.div className="absolute -right-28 top-52 h-80 w-80 rounded-full border border-rose-200/15" animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }} />
          <motion.div className="absolute -right-12 top-64 h-48 w-48 rounded-full border border-primary/10" animate={{ rotate: -360 }} transition={{ duration: 70, repeat: Infinity, ease: "linear" }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8">
          <AnimatedSection>
            <header className="relative mb-9 overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/70 p-5 shadow-[0_30px_100px_-55px_hsl(var(--primary)/0.32)] backdrop-blur-sm sm:mb-12 sm:p-8 lg:p-11">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-rose-200/10 blur-3xl" />
                <div className="absolute right-[18%] top-0 h-full w-px bg-gradient-to-b from-transparent via-border/70 to-transparent" />
                <div className="absolute bottom-0 left-0 h-px w-2/3 bg-gradient-to-r from-primary/50 to-transparent" />
                <span className="absolute right-7 top-6 hidden font-mono text-[10px] tracking-[0.28em] text-muted-foreground/50 md:block">PORTFOLIO / FIELD NOTES / 2026</span>
              </div>
              <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.65fr)] lg:items-end">
                <div>
                  <p className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs"><span className="h-px w-7 bg-primary" />Структура / архив объектов</p>
                  <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-7xl">
                    Проекты,<br /><span className="text-primary">за которыми</span><br />стоит работа.
                  </h1>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Каждый объект — отдельная задача, условия и последовательность решений. Собрали доступные кейсы в формате визуальных историй: с контекстом, ключевыми деталями и материалами.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-3 py-2"><Building2 className="h-3.5 w-3.5 text-primary" />Объекты и пространства</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-3 py-2"><Layers3 className="h-3.5 w-3.5 text-primary" />Демонтаж и обновление</span>
                  </div>
                </div>
                <div className="relative min-h-[190px] overflow-hidden rounded-2xl border border-border/60 bg-background/45 p-4 sm:min-h-[230px] sm:p-5">
                  <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "linear-gradient(135deg, transparent 48%, hsl(var(--primary)/0.12) 48.2%, transparent 48.5%), linear-gradient(45deg, transparent 68%, hsl(var(--foreground)/0.08) 68.2%, transparent 68.5%)" }} />
                  <div className="relative flex items-start justify-between">
                    <div><p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Портфолио</p><p className="mt-1 font-display text-3xl font-semibold text-foreground sm:text-4xl">{String(projects.length || 3).padStart(2, "0")} <span className="text-sm font-normal text-muted-foreground">кейса</span></p></div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary"><Sparkles className="h-4 w-4" /></span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                    <div className="mb-3 flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-muted-foreground"><span>От задачи к результату</span><span>01 / 03</span></div>
                    <div className="h-[2px] overflow-hidden bg-border/70"><motion.div className="h-full w-1/3 bg-primary" animate={{ x: ["0%", "200%", "0%"] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} /></div>
                    <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">Факты об объектах — отдельно. Визуальные референсы — только как иллюстрация.</p>
                  </div>
                  <Flower2 className="absolute bottom-10 right-8 h-20 w-20 rotate-12 text-rose-200/25" strokeWidth={0.7} />
                </div>
              </div>
            </header>
          </AnimatedSection>

          <AnimatedSection delay={0.06}>
            <div className="mb-6 flex flex-col gap-4 border-b border-border/60 pb-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-[10px] uppercase tracking-[0.22em] text-primary">Выбрать направление</p><h2 className="mt-2 font-display text-xl font-semibold text-foreground sm:text-2xl">Архив проектов</h2></div>
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setActiveFilter(cat)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 ${activeFilter === cat ? "border-primary bg-primary text-primary-foreground shadow-[0_5px_25px_-10px_hsl(var(--primary)/0.7)]" : "border-border/70 bg-card/55 text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
                    {cat === "all" ? "Все проекты" : cat}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="grid gap-5 lg:grid-cols-2">{[1, 2, 3].map((i) => <div key={i} className="aspect-[5/3] animate-pulse rounded-3xl border border-border/40 bg-muted/30" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-border/60 bg-card/60 p-12 text-center text-muted-foreground">Проектов в этой категории пока нет.</div>
          ) : (
            <>
              {featured && (
                <AnimatedSection>
                  <motion.article className="group relative mb-5 cursor-pointer overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/70 shadow-[0_25px_90px_-55px_hsl(var(--foreground)/0.35)] sm:mb-7" whileHover={{ y: -3 }} transition={{ duration: 0.35 }} onClick={() => openProject(featured, 0)} tabIndex={0} role="button" onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openProject(featured, 0); }}>
                    <div className="relative min-h-[390px] overflow-hidden sm:min-h-[470px] lg:min-h-[540px]">
                      <img src={featured.featured_image || visualReferences[0]} alt={featured.featured_image ? featured.title : `Визуальный референс: ${featured.title}`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.035]" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#111315]/95 via-[#111315]/72 to-[#111315]/10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111315]/60 via-transparent to-[#111315]/15" />
                      <div className="absolute left-5 top-5 flex items-center gap-2 sm:left-8 sm:top-8"><span className="rounded-full border border-white/20 bg-black/25 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-white/90 backdrop-blur-md">01 / FEATURED CASE</span><span className="rounded-full border border-rose-100/25 bg-rose-100/10 px-3 py-1.5 text-[10px] text-rose-50/90 backdrop-blur-md">{featured.category}</span></div>
                      {!featured.featured_image && <span className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-white/75 backdrop-blur-md sm:right-8 sm:top-8">Визуальный референс</span>}
                      <div className="absolute bottom-0 left-0 right-0 grid gap-6 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:p-11">
                        <div className="max-w-2xl">
                          <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-rose-100/75">История объекта / 001</p>
                          <h2 className="font-display text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-6xl">{featured.title}</h2>
                          <p className="mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">{featured.description}</p>
                          <div className="mt-5 flex flex-wrap gap-3">
                            {featured.area && <span className="inline-flex items-center gap-2 border-l border-rose-200/60 pl-3 text-xs text-white/85"><Ruler className="h-3.5 w-3.5 text-rose-100" />{featured.area}</span>}
                            <span className="inline-flex items-center gap-2 border-l border-white/30 pl-3 text-xs text-white/75">Задача / процесс / пространство</span>
                          </div>
                        </div>
                        <button className="inline-flex w-fit items-center gap-3 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition-all group-hover:border-rose-100/60 group-hover:bg-rose-100/15">Открыть историю <ArrowUpRight className="h-4 w-4" /></button>
                      </div>
                      <div aria-hidden="true" className="pointer-events-none absolute bottom-5 right-8 hidden font-mono text-[9px] tracking-[0.2em] text-white/35 xl:block">STRUKTURA / PROJECT ARCHIVE</div>
                    </div>
                  </motion.article>
                </AnimatedSection>
              )}

              {rest.length > 0 && <div className="mb-5 mt-10 flex items-end justify-between gap-4 sm:mb-7 sm:mt-14"><div><p className="text-[10px] uppercase tracking-[0.22em] text-primary">Другие истории</p><h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Работы и детали</h2></div><span className="hidden font-mono text-[10px] tracking-[0.18em] text-muted-foreground sm:block">ЛИСТАЙТЕ АРХИВ ↓</span></div>}

              <div className="grid gap-5 md:grid-cols-2">
                {rest.map((p, i) => {
                  const image = p.featured_image || visualReferences[(i + 1) % visualReferences.length];
                  return (
                    <AnimatedSection key={p.id} delay={i * 0.08}>
                      <motion.article className="group h-full cursor-pointer overflow-hidden rounded-[1.5rem] border border-border/60 bg-card/70 transition-colors hover:border-primary/35" whileHover={{ y: -4 }} transition={{ duration: 0.3 }} onClick={() => openProject(p, i + 1)} tabIndex={0} role="button" onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openProject(p, i + 1); }}>
                        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                          <img src={image} alt={p.featured_image ? p.title : `Визуальный референс: ${p.title}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/20" />
                          <div className="absolute left-4 top-4 flex items-center gap-2"><span className="border border-white/20 bg-black/25 px-2.5 py-1.5 font-mono text-[10px] text-white/90 backdrop-blur-md">0{ i + 2 }</span><span className="rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[10px] text-white/90 backdrop-blur-md">{p.category}</span></div>
                          {!p.featured_image && <span className="absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.16em] text-white/70">Визуальный референс · не фото объекта</span>}
                          <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-md transition-all group-hover:rotate-45 group-hover:bg-rose-100/20"><ArrowUpRight className="h-4 w-4" /></span>
                        </div>
                        <div className="p-5 sm:p-6">
                          <div className="mb-3 flex items-center justify-between gap-3"><span className="text-[9px] uppercase tracking-[0.2em] text-primary">История объекта</span>{p.area && <span className="text-xs text-muted-foreground">{p.area}</span>}</div>
                          <h3 className="font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">{p.title}</h3>
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{p.description}</p>
                          <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground"><span>Смотреть детали</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-primary" /></div>
                        </div>
                      </motion.article>
                    </AnimatedSection>
                  );
                })}
              </div>
            </>
          )}

          <AnimatedSection delay={0.1}>
            <section className="relative mt-14 overflow-hidden rounded-[1.5rem] border border-border/60 bg-card/65 p-6 backdrop-blur-sm sm:mt-20 sm:p-9 lg:p-11">
              <div aria-hidden="true" className="absolute -right-10 -top-14 h-48 w-48 rounded-full border border-rose-200/20" />
              <div aria-hidden="true" className="absolute -right-2 -top-5 h-32 w-32 rounded-full border border-primary/15" />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl"><p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-primary">Следующий объект</p><h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">У вашей задачи будет своя история.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">Обсудим исходные условия, объём работ и формат взаимодействия — без выдуманных обещаний и универсальных решений.</p></div>
                <a href="/contacts" className="inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:translate-x-1">Обсудить объект <ArrowDownRight className="h-4 w-4" /></a>
              </div>
            </section>
          </AnimatedSection>
        </div>
      </main>

      <AnimatePresence>
        {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
};

export default ProjectsPage;
