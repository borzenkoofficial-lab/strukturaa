import { ArrowUpRight } from "lucide-react";
import heroDemolition from "@/assets/hero-demolition.jpg";
import serviceConstruction from "@/assets/service-construction.jpg";
import serviceRenovation from "@/assets/service-renovation.jpg";

const services = [
  { title: "Демонтаж зданий", desc: "Полный и частичный демонтаж любой сложности", image: heroDemolition, color: "bg-primary/10" },
  { title: "Строительство", desc: "Возведение объектов под ключ", image: serviceConstruction, color: "bg-secondary" },
  { title: "Ремонт и отделка", desc: "Капитальный и косметический ремонт", image: serviceRenovation, color: "bg-accent/10" },
];

const ServicesSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground">Наши услуги</h2>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Все услуги <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.title} className="glass-card-hover overflow-hidden group cursor-pointer">
            <div className="aspect-[4/3] overflow-hidden rounded-t-2xl">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-display font-semibold text-foreground">{service.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
