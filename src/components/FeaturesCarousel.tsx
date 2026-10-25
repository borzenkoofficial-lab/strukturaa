import { motion } from "framer-motion";
import { ArrowUpRight, ClipboardCheck, Layers3, HardHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const principles = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Понятная смета",
    description: "Согласуем состав работ, объёмы и стоимость до начала работ. Изменения обсуждаем отдельно, а не ставим перед фактом.",
  },
  {
    number: "02",
    icon: Layers3,
    title: "Комплексный подход",
    description: "Демонтаж, подготовка и последующие строительные работы можно собрать в единый план — без разрозненных подрядчиков на каждом этапе.",
  },
  {
    number: "03",
    icon: HardHat,
    title: "Работа по этапам",
    description: "Фиксируем последовательность работ и контрольные точки, чтобы заказчик понимал, что происходит на объекте и что будет дальше.",
  },
];

const FeaturesCarousel = () => {
  const navigate = useNavigate();

  return (
    <section className="skol-principles-section relative overflow-hidden py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-px w-[min(88%,1200px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute right-[8%] top-12 h-64 w-64 rounded-full border border-foreground/[0.04]" />
        <div className="absolute right-[11%] top-20 h-52 w-52 rounded-full border border-foreground/[0.04]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <AnimatedSection>
          <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="skol-section-label mb-4 text-primary">Подход СКОЛ</p>
              <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
                Строительные работы
                <span className="block text-muted-foreground">без лишней неопределённости</span>
              </h2>
            </div>
            <button
              onClick={() => navigate("/contacts")}
              className="group inline-flex w-fit items-center gap-2 border-b border-primary/50 pb-2 text-sm font-medium text-foreground transition-colors hover:border-primary"
            >
              Обсудить объект
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {principles.map((item, index) => (
            <AnimatedSection key={item.number} delay={index * 0.1}>
              <motion.article
                className="skol-principle-card group relative flex h-full min-h-[250px] flex-col justify-between overflow-hidden border border-border/65 bg-card/35 p-5 transition-colors duration-300 hover:border-primary/40 sm:min-h-[300px] sm:p-7"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25 }}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-foreground/[0.035] transition-transform duration-500 group-hover:scale-110" />
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md border border-border/60 bg-secondary/50 text-primary transition-colors group-hover:border-primary/35">
                    <item.icon className="h-5 w-5" strokeWidth={1.7} />
                  </div>
                  <span className="font-mono text-xs tracking-widest text-muted-foreground/60">{item.number}</span>
                </div>
                <div className="relative mt-12 sm:mt-16">
                  <h3 className="mb-3 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{item.title}</h3>
                  <p className="max-w-sm text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              </motion.article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesCarousel;
