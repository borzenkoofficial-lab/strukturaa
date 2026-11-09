import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ClipboardCheck, Layers3, HardHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedSection from "./AnimatedSection";

const FeaturesCarousel = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();

  const principles = lang === "ru" ? [
    { number: "01", icon: ClipboardCheck, title: "Понятная смета", description: "Согласуем состав работ, объёмы и стоимость до начала работ. Изменения обсуждаем отдельно, а не ставим перед фактом." },
    { number: "02", icon: Layers3, title: "Комплексный подход", description: "Демонтаж, подготовка и последующие строительные работы можно собрать в единый план — без разрозненных подрядчиков на каждом этапе." },
    { number: "03", icon: HardHat, title: "Работа по этапам", description: "Фиксируем последовательность работ и контрольные точки, чтобы заказчик понимал, что происходит на объекте и что будет дальше." },
  ] : [
    { number: "01", icon: ClipboardCheck, title: "Clear estimate", description: "We agree on scope, quantities and cost before work begins. Any changes are discussed and approved separately." },
    { number: "02", icon: Layers3, title: "Integrated delivery", description: "Demolition, preparation and follow-on construction can be coordinated in one plan instead of fragmented contractors at every stage." },
    { number: "03", icon: HardHat, title: "Controlled stages", description: "We define the sequence and checkpoints so the client knows what is happening on site and what comes next." },
  ];

  return (
    <section className="skol-principles-section relative overflow-hidden py-16 sm:py-24" aria-labelledby="skol-principles-title">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-px w-[min(88%,1200px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute right-[8%] top-12 h-64 w-64 rounded-full border border-foreground/[0.04]" />
        <div className="absolute right-[11%] top-20 h-52 w-52 rounded-full border border-foreground/[0.04]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <AnimatedSection>
          <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="skol-section-label mb-4 text-primary">SKOL / APPROACH</p>
              <h2 id="skol-principles-title" className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
                {lang === "ru" ? "Строительные работы" : "Construction work"}
                <span className="block text-muted-foreground">{lang === "ru" ? "без лишней неопределённости" : "without unnecessary uncertainty"}</span>
              </h2>
            </div>
            <button type="button" onClick={() => navigate("/contacts")} className="group inline-flex w-fit items-center gap-2 border-b border-primary/50 pb-2 text-sm font-medium text-foreground transition-colors hover:border-primary">
              {lang === "ru" ? "Обсудить объект" : "Discuss a project"}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {principles.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.number}
                className="skol-principle-card group relative flex min-h-[270px] flex-col justify-between overflow-hidden border border-border/65 bg-card/35 p-5 transition-colors duration-300 hover:border-primary/40 sm:min-h-[310px] sm:p-7"
                initial={reduceMotion ? false : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.72, delay: reduceMotion ? 0 : index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={reduceMotion ? undefined : { y: -3 }}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-foreground/[0.035] transition-transform duration-500 group-hover:scale-110" />
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md border border-border/60 bg-secondary/50 text-primary transition-colors group-hover:border-primary/35">
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </div>
                  <span className="font-mono text-xs tracking-widest text-muted-foreground/60">{item.number}</span>
                </div>
                <div className="relative mt-12 sm:mt-16">
                  <h3 className="mb-3 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{item.title}</h3>
                  <p className="max-w-sm text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesCarousel;
