import { motion } from "framer-motion";
import { ClipboardCheck, HardHat, Ruler, Truck } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";

const ProcessSection = () => {
  const { t } = useLanguage();

  const steps: { icon: typeof ClipboardCheck; titleKey: TranslationKey; descKey: TranslationKey }[] = [
    { icon: ClipboardCheck, titleKey: "process.step1", descKey: "process.step1Desc" },
    { icon: Ruler, titleKey: "process.step2", descKey: "process.step2Desc" },
    { icon: HardHat, titleKey: "process.step3", descKey: "process.step3Desc" },
    { icon: Truck, titleKey: "process.step4", descKey: "process.step4Desc" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <AnimatedSection>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">{t("process.title")}</h2>
        <p className="text-muted-foreground mb-10">{t("process.subtitle")}</p>
      </AnimatedSection>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <AnimatedSection key={step.titleKey} delay={i * 0.12}>
            <motion.div className="glass-card-hover p-6 relative overflow-hidden group" whileHover={{ y: -4 }}>
              <span className="absolute top-4 right-4 text-5xl font-display font-bold text-foreground/5 group-hover:text-primary/10 transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{t(step.titleKey)}</h3>
              <p className="text-sm text-muted-foreground">{t(step.descKey)}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-px bg-border/50" />
              )}
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default ProcessSection;
