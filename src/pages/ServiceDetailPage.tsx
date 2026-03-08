import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator, Phone, Mail, CheckCircle2, Ruler, Clock, Shield } from "lucide-react";
import { useState, useMemo } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";

interface ServiceData {
  slug: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  price: string;
  priceUnit: string;
  priceValue: number;
  minArea: number;
  maxArea: number;
  duration: { ru: string; en: string };
  features: { ru: string; en: string }[];
  details: { ru: string; en: string };
  includes: { ru: string; en: string }[];
}

const servicesData: ServiceData[] = [
  {
    slug: "demolition",
    titleKey: "services.demolition",
    descKey: "services.demolitionDesc",
    price: "500₽/м²",
    priceUnit: "м²",
    priceValue: 500,
    minArea: 10,
    maxArea: 5000,
    duration: { ru: "от 3 дней", en: "from 3 days" },
    features: [
      { ru: "Механизированный снос", en: "Mechanized demolition" },
      { ru: "Ручной демонтаж", en: "Manual demolition" },
      { ru: "Работа на высоте", en: "High-altitude work" },
      { ru: "Сертифицированная техника", en: "Certified equipment" },
    ],
    details: {
      ru: "Мы выполняем полный и частичный демонтаж зданий любой сложности — от небольших построек до масштабных промышленных объектов. Используем современную технику: экскаваторы с гидромолотами, погрузчики, самосвалы. Все работы выполняются в соответствии с требованиями безопасности и экологическими нормами. Перед началом работ проводим техническое обследование объекта и составляем подробный план демонтажа.",
      en: "We perform full and partial demolition of buildings of any complexity — from small structures to large-scale industrial facilities. We use modern equipment: excavators with hydraulic hammers, loaders, dump trucks. All work is carried out in accordance with safety requirements and environmental standards. Before starting work, we conduct a technical survey and prepare a detailed demolition plan.",
    },
    includes: [
      { ru: "Выезд специалиста для оценки", en: "Specialist visit for assessment" },
      { ru: "Составление плана демонтажа", en: "Demolition plan preparation" },
      { ru: "Получение разрешений", en: "Obtaining permits" },
      { ru: "Демонтажные работы", en: "Demolition work" },
      { ru: "Вывоз строительного мусора", en: "Construction waste removal" },
      { ru: "Уборка территории", en: "Site cleanup" },
    ],
  },
  {
    slug: "construction",
    titleKey: "services.construction",
    descKey: "services.constructionDesc",
    price: "1200₽/м²",
    priceUnit: "м²",
    priceValue: 1200,
    minArea: 10,
    maxArea: 3000,
    duration: { ru: "от 7 дней", en: "from 7 days" },
    features: [
      { ru: "Металлоконструкции", en: "Metal structures" },
      { ru: "Железобетонные элементы", en: "Reinforced concrete" },
      { ru: "Сборные конструкции", en: "Prefab structures" },
      { ru: "Проектирование", en: "Engineering design" },
    ],
    details: {
      ru: "Профессиональный монтаж конструкций любой сложности. Мы работаем с металлоконструкциями, железобетонными элементами и сборными конструкциями. Наши инженеры обеспечивают точность монтажа и соблюдение всех строительных норм. Используем современные крановые установки и сварочное оборудование.",
      en: "Professional assembly of structures of any complexity. We work with metal structures, reinforced concrete elements and prefab structures. Our engineers ensure installation accuracy and compliance with all building codes. We use modern crane installations and welding equipment.",
    },
    includes: [
      { ru: "Проектная документация", en: "Project documentation" },
      { ru: "Доставка материалов", en: "Material delivery" },
      { ru: "Монтажные работы", en: "Assembly work" },
      { ru: "Контроль качества", en: "Quality control" },
      { ru: "Сдача объекта", en: "Object handover" },
    ],
  },
  {
    slug: "renovation",
    titleKey: "services.renovation",
    descKey: "services.renovationDesc",
    price: "800₽/м²",
    priceUnit: "м²",
    priceValue: 800,
    minArea: 10,
    maxArea: 2000,
    duration: { ru: "от 14 дней", en: "from 14 days" },
    features: [
      { ru: "Капитальный ремонт", en: "Major renovation" },
      { ru: "Косметический ремонт", en: "Cosmetic renovation" },
      { ru: "Дизайн-проект", en: "Design project" },
      { ru: "Под ключ", en: "Turnkey" },
    ],
    details: {
      ru: "Выполняем капитальный и косметический ремонт квартир, офисов и коммерческих помещений. От разработки дизайн-проекта до финишной отделки — все работы под ключ. Используем качественные материалы проверенных производителей. Гарантия на все виды работ — 3 года.",
      en: "We perform major and cosmetic renovation of apartments, offices and commercial spaces. From design project development to finishing — all work is turnkey. We use quality materials from proven manufacturers. Warranty on all types of work — 3 years.",
    },
    includes: [
      { ru: "Замеры и дизайн-проект", en: "Measurements and design project" },
      { ru: "Черновые работы", en: "Rough work" },
      { ru: "Чистовая отделка", en: "Finish work" },
      { ru: "Электрика и сантехника", en: "Electrical and plumbing" },
      { ru: "Уборка после ремонта", en: "Post-renovation cleanup" },
    ],
  },
  {
    slug: "apartment-demolition",
    titleKey: "services.apartmentDemo",
    descKey: "services.apartmentDemoDesc",
    price: "400₽/м²",
    priceUnit: "м²",
    priceValue: 400,
    minArea: 10,
    maxArea: 500,
    duration: { ru: "от 1 дня", en: "from 1 day" },
    features: [
      { ru: "Снос перегородок", en: "Wall removal" },
      { ru: "Демонтаж полов", en: "Floor demolition" },
      { ru: "Снятие штукатурки", en: "Plaster removal" },
      { ru: "Подготовка к ремонту", en: "Renovation preparation" },
    ],
    details: {
      ru: "Демонтаж квартир — это первый этап подготовки к капитальному ремонту. Мы аккуратно разбираем перегородки, снимаем старые полы, стяжку, штукатурку. Работаем в жилых домах, соблюдая тишину в установленные часы. Весь мусор упаковываем и вывозим.",
      en: "Apartment demolition is the first stage of preparation for major renovation. We carefully disassemble partitions, remove old floors, screed, plaster. We work in residential buildings, observing quiet hours. All debris is packed and removed.",
    },
    includes: [
      { ru: "Осмотр квартиры", en: "Apartment inspection" },
      { ru: "Демонтажные работы", en: "Demolition work" },
      { ru: "Упаковка мусора", en: "Debris packaging" },
      { ru: "Вынос мусора", en: "Debris removal" },
      { ru: "Уборка помещения", en: "Room cleanup" },
    ],
  },
  {
    slug: "building-demolition",
    titleKey: "services.buildingDemo",
    descKey: "services.buildingDemoDesc",
    price: "350₽/м²",
    priceUnit: "м²",
    priceValue: 350,
    minArea: 50,
    maxArea: 20000,
    duration: { ru: "от 5 дней", en: "from 5 days" },
    features: [
      { ru: "Промышленные объекты", en: "Industrial facilities" },
      { ru: "Склады и гаражи", en: "Warehouses and garages" },
      { ru: "Механизированный снос", en: "Mechanized demolition" },
      { ru: "Рекультивация территории", en: "Land reclamation" },
    ],
    details: {
      ru: "Полный снос промышленных объектов, складов, гаражей и других строений. Выполняем механизированный и ручной демонтаж в зависимости от условий. Обеспечиваем безопасность на объекте, получаем все необходимые разрешения. После сноса проводим рекультивацию и подготовку площадки.",
      en: "Complete demolition of industrial facilities, warehouses, garages and other structures. We perform mechanized and manual demolition depending on conditions. We ensure on-site safety and obtain all necessary permits. After demolition, we carry out reclamation and site preparation.",
    },
    includes: [
      { ru: "Техническое обследование", en: "Technical survey" },
      { ru: "Разрешительная документация", en: "Permit documentation" },
      { ru: "Снос конструкций", en: "Structure demolition" },
      { ru: "Вывоз мусора", en: "Waste removal" },
      { ru: "Подготовка площадки", en: "Site preparation" },
    ],
  },
  {
    slug: "waste-removal",
    titleKey: "services.wasteRemoval",
    descKey: "services.wasteRemovalDesc",
    price: "8000₽",
    priceUnit: "контейнер",
    priceValue: 8000,
    minArea: 1,
    maxArea: 50,
    duration: { ru: "в день заказа", en: "same day" },
    features: [
      { ru: "Контейнеры 8–27 м³", en: "8–27 m³ containers" },
      { ru: "Погрузка включена", en: "Loading included" },
      { ru: "Легальная утилизация", en: "Legal disposal" },
      { ru: "Работа без выходных", en: "7 days a week" },
    ],
    details: {
      ru: "Организуем погрузку и вывоз строительного мусора контейнерами объёмом от 8 до 27 м³. Работаем ежедневно, включая выходные. Вся утилизация проводится в соответствии с законодательством РФ. Предоставляем документы об утилизации отходов.",
      en: "We organize loading and removal of construction waste in containers from 8 to 27 m³. We work daily, including weekends. All disposal is carried out in accordance with Russian legislation. We provide waste disposal documents.",
    },
    includes: [
      { ru: "Подача контейнера", en: "Container delivery" },
      { ru: "Погрузка мусора", en: "Waste loading" },
      { ru: "Транспортировка", en: "Transportation" },
      { ru: "Утилизация по закону", en: "Legal disposal" },
      { ru: "Документы об утилизации", en: "Disposal documents" },
    ],
  },
  {
    slug: "dismantling",
    titleKey: "services.dismantling",
    descKey: "services.dismantlingDesc",
    price: "600₽/м²",
    priceUnit: "м²",
    priceValue: 600,
    minArea: 5,
    maxArea: 2000,
    duration: { ru: "от 2 дней", en: "from 2 days" },
    features: [
      { ru: "Электрика", en: "Electrical" },
      { ru: "Сантехника", en: "Plumbing" },
      { ru: "Вентиляция", en: "Ventilation" },
      { ru: "Отопление", en: "Heating" },
    ],
    details: {
      ru: "Выполняем демонтаж всех видов инженерных коммуникаций: электропроводка, водоснабжение, канализация, вентиляция, отопление. Работы проводятся после безопасного отключения систем. Все материалы сортируются для последующей утилизации или переработки.",
      en: "We perform dismantling of all types of engineering utilities: electrical wiring, water supply, sewage, ventilation, heating. Work is carried out after safe system disconnection. All materials are sorted for subsequent disposal or recycling.",
    },
    includes: [
      { ru: "Отключение коммуникаций", en: "Utility disconnection" },
      { ru: "Демонтаж систем", en: "System dismantling" },
      { ru: "Сортировка материалов", en: "Material sorting" },
      { ru: "Вывоз отходов", en: "Waste removal" },
    ],
  },
  {
    slug: "diamond-cutting",
    titleKey: "services.concrete",
    descKey: "services.concreteDesc",
    price: "1500₽/м.п.",
    priceUnit: "м.п.",
    priceValue: 1500,
    minArea: 1,
    maxArea: 500,
    duration: { ru: "от 1 дня", en: "from 1 day" },
    features: [
      { ru: "Без вибрации", en: "No vibration" },
      { ru: "Без пыли", en: "No dust" },
      { ru: "Точность ±1 мм", en: "±1mm precision" },
      { ru: "Любая толщина", en: "Any thickness" },
    ],
    details: {
      ru: "Алмазное бурение и резка бетона, кирпича, железобетона — это самый точный и аккуратный способ демонтажа. Технология позволяет работать без вибрации и пыли, что критично в жилых зданиях и действующих объектах. Режем проёмы, ниши, штробы с точностью до 1 мм.",
      en: "Diamond drilling and cutting of concrete, brick, reinforced concrete is the most precise and neat demolition method. The technology allows working without vibration and dust, which is critical in residential buildings and operating facilities. We cut openings, niches, chases with precision up to 1mm.",
    },
    includes: [
      { ru: "Разметка и подготовка", en: "Marking and preparation" },
      { ru: "Алмазная резка/бурение", en: "Diamond cutting/drilling" },
      { ru: "Водоподача и пылеудаление", en: "Water supply and dust removal" },
      { ru: "Уборка после работ", en: "Post-work cleanup" },
    ],
  },
];

const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { toast } = useToast();

  const service = servicesData.find((s) => s.slug === slug);

  const [area, setArea] = useState<number[]>([100]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const isWaste = service?.slug === "waste-removal";

  const calculatedPrice = useMemo(() => {
    if (!service) return 0;
    const val = area[0];
    const base = val * service.priceValue;
    // volume discount
    if (val > 1000) return Math.round(base * 0.85);
    if (val > 500) return Math.round(base * 0.9);
    if (val > 100) return Math.round(base * 0.95);
    return base;
  }, [area, service]);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "en-US").format(n);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: lang === "ru" ? "Заявка отправлена!" : "Request sent!",
      description:
        lang === "ru"
          ? "Мы свяжемся с вами в течение 30 минут"
          : "We'll contact you within 30 minutes",
    });
    setName("");
    setPhone("");
    setMessage("");
  };

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-display font-bold text-foreground mb-4">
          {lang === "ru" ? "Услуга не найдена" : "Service not found"}
        </h1>
        <Button onClick={() => navigate("/services")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {lang === "ru" ? "Все услуги" : "All Services"}
        </Button>
      </div>
    );
  }

  const unitLabel = isWaste
    ? lang === "ru" ? "контейнеров" : "containers"
    : service.priceUnit;

  const seoTitle = lang === "ru" ? t(service.titleKey) : t(service.titleKey);
  const seoDesc = `${seoTitle} от STRUKTURA. Цена от ${service.price}. Сроки ${service.duration.ru}. Бесплатный расчёт стоимости онлайн.`;

  return (
    <>
    <SEOHead
      title={seoTitle}
      description={seoDesc}
      canonical={`/services/${service.slug}`}
    />
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Back */}
      <AnimatedSection>
        <Button
          variant="ghost"
          onClick={() => navigate("/services")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {lang === "ru" ? "Все услуги" : "All Services"}
        </Button>
      </AnimatedSection>

      {/* Hero */}
      <AnimatedSection>
        <div className="glass-card p-8 md:p-12 mb-8">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            {t(service.titleKey)}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            {t(service.descKey)}
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-semibold">
              <Ruler className="w-4 h-4" />
              {lang === "ru" ? "от" : "from"} {service.price}
            </div>
            <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-sm">
              <Clock className="w-4 h-4" />
              {service.duration[lang]}
            </div>
            <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-sm">
              <Shield className="w-4 h-4" />
              {lang === "ru" ? "Гарантия 3 года" : "3 year warranty"}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <AnimatedSection delay={0.1}>
            <div className="glass-card p-8">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                {lang === "ru" ? "Описание услуги" : "Service Description"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {service.details[lang]}
              </p>
            </div>
          </AnimatedSection>

          {/* Features */}
          <AnimatedSection delay={0.15}>
            <div className="glass-card p-8">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                {lang === "ru" ? "Преимущества" : "Features"}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {service.features.map((f, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{f[lang]}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* What's included */}
          <AnimatedSection delay={0.2}>
            <div className="glass-card p-8">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                {lang === "ru" ? "Что входит в стоимость" : "What's Included"}
              </h2>
              <div className="space-y-3">
                {service.includes.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <span className="text-muted-foreground">{item[lang]}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Right: Calculator + Order */}
        <div className="space-y-6">
          {/* Calculator */}
          <AnimatedSection delay={0.1}>
            <div className="glass-card p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-display font-bold text-foreground">
                  {lang === "ru" ? "Калькулятор стоимости" : "Cost Calculator"}
                </h3>
              </div>

              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">
                  {isWaste
                    ? lang === "ru" ? "Количество контейнеров" : "Number of containers"
                    : lang === "ru" ? `Площадь (${service.priceUnit})` : `Area (${service.priceUnit})`}
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <Input
                    type="number"
                    value={area[0]}
                    onChange={(e) => {
                      const v = Math.max(service.minArea, Math.min(service.maxArea, Number(e.target.value) || service.minArea));
                      setArea([v]);
                    }}
                    className="w-24 text-center bg-secondary border-border"
                  />
                  <span className="text-sm text-muted-foreground">{unitLabel}</span>
                </div>
                <Slider
                  value={area}
                  onValueChange={setArea}
                  min={service.minArea}
                  max={service.maxArea}
                  step={isWaste ? 1 : 5}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{service.minArea}</span>
                  <span>{service.maxArea}</span>
                </div>
              </div>

              {/* Discount info */}
              {!isWaste && area[0] > 100 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-4 p-3 rounded-xl bg-primary/10 text-sm"
                >
                  <span className="text-primary font-semibold">
                    {area[0] > 1000 ? "−15%" : area[0] > 500 ? "−10%" : "−5%"}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {lang === "ru" ? "скидка за объём" : "volume discount"}
                  </span>
                </motion.div>
              )}

              <div className="border-t border-border/30 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {lang === "ru" ? "Итого:" : "Total:"}
                  </span>
                  <motion.span
                    key={calculatedPrice}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-display font-bold text-primary"
                  >
                    {formatPrice(calculatedPrice)} ₽
                  </motion.span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {lang === "ru"
                    ? "* Точная стоимость после осмотра объекта"
                    : "* Exact price after site inspection"}
                </p>
              </div>

              {/* Order form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="font-display font-semibold text-foreground">
                  {lang === "ru" ? "Оставить заявку" : "Submit Request"}
                </h4>
                <Input
                  placeholder={lang === "ru" ? "Ваше имя" : "Your name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-secondary border-border"
                />
                <Input
                  placeholder={lang === "ru" ? "Телефон" : "Phone"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-secondary border-border"
                />
                <Textarea
                  placeholder={lang === "ru" ? "Опишите задачу" : "Describe your task"}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="bg-secondary border-border resize-none"
                />
                <Button type="submit" className="w-full">
                  {lang === "ru" ? "Отправить заявку" : "Submit Request"}
                </Button>
              </form>

              {/* Contact shortcuts */}
              <div className="mt-4 flex gap-3">
                <a
                  href="tel:+74951234567"
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {lang === "ru" ? "Позвонить" : "Call"}
                </a>
                <a
                  href="mailto:info@struktura.ru"
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
