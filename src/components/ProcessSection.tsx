import { motion } from "framer-motion";
import { ClipboardCheck, HardHat, Ruler, Truck } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const steps = [
  { icon: ClipboardCheck, title: "Заявка", desc: "Оставьте заявку, и мы свяжемся в течение 30 минут" },
  { icon: Ruler, title: "Оценка", desc: "Бесплатный выезд специалиста и точный расчёт стоимости" },
  { icon: HardHat, title: "Выполнение", desc: "Работы точно в срок с соблюдением всех стандартов" },
  { icon: Truck, title: "Вывоз мусора", desc: "Уборка и вывоз строительного мусора включены в стоимость" },
];

const ProcessSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <AnimatedSection>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">Как мы работаем</h2>
        <p className="text-muted-foreground mb-10">Четыре простых шага до результата</p>
      </AnimatedSection>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <AnimatedSection key={step.title} delay={i * 0.12}>
            <motion.div
              className="glass-card-hover p-6 relative overflow-hidden group"
              whileHover={{ y: -4 }}
            >
              {/* Step number */}
              <span className="absolute top-4 right-4 text-5xl font-display font-bold text-foreground/5 group-hover:text-primary/10 transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>

              {/* Connector line */}
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
