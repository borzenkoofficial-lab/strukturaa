import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PointerEvent as ReactPointerEvent } from "react";

const moveCtaPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
  if (event.pointerType !== "mouse") return;
  const bounds = event.currentTarget.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) return;
  const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
  const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
  event.currentTarget.style.setProperty("--skol-cta-x", `${x * 100}%`);
  event.currentTarget.style.setProperty("--skol-cta-y", `${y * 100}%`);
};

const resetCtaPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
  event.currentTarget.style.setProperty("--skol-cta-x", "50%");
  event.currentTarget.style.setProperty("--skol-cta-y", "50%");
};

const CTASection = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20" aria-labelledby="skol-contact-title">
      <AnimatedSection>
        <div className="skol-cta-panel relative isolate overflow-hidden border border-border/70 p-6 sm:p-10 md:p-14" onPointerMove={moveCtaPointer} onPointerLeave={resetCtaPointer}>
          <div className="skol-cta-panel__blueprint" aria-hidden="true" />
          <div className="skol-cta-panel__orbit skol-cta-panel__orbit--one" aria-hidden="true" />
          <div className="skol-cta-panel__orbit skol-cta-panel__orbit--two" aria-hidden="true" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-2xl">
              <p className="skol-section-label mb-4 text-primary">SKOL / NEXT STEP</p>
              <h2 id="skol-contact-title" className="mb-4 font-display text-3xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-5xl">
                {t("cta.title")}
              </h2>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{t("cta.desc")}</p>
            </div>
            <div className="skol-cta-actions flex w-full flex-col gap-3 sm:w-auto sm:min-w-[230px]">
              <motion.a
                href="tel:+79366669958"
                className="skol-cta-action skol-cta-action--primary"
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                <Phone size={17} strokeWidth={1.7} />
                <span>{t("cta.call")}</span>
                <ArrowUpRight className="ml-auto" size={17} />
              </motion.a>
              <motion.button
                type="button"
                onClick={() => navigate("/contacts")}
                className="skol-cta-action skol-cta-action--secondary"
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                <span>{t("cta.request")}</span>
                <ArrowUpRight className="ml-auto" size={17} />
              </motion.button>
            </div>
          </div>
          <div className="skol-cta-panel__footer">
            <span>DEMOLITION / CONSTRUCTION / FINISHING</span>
            <span>МОСКВА · МОСКОВСКАЯ ОБЛАСТЬ</span>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default CTASection;
