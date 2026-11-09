import { motion, useReducedMotion } from "framer-motion";
import { ClipboardCheck, HardHat, Ruler, Truck } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";

const ProcessSection = () => {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  const steps: { icon: typeof ClipboardCheck; titleKey: TranslationKey; descKey: TranslationKey }[] = [
    { icon: ClipboardCheck, titleKey: "process.step1", descKey: "process.step1Desc" },
    { icon: Ruler, titleKey: "process.step2", descKey: "process.step2Desc" },
    { icon: HardHat, titleKey: "process.step3", descKey: "process.step3Desc" },
    { icon: Truck, titleKey: "process.step4", descKey: "process.step4Desc" },
  ];

  return (
    <section className="skol-process-section mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20" aria-labelledby="skol-process-title">
      <AnimatedSection>
        <div className="skol-process-heading">
          <p className="skol-section-label mb-4 text-primary">SKOL / PROCESS</p>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 id="skol-process-title" className="max-w-2xl text-3xl font-display font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              {t("process.title")}
            </h2>
            <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-base">{t("process.subtitle")}</p>
          </div>
        </div>
      </AnimatedSection>

      <div className="skol-process-grid">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <AnimatedSection key={step.titleKey} delay={index * 0.09}>
              <motion.article
                className="skol-process-step group"
                whileHover={reduceMotion ? undefined : { y: -5 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="skol-process-step__top">
                  <span className="skol-process-step__number">0{index + 1}</span>
                  <span className="skol-process-step__icon"><Icon size={21} strokeWidth={1.5} /></span>
                </div>
                <div className="skol-process-step__body">
                  <h3>{t(step.titleKey)}</h3>
                  <p>{t(step.descKey)}</p>
                </div>
                <span className="skol-process-step__track" aria-hidden="true"><i style={{ transform: `scaleX(${(index + 1) / steps.length})` }} /></span>
              </motion.article>
            </AnimatedSection>
          );
        })}
      </div>
    </section>
  );
};

export default ProcessSection;
