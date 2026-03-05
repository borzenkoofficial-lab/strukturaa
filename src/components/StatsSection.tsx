import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";

const StatsSection = () => {
  const { t } = useLanguage();

  const stats: { value: string; labelKey: TranslationKey; accent: boolean }[] = [
    { value: "500+", labelKey: "stats.projects", accent: false },
    { value: "15", labelKey: "stats.years", accent: false },
    { value: "98%", labelKey: "stats.clients", accent: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <AnimatedSection key={stat.labelKey} delay={i * 0.15}>
            <motion.div
              className={`rounded-2xl p-6 flex flex-col justify-between min-h-[120px] ${
                stat.accent ? "bg-primary text-primary-foreground" : "glass-card"
              }`}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className={`text-3xl font-display font-bold ${stat.accent ? "" : "text-foreground"}`}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 200 }}
              >
                {stat.value}
              </motion.span>
              <span className={`text-sm mt-2 ${stat.accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {t(stat.labelKey)}
              </span>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
