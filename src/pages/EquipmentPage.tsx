import { motion } from "framer-motion";
import { ArrowLeft, Truck, HardHat, Wrench, Gauge, Shield, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";

const equipment = [
  {
    icon: Truck,
    title: { ru: "Экскаваторы", en: "Excavators" },
    count: "12",
    desc: { ru: "Гусеничные и колёсные экскаваторы массой от 3 до 45 тонн с гидромолотами, грейферами и ножницами", en: "Tracked and wheeled excavators from 3 to 45 tons with hydraulic hammers, grapples and shears" },
  },
  {
    icon: Truck,
    title: { ru: "Погрузчики", en: "Loaders" },
    count: "8",
    desc: { ru: "Фронтальные погрузчики и мини-погрузчики для работы в стеснённых условиях", en: "Front loaders and skid-steer loaders for confined spaces" },
  },
  {
    icon: Truck,
    title: { ru: "Самосвалы", en: "Dump Trucks" },
    count: "15",
    desc: { ru: "Самосвалы грузоподъёмностью 10–30 тонн для вывоза строительного мусора", en: "Dump trucks with 10-30 ton capacity for construction waste removal" },
  },
  {
    icon: HardHat,
    title: { ru: "Автокраны", en: "Cranes" },
    count: "5",
    desc: { ru: "Автомобильные краны грузоподъёмностью до 50 тонн для монтажных работ", en: "Mobile cranes with up to 50 ton capacity for assembly work" },
  },
  {
    icon: Wrench,
    title: { ru: "Алмазное оборудование", en: "Diamond Equipment" },
    count: "10+",
    desc: { ru: "Установки для алмазного бурения и резки бетона, кирпича и железобетона", en: "Diamond drilling and cutting systems for concrete, brick and reinforced concrete" },
  },
  {
    icon: Gauge,
    title: { ru: "Компрессоры и генераторы", en: "Compressors & Generators" },
    count: "8",
    desc: { ru: "Дизельные компрессоры и генераторы для автономной работы на объекте", en: "Diesel compressors and generators for autonomous on-site operation" },
  },
];

const advantages = [
  {
    icon: Shield,
    title: { ru: "Вся техника сертифицирована", en: "All equipment certified" },
    desc: { ru: "Регулярное ТО и проверка безопасности. Все допуски и разрешения в наличии.", en: "Regular maintenance and safety checks. All permits available." },
  },
  {
    icon: Gauge,
    title: { ru: "Минимальные сроки подачи", en: "Minimal delivery times" },
    desc: { ru: "Собственная техника позволяет начать работы в день обращения без ожидания аренды.", en: "Own equipment lets us start work on the same day without waiting for rentals." },
  },
  {
    icon: Wrench,
    title: { ru: "Опытные операторы", en: "Experienced operators" },
    desc: { ru: "Все машинисты имеют стаж от 5 лет и проходят регулярную аттестацию.", en: "All operators have 5+ years of experience and regular certification." },
  },
];

const EquipmentPage = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <AnimatedSection>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {lang === "ru" ? "Назад" : "Back"}
        </Button>
      </AnimatedSection>

      <AnimatedSection>
        <div className="glass-card p-6 sm:p-10 mb-8">
          <span className="px-3 py-1 rounded-lg bg-primary/15 text-xs font-medium text-primary uppercase tracking-wider">
            {lang === "ru" ? "Техника" : "Equipment"}
          </span>
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-foreground mt-4">
            {lang === "ru" ? "Собственный парк спецтехники" : "Our Equipment Fleet"}
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm sm:text-base">
            {lang === "ru"
              ? "Более 50 единиц спецтехники для выполнения работ любой сложности. Собственный парк — это гарантия оперативности, качества и конкурентных цен."
              : "Over 50 units of specialized equipment for work of any complexity. Our own fleet guarantees speed, quality and competitive prices."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-display font-bold text-primary">50+</p>
              <p className="text-xs text-muted-foreground mt-1">{lang === "ru" ? "единиц техники" : "equipment units"}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-display font-bold text-foreground">15</p>
              <p className="text-xs text-muted-foreground mt-1">{lang === "ru" ? "лет на рынке" : "years in business"}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-display font-bold text-foreground">24/7</p>
              <p className="text-xs text-muted-foreground mt-1">{lang === "ru" ? "поддержка" : "support"}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-display font-bold text-foreground">0₽</p>
              <p className="text-xs text-muted-foreground mt-1">{lang === "ru" ? "подача техники" : "delivery fee"}</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Equipment grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {equipment.map((item, i) => (
          <AnimatedSection key={i}>
            <motion.div
              className="glass-card-hover p-5 sm:p-6 h-full flex flex-col"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-2xl font-display font-bold text-primary">{item.count}</span>
              </div>
              <h3 className="text-base font-display font-semibold text-foreground">{item.title[lang]}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 flex-1">{item.desc[lang]}</p>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>

      {/* Advantages */}
      <AnimatedSection>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-5">
          {lang === "ru" ? "Преимущества собственного парка" : "Fleet Advantages"}
        </h2>
      </AnimatedSection>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {advantages.map((item, i) => (
          <AnimatedSection key={i}>
            <div className="glass-card-hover p-5 h-full">
              <item.icon className="w-6 h-6 text-primary mb-3" />
              <h3 className="text-sm font-semibold text-foreground">{item.title[lang]}</h3>
              <p className="text-xs text-muted-foreground mt-2">{item.desc[lang]}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* CTA */}
      <AnimatedSection>
        <div className="glass-card p-6 sm:p-8 text-center">
          <h3 className="text-lg sm:text-xl font-display font-bold text-foreground">
            {lang === "ru" ? "Нужна спецтехника для вашего проекта?" : "Need equipment for your project?"}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 mb-5">
            {lang === "ru"
              ? "Свяжитесь с нами — подберём оптимальный комплект техники и рассчитаем стоимость"
              : "Contact us — we'll select the optimal equipment set and calculate the cost"}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => navigate("/contacts")} className="gap-2">
              <Phone className="w-4 h-4" />
              {lang === "ru" ? "Связаться" : "Contact Us"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/services")}>
              {lang === "ru" ? "Все услуги" : "All Services"}
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default EquipmentPage;
