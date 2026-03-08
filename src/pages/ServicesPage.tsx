import { motion } from "framer-motion";
import { ArrowUpRight, Building2, Home, Truck, Wrench, Hammer, Gem, HardHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";

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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatedSection>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{t("services.pageTitle")}</h1>
        <p className="text-muted-foreground mb-10">{t("services.pageSubtitle")}</p>
      </AnimatedSection>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service, i) => (
          <AnimatedSection key={service.titleKey} delay={i * 0.08}>
            <motion.div
              className="glass-card-hover p-6 h-full flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(`/services/${service.slug}`)}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <motion.div whileHover={{ rotate: 45 }} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-secondary-foreground" />
                  </motion.div>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{t(service.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(service.descKey)}</p>
              </div>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/30">
                <span className="text-sm text-muted-foreground">{t("services.priceFrom")} <span className="text-foreground font-semibold">{service.price}</span></span>
                <motion.button
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("services.orderBtn")}
                </motion.button>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
