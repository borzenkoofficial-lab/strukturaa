import { motion } from "framer-motion";
import { ArrowUpRight, Building2, Home, Truck, Wrench, Hammer, Gem, HardHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";

const services: { icon: typeof Building2; titleKey: TranslationKey; descKey: TranslationKey; slug: string }[] = [
  { icon: Building2, titleKey: "services.demolition", descKey: "services.demolitionDesc", slug: "demolition" },
  { icon: HardHat, titleKey: "services.construction", descKey: "services.constructionDesc", slug: "construction" },
  { icon: Home, titleKey: "services.renovation", descKey: "services.renovationDesc", slug: "renovation" },
  { icon: Hammer, titleKey: "services.apartmentDemo", descKey: "services.apartmentDemoDesc", slug: "apartment-demolition" },
  { icon: Building2, titleKey: "services.buildingDemo", descKey: "services.buildingDemoDesc", slug: "building-demolition" },
  { icon: Truck, titleKey: "services.wasteRemoval", descKey: "services.wasteRemovalDesc", slug: "waste-removal" },
  { icon: Wrench, titleKey: "services.dismantling", descKey: "services.dismantlingDesc", slug: "dismantling" },
  { icon: Gem, titleKey: "services.concrete", descKey: "services.concreteDesc", slug: "diamond-cutting" },
];

const ServicesPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <SEOHead title="Услуги — СКОЛ" description="Демонтаж, монтаж конструкций, ремонт, вывоз строительного мусора и алмазная резка." canonical="/services" />
      <main className="skol-services-page mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-14 lg:px-8">
        <AnimatedSection>
          <header className="skol-page-intro">
            <p className="skol-page-kicker">СКОЛ / НАПРАВЛЕНИЯ РАБОТ</p>
            <h1 className="skol-page-title text-foreground">{t("services.pageTitle")}</h1>
            <p className="skol-page-subtitle">{t("services.pageSubtitle")}</p>
            <div className="skol-services-intro-meta mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><span>СКОЛ / ПРОИЗВОДСТВЕННЫЙ КАТАЛОГ</span><span>Состав и стоимость определяются после оценки объекта</span></div>
          </header>
        </AnimatedSection>

        <div className="skol-services-count mb-5 flex items-center justify-between gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Направления работ</p>
          <span className="font-mono text-xs text-muted-foreground">01—08</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {services.map((service, i) => (
            <AnimatedSection key={service.titleKey} delay={Math.min(i * 0.045, 0.22)}>
              <motion.article
                role="link"
                tabIndex={0}
                aria-label={t(service.titleKey)}
                className="glass-card-hover skol-service-card group relative flex h-full cursor-pointer flex-col justify-between"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.22 }}
                onClick={() => navigate(`/services/${service.slug}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/services/${service.slug}`);
                  }
                }}
              >
                <div>
                  <div className="mb-7 flex items-start justify-between">
                    <span className="skol-service-index"><span className="skol-service-index-number">{String(i + 1).padStart(2, "0")}</span><span className="skol-service-index-divider">/</span><span>НАПРАВЛЕНИЕ</span></span>
                    <div className="skol-service-icon flex items-center justify-center text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                      <service.icon className="h-5 w-5" strokeWidth={1.6} />
                    </div>
                  </div>
                  <h2 className="skol-service-title mb-2 font-display font-semibold text-foreground">{t(service.titleKey)}</h2>
                  <p className="skol-service-description text-sm text-muted-foreground">{t(service.descKey)}</p>
                </div>

                <div className="skol-service-footer mt-6 flex items-end justify-between gap-3 pt-4">
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Расчёт</span>
                    <span className="mt-1 block text-sm font-semibold tracking-tight text-foreground">По объёму и условиям объекта</span>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-foreground transition-colors group-hover:text-primary">
                    {t("services.orderBtn")}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </motion.article>
            </AnimatedSection>
          ))}
        </div>
      </main>
    </>
  );
};

export default ServicesPage;
