import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { useLanguage } from "@/contexts/LanguageContext";

const StatsSection = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const serviceLines = lang === "ru" ? [
    { index: "01", title: "Демонтаж", note: "Разборка и подготовка помещений", href: "/services/demolition" },
    { index: "02", title: "Монтаж", note: "Конструкции и инженерные задачи", href: "/services/construction" },
    { index: "03", title: "Комплексные работы", note: "Несколько этапов в одном плане", href: "/services" },
  ] : [
    { index: "01", title: "Demolition", note: "Dismantling and site preparation", href: "/services/demolition" },
    { index: "02", title: "Installation", note: "Structures and engineering works", href: "/services/construction" },
    { index: "03", title: "Integrated works", note: "Multiple stages in one coordinated plan", href: "/services" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20" aria-labelledby="skol-format-title">
      <AnimatedSection>
        <div className="skol-format-panel relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#242629] px-5 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
            <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/[0.045]" />
            <div className="absolute -right-8 -top-20 h-56 w-56 rounded-full border border-white/[0.045]" />
            <div className="absolute bottom-0 left-0 h-px w-2/3 bg-gradient-to-r from-primary/70 via-white/10 to-transparent" />
          </div>
          <div className="relative grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div className="flex flex-col items-start justify-between gap-6">
              <div>
                <p className="skol-section-label mb-4 text-primary">SKOL / SCOPE</p>
                <h2 id="skol-format-title" className="max-w-lg font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                  {lang === "ru" ? "От отдельных задач" : "From individual tasks"}
                  <span className="block text-white/55">{lang === "ru" ? "до комплексного объекта" : "to a complete project"}</span>
                </h2>
              </div>
              <button type="button" onClick={() => navigate("/services")} className="group inline-flex items-center gap-2 border-b border-white/25 pb-2 text-sm font-medium text-white transition-colors hover:border-primary">
                {lang === "ru" ? "Смотреть все услуги" : "Explore all services"}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>
            <div className="divide-y divide-white/10">
              {serviceLines.map((line, index) => (
                <motion.button
                  key={line.index}
                  type="button"
                  onClick={() => navigate(line.href)}
                  aria-label={`${line.title}: ${line.note}`}
                  className="group flex w-full items-center gap-4 py-5 text-left sm:gap-6 sm:py-6"
                  initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: reduceMotion ? 0 : index * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={reduceMotion ? undefined : { x: 4 }}
                >
                  <span className="font-mono text-xs text-primary/90">{line.index}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-medium text-white transition-colors group-hover:text-primary sm:text-xl">{line.title}</span>
                    <span className="mt-1 block text-sm text-white/50">{line.note}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default StatsSection;
