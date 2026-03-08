import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";
import heroDemolition from "@/assets/hero-demolition.jpg";
import serviceConstruction from "@/assets/service-construction.jpg";
import serviceRenovation from "@/assets/service-renovation.jpg";
import teamWorker from "@/assets/team-worker.jpg";

const projects: { titleKey: TranslationKey; descKey: TranslationKey; image: string; area: string; duration: string }[] = [
  { titleKey: "projects.1.title", descKey: "projects.1.desc", image: heroDemolition, area: "8 500 м²", duration: "60 дней" },
  { titleKey: "projects.2.title", descKey: "projects.2.desc", image: serviceConstruction, area: "4 200 м²", duration: "30 дней" },
  { titleKey: "projects.3.title", descKey: "projects.3.desc", image: serviceRenovation, area: "12 000 м²", duration: "90 дней" },
  { titleKey: "projects.4.title", descKey: "projects.4.desc", image: teamWorker, area: "15 000 м²", duration: "40 дней" },
];

const ProjectsPage = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEOHead title="Проекты" description="Портфолио выполненных проектов STRUKTURA: демонтаж, строительство, реновация промышленных и жилых объектов." canonical="/projects" />
      <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatedSection>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{t("projects.title")}</h1>
        <p className="text-muted-foreground mb-10">{t("projects.subtitle")}</p>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <AnimatedSection key={p.titleKey} delay={i * 0.12}>
            <motion.div
              className="glass-card overflow-hidden group cursor-pointer"
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="aspect-video overflow-hidden">
                <motion.img
                  src={p.image}
                  alt={t(p.titleKey)}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">{t(p.titleKey)}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t(p.descKey)}</p>
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
