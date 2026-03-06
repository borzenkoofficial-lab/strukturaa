import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroDemolition from "@/assets/hero-demolition.jpg";
import serviceConstruction from "@/assets/service-construction.jpg";
import serviceRenovation from "@/assets/service-renovation.jpg";
import AnimatedSection from "./AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";

const ServicesSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const services: { titleKey: TranslationKey; descKey: TranslationKey; image: string }[] = [
    { titleKey: "services.demolition", descKey: "services.demolitionDesc", image: heroDemolition },
    { titleKey: "services.construction", descKey: "services.constructionDesc", image: serviceConstruction },
    { titleKey: "services.renovation", descKey: "services.renovationDesc", image: serviceRenovation },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatedSection>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-foreground">{t("services.title")}</h2>
          <motion.button
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ x: 4 }}
            onClick={() => navigate("/services")}
          >
            {t("services.all")} <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {services.map((service, i) => (
          <AnimatedSection key={service.titleKey} delay={i * 0.15}>
            <motion.div
              className="glass-card-hover overflow-hidden group cursor-pointer"
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-t-2xl">
                <motion.img
                  src={service.image}
                  alt={t(service.titleKey)}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-foreground">{t(service.titleKey)}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t(service.descKey)}</p>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
