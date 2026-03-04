import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import heroDemolition from "@/assets/hero-demolition.jpg";
import serviceConstruction from "@/assets/service-construction.jpg";
import serviceRenovation from "@/assets/service-renovation.jpg";
import AnimatedSection from "./AnimatedSection";

const services = [
  { title: "Демонтаж зданий", desc: "Полный и частичный демонтаж любой сложности", image: heroDemolition },
  { title: "Строительство", desc: "Возведение объектов под ключ", image: serviceConstruction },
  { title: "Ремонт и отделка", desc: "Капитальный и косметический ремонт", image: serviceRenovation },
];

const ServicesSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatedSection>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-foreground">Наши услуги</h2>
          <motion.button
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ x: 4 }}
          >
            Все услуги <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {services.map((service, i) => (
          <AnimatedSection key={service.title} delay={i * 0.15}>
            <motion.div
              className="glass-card-hover overflow-hidden group cursor-pointer"
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-t-2xl">
                <motion.img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-foreground">{service.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{service.desc}</p>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
