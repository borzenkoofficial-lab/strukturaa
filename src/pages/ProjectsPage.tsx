import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";
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

const projects: { titleKey: TranslationKey; descKey: TranslationKey; image: string; area: string; duration: string; category: string }[] = [
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

const ProjectsPage = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEOHead title="Проекты" description="Портфолио выполненных проектов STRUKTURA: демонтаж, строительство, реновация промышленных и жилых объектов." canonical="/projects" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <AnimatedSection>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{t("projects.title")}</h1>
          <p className="text-muted-foreground mb-8 sm:mb-10">{t("projects.subtitle")}</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((p, i) => (
            <AnimatedSection key={p.titleKey} delay={i * 0.08}>
              <motion.div
                className={`glass-card overflow-hidden group cursor-pointer ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`overflow-hidden ${i === 0 ? "aspect-[2/1]" : "aspect-video"}`}>
                  <motion.img
                    src={p.image}
                    alt={t(p.titleKey)}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.5 }}
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
    </>
  );
};

export default ProjectsPage;
