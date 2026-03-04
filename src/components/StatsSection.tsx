import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const stats = [
  { value: "500+", label: "Проектов выполнено", accent: false },
  { value: "15", label: "Лет на рынке", accent: false },
  { value: "98%", label: "Довольных клиентов", accent: true },
];

const StatsSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <AnimatedSection key={stat.label} delay={i * 0.15}>
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
                {stat.label}
              </span>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
