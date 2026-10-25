import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const serviceLines = [
  { index: "01", title: "Демонтаж", note: "Разборка и подготовка помещений" },
  { index: "02", title: "Монтаж", note: "Конструкции и инженерные задачи" },
  { index: "03", title: "Комплексные работы", note: "Несколько этапов в одном плане" },
];

const StatsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#242629] px-5 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
            <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/[0.045]" />
            <div className="absolute -right-8 -top-20 h-56 w-56 rounded-full border border-white/[0.045]" />
            <div className="absolute bottom-0 left-0 h-px w-2/3 bg-gradient-to-r from-primary/70 via-white/10 to-transparent" />
          </div>
          <div className="relative grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div className="flex flex-col items-start justify-between gap-6">
              <div>
                <p className="skol-section-label mb-4 text-primary">Формат сотрудничества</p>
                <h2 className="max-w-lg font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                  От отдельных задач
                  <span className="block text-white/55">до комплексного объекта</span>
                </h2>
              </div>
              <button
                onClick={() => navigate("/services")}
                className="group inline-flex items-center gap-2 border-b border-white/25 pb-2 text-sm font-medium text-white transition-colors hover:border-primary"
              >
                Смотреть все услуги
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>
            <div className="divide-y divide-white/10">
              {serviceLines.map((line, index) => (
                <motion.button
                  key={line.index}
                  onClick={() => navigate(index === 0 ? "/services/demolition" : "/services")}
                  className="group flex w-full items-center gap-4 py-5 text-left sm:gap-6 sm:py-6"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
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
