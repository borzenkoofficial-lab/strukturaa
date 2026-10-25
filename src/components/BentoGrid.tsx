import { motion } from "framer-motion";
import { ArrowUpRight, Building2, ClipboardList, HardHat, Layers3, Ruler, Truck } from "lucide-react";
import heroDemolition from "@/assets/hero-demolition.jpg";
import serviceConstruction from "@/assets/service-construction.jpg";
import serviceRenovation from "@/assets/service-renovation.jpg";
import projectIndustrial from "@/assets/project-industrial-demo.jpg";
import projectWaste from "@/assets/project-waste-removal.jpg";
import AnimatedSection from "./AnimatedSection";
import { useNavigate } from "react-router-dom";

const serviceCards = [
  {
    number: "01",
    title: "Демонтаж",
    description: "Разборка конструкций и подготовка помещений к следующему этапу работ.",
    image: heroDemolition,
    alt: "Демонтажные работы на объекте",
    path: "/services/demolition",
    size: "lg:col-span-2 lg:row-span-2",
  },
  {
    number: "02",
    title: "Монтаж конструкций",
    description: "Монтажные работы по согласованному составу и условиям площадки.",
    image: serviceConstruction,
    alt: "Строительные и монтажные работы",
    path: "/services",
    size: "",
  },
  {
    number: "03",
    title: "Ремонт и отделка",
    description: "Подготовка и отделочные работы для коммерческих и частных объектов.",
    image: serviceRenovation,
    alt: "Отделочные работы",
    path: "/services",
    size: "",
  },
  {
    number: "04",
    title: "Вывоз отходов",
    description: "Планирование погрузки и вывоза с учётом объёма и доступа к объекту.",
    image: projectWaste,
    alt: "Вывоз строительных отходов",
    path: "/services",
    size: "",
  },
];

const BentoGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:pb-20" aria-labelledby="skol-work-heading">
      <AnimatedSection>
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-border/60 pb-5 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <p className="skol-section-label mb-3 text-primary">СКОЛ / НАПРАВЛЕНИЯ</p>
            <h2 id="skol-work-heading" className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Работы, которые можно собрать в единый план
            </h2>
          </div>
          <button onClick={() => navigate("/services")} className="group inline-flex w-fit items-center gap-2 border-b border-foreground/25 pb-2 text-sm font-medium text-foreground transition-colors hover:border-primary">
            Все направления <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(220px,auto)] lg:gap-4">
        {serviceCards.map((card, index) => (
          <AnimatedSection key={card.number} delay={index * 0.07} className={card.size}>
            <motion.button
              type="button"
              onClick={() => navigate(card.path)}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.25 }}
              className={`group relative flex min-h-[240px] w-full flex-col justify-end overflow-hidden border border-border/70 bg-card text-left sm:min-h-[280px] ${card.size.includes("row-span-2") ? "lg:min-h-[460px]" : ""}`}
            >
              <img src={card.image} alt={card.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17181a]/95 via-[#17181a]/45 to-[#17181a]/5" />
              <div className="absolute inset-0 border border-white/0 transition-colors group-hover:border-white/20" />
              <div className="relative z-10 p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-xs tracking-widest text-white/65">{card.number} / 04</span>
                  <span className="flex h-9 w-9 items-center justify-center border border-white/25 text-white transition-colors group-hover:border-white/60"><ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">{card.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/75">{card.description}</p>
              </div>
            </motion.button>
          </AnimatedSection>
        ))}
        <AnimatedSection delay={0.28} className="lg:col-span-2">
          <div className="relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden border border-border/70 bg-[#242629] p-5 sm:p-7">
            <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-40" aria-hidden="true">
              <div className="absolute right-[-5rem] top-[-5rem] h-64 w-64 rounded-full border border-white/15" />
              <div className="absolute right-[-1rem] top-[-1rem] h-48 w-48 rounded-full border border-white/10" />
              <div className="absolute inset-0 bg-gradient-to-l from-[#702d3b]/25 to-transparent" />
            </div>
            <div className="relative flex items-center justify-between">
              <span className="skol-section-label text-white/55">ФОРМАТ РАБОТЫ</span>
              <Layers3 className="h-5 w-5 text-[#b7838d]" />
            </div>
            <div className="relative mt-8">
              <h3 className="max-w-lg font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">От отдельной задачи до нескольких этапов</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">Согласуем границы работ, последовательность и ответственность до старта. Объём и стоимость определяются после уточнения условий объекта.</p>
              <button onClick={() => navigate("/contacts")} className="mt-5 inline-flex items-center gap-2 border-b border-white/35 pb-2 text-sm font-medium text-white transition-colors hover:border-white">
                Обсудить объект <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.35} className="lg:col-span-2">
          <div className="relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden border border-border/70 bg-card p-5 sm:p-7">
            <div className="relative flex items-center justify-between">
              <span className="skol-section-label text-muted-foreground">ПОРЯДОК РАБОТ</span>
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div className="relative mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { title: "Оценка", detail: "Уточняем задачу" },
                { title: "Смета", detail: "Фиксируем объём" },
                { title: "Выполнение", detail: "Работаем по этапам" },
              ].map((step, i) => (
                <div key={step.title} className="border-l border-primary/70 pl-3">
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground">0{i + 1}</span>
                  <p className="mt-2 text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.detail}</p>
                </div>
              ))}
            </div>
            <div className="relative mt-5 flex items-center justify-between border-t border-border/60 pt-4">
              <span className="text-xs text-muted-foreground">Москва и Московская область</span>
              <button onClick={() => navigate("/contacts")} className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">Запросить расчёт <ArrowUpRight className="h-4 w-4" /></button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default BentoGrid;
