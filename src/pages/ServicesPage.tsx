import { motion } from "framer-motion";
import { ArrowUpRight, Building2, Home, Truck, Wrench, Hammer, Gem, HardHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";

const services: { icon: typeof Building2; titleKey: TranslationKey; descKey: TranslationKey; price: string; slug: string }[] = [
  { icon: Building2, titleKey: "services.demolition", descKey: "services.demolitionDesc", price: "500₽/м²", slug: "demolition" },
  { icon: HardHat, titleKey: "services.construction", descKey: "services.constructionDesc", price: "1200₽/м²", slug: "construction" },
  { icon: Home, titleKey: "services.renovation", descKey: "services.renovationDesc", price: "800₽/м²", slug: "renovation" },
  { icon: Hammer, titleKey: "services.apartmentDemo", descKey: "services.apartmentDemoDesc", price: "400₽/м²", slug: "apartment-demolition" },
  { icon: Building2, titleKey: "services.buildingDemo", descKey: "services.buildingDemoDesc", price: "350₽/м²", slug: "building-demolition" },
  { icon: Truck, titleKey: "services.wasteRemoval", descKey: "services.wasteRemovalDesc", price: "8000₽", slug: "waste-removal" },
  { icon: Wrench, titleKey: "services.dismantling", descKey: "services.dismantlingDesc", price: "600₽/м²", slug: "dismantling" },
  { icon: Gem, titleKey: "services.concrete", descKey: "services.concreteDesc", price: "1500₽/м.п.", slug: "diamond-cutting" },
];

const ServicesPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <SEOHead title="Услуги — СКОЛ" description="Демонтаж, монтаж конструкций, ремонт, вывоз строительного мусора и алмазная резка." canonical="/services" />
      <main className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-14 lg:px-8">
        <AnimatedSection>
          <header className="skol-page-intro">
            <p className="skol-page-kicker">СКОЛ / НАПРАВЛЕНИЯ РАБОТ</p>
            <h1 className="skol-page-title text-foreground">{t("services.pageTitle")}</h1>
            <p className="skol-page-subtitle">{t("services.pageSubtitle")}</p>
          </header>
        </AnimatedSection>

        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Каталог услуг</p>
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
                    <span className="skol-service-index">0{i + 1} / SKOL</span>
                    <div className="skol-service-icon flex items-center justify-center text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                      <service.icon className="h-5 w-5" strokeWidth={1.6} />
                    </div>
                  </div>
                  <h2 className="skol-service-title mb-2 font-display font-semibold text-foreground">{t(service.titleKey)}</h2>
                  <p className="skol-service-description text-sm text-muted-foreground">{t(service.descKey)}</p>
                </div>

                <div className="skol-service-footer mt-6 flex items-end justify-between gap-3 pt-4">
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{t("services.priceFrom")}</span>
                    <span className="mt-1 block text-base font-semibold tracking-tight text-foreground">{service.price}</span>
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
