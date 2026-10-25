import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator, Phone, Mail, CheckCircle2, Ruler, Clock, Shield, Loader2, ArrowUpRight, ChevronDown, HelpCircle, Layers, FolderOpen } from "lucide-react";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import SuccessOverlay from "@/components/SuccessOverlay";

interface ServiceData {
  slug: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  priceUnit: string;
  minArea: number;
  maxArea: number;
  duration: { ru: string; en: string };
  features: { ru: string; en: string }[];
  details: { ru: string; en: string };
  includes: { ru: string; en: string }[];
  process: { ru: string; en: string }[];
  faq: { q: { ru: string; en: string }; a: { ru: string; en: string } }[];
  relatedSlugs: string[];
}

const servicesData: ServiceData[] = [
  {
    slug: "demolition",
    titleKey: "services.demolition",
    descKey: "services.demolitionDesc",
    priceUnit: "м²",
    minArea: 10,
    maxArea: 5000,
    duration: { ru: "После оценки объекта", en: "After site assessment" },
    features: [
      { ru: "Механизированный снос", en: "Mechanized demolition" },
      { ru: "Ручной демонтаж", en: "Manual demolition" },
      { ru: "Работа на высоте", en: "High-altitude work" },
      { ru: "Оборудование под задачу", en: "Equipment matched to the task" },
    ],
    details: {
      ru: "Мы выполняем полный и частичный демонтаж зданий любой сложности — от небольших построек до масштабных промышленных объектов. Используем современную технику: экскаваторы с гидромолотами, погрузчики, самосвалы. Все работы выполняются в соответствии с требованиями безопасности и экологическими нормами. Перед началом работ проводим техническое обследование объекта и составляем подробный план демонтажа.",
      en: "We perform full and partial demolition of buildings of any complexity — from small structures to large-scale industrial facilities. We use modern equipment: excavators with hydraulic hammers, loaders, dump trucks.",
    },
    includes: [
      { ru: "Выезд специалиста для оценки", en: "Specialist visit for assessment" },
      { ru: "Составление плана демонтажа", en: "Demolition plan preparation" },
      { ru: "Получение разрешений", en: "Obtaining permits" },
      { ru: "Демонтажные работы", en: "Demolition work" },
      { ru: "Вывоз строительного мусора", en: "Construction waste removal" },
      { ru: "Уборка территории", en: "Site cleanup" },
    ],
    process: [
      { ru: "Заявка и бесплатная консультация", en: "Application and free consultation" },
      { ru: "Выезд инженера на объект", en: "Engineer visit to the site" },
      { ru: "Составление сметы и плана работ", en: "Cost estimate and work plan" },
      { ru: "Заключение договора", en: "Contract signing" },
      { ru: "Выполнение демонтажных работ", en: "Demolition work execution" },
      { ru: "Вывоз мусора и уборка", en: "Waste removal and cleanup" },
      { ru: "Сдача объекта заказчику", en: "Handover to customer" },
    ],
    faq: [
      { q: { ru: "Нужно ли разрешение на демонтаж?", en: "Is a demolition permit required?" }, a: { ru: "Требования зависят от типа объекта и состава работ. Необходимые согласования определяются до начала работ.", en: "Requirements depend on the structure and scope. Necessary approvals are identified before work starts." } },
      { q: { ru: "Сколько по времени занимает демонтаж?", en: "How long does demolition take?" }, a: { ru: "Зависит от объёма: квартира 1–3 дня, здание — от 5 дней. Точные сроки определяем после осмотра объекта.", en: "Depends on volume: apartment 1–3 days, building — from 5 days." } },
      { q: { ru: "Вы вывозите мусор после демонтажа?", en: "Do you remove debris?" }, a: { ru: "Вывоз и обращение с отходами согласуются отдельно с учётом объёма и условий доступа.", en: "Waste removal and handling are agreed separately based on volume and access conditions." } },
    ],
    relatedSlugs: ["apartment-demolition", "building-demolition", "waste-removal"],
  },
  {
    slug: "construction",
    titleKey: "services.construction",
    descKey: "services.constructionDesc",
    priceUnit: "м²",
    minArea: 10,
    maxArea: 3000,
    duration: { ru: "После оценки объекта", en: "After site assessment" },
    features: [
      { ru: "Металлоконструкции", en: "Metal structures" },
      { ru: "Железобетонные элементы", en: "Reinforced concrete" },
      { ru: "Сборные конструкции", en: "Prefab structures" },
      { ru: "Проектирование", en: "Engineering design" },
    ],
    details: {
      ru: "Профессиональный монтаж конструкций любой сложности. Мы работаем с металлоконструкциями, железобетонными элементами и сборными конструкциями. Наши инженеры обеспечивают точность монтажа и соблюдение всех строительных норм. Используем современные крановые установки и сварочное оборудование.",
      en: "Professional assembly of structures of any complexity. We work with metal structures, reinforced concrete elements and prefab structures.",
    },
    includes: [
      { ru: "Проектная документация", en: "Project documentation" },
      { ru: "Доставка материалов", en: "Material delivery" },
      { ru: "Монтажные работы", en: "Assembly work" },
      { ru: "Контроль качества", en: "Quality control" },
      { ru: "Сдача объекта", en: "Object handover" },
    ],
    process: [
      { ru: "Обсуждение проекта и ТЗ", en: "Project discussion and specifications" },
      { ru: "Разработка проектной документации", en: "Project documentation development" },
      { ru: "Закупка и доставка материалов", en: "Material procurement and delivery" },
      { ru: "Монтаж конструкций", en: "Structure assembly" },
      { ru: "Проверка качества и испытания", en: "Quality check and testing" },
      { ru: "Передача готового объекта", en: "Finished object handover" },
    ],
    faq: [
      { q: { ru: "Какие конструкции вы монтируете?", en: "What structures do you assemble?" }, a: { ru: "Металлоконструкции, каркасы зданий, железобетонные элементы, сборные конструкции, фермы и балки любой сложности.", en: "Metal structures, building frames, RC elements, prefab structures." } },
      { q: { ru: "Есть ли гарантия на монтажные работы?", en: "Is there a warranty?" }, a: { ru: "Гарантийные обязательства фиксируются в договоре с учётом состава и условий работ.", en: "Warranty terms are defined in the contract based on the scope and conditions." } },
    ],
    relatedSlugs: ["renovation", "demolition", "diamond-cutting"],
  },
  {
    slug: "renovation",
    titleKey: "services.renovation",
    descKey: "services.renovationDesc",
    priceUnit: "м²",
    minArea: 10,
    maxArea: 2000,
    duration: { ru: "После оценки объекта", en: "After site assessment" },
    features: [
      { ru: "Капитальный ремонт", en: "Major renovation" },
      { ru: "Косметический ремонт", en: "Cosmetic renovation" },
      { ru: "Дизайн-проект", en: "Design project" },
      { ru: "Под ключ", en: "Turnkey" },
    ],
    details: {
      ru: "Выполняем капитальный и косметический ремонт квартир, офисов и коммерческих помещений. От разработки дизайн-проекта до финишной отделки — все работы под ключ. Используем качественные материалы проверенных производителей. Гарантийные условия согласуются в договоре.",
      en: "We perform major and cosmetic renovation of apartments, offices and commercial spaces. From design project development to finishing — all work is turnkey.",
    },
    includes: [
      { ru: "Замеры и дизайн-проект", en: "Measurements and design project" },
      { ru: "Черновые работы", en: "Rough work" },
      { ru: "Чистовая отделка", en: "Finish work" },
      { ru: "Электрика и сантехника", en: "Electrical and plumbing" },
      { ru: "Уборка после ремонта", en: "Post-renovation cleanup" },
    ],
    process: [
      { ru: "Бесплатные замеры помещения", en: "Free room measurements" },
      { ru: "Разработка дизайн-проекта", en: "Design project development" },
      { ru: "Утверждение сметы", en: "Cost estimate approval" },
      { ru: "Черновые и чистовые работы", en: "Rough and finish work" },
      { ru: "Финальная уборка и сдача", en: "Final cleanup and handover" },
    ],
    faq: [
      { q: { ru: "Сколько стоит ремонт квартиры?", en: "How much does apartment renovation cost?" }, a: { ru: "Стоимость зависит от площади и сложности: косметический от 800₽/м², капитальный от 1500₽/м². Точная цена — после осмотра.", en: "Depends on area and complexity: cosmetic from 800₽/m², major from 1500₽/m²." } },
      { q: { ru: "Вы делаете дизайн-проект?", en: "Do you make design projects?" }, a: { ru: "Возможность разработки дизайн-проекта и 3D-визуализации уточняется отдельно под задачу.", en: "Design and 3D visualization availability is confirmed separately for each project." } },
    ],
    relatedSlugs: ["apartment-demolition", "construction", "dismantling"],
  },
  {
    slug: "apartment-demolition",
    titleKey: "services.apartmentDemo",
    descKey: "services.apartmentDemoDesc",
    priceUnit: "м²",
    minArea: 10,
    maxArea: 500,
    duration: { ru: "После оценки объекта", en: "After site assessment" },
    features: [
      { ru: "Снос перегородок", en: "Wall removal" },
      { ru: "Демонтаж полов", en: "Floor demolition" },
      { ru: "Снятие штукатурки", en: "Plaster removal" },
      { ru: "Подготовка к ремонту", en: "Renovation preparation" },
    ],
    details: {
      ru: "Демонтаж квартир — это первый этап подготовки к капитальному ремонту. Мы аккуратно разбираем перегородки, снимаем старые полы, стяжку, штукатурку. Работаем в жилых домах, соблюдая тишину в установленные часы. Весь мусор упаковываем и вывозим.",
      en: "Apartment demolition is the first stage of preparation for major renovation.",
    },
    includes: [
      { ru: "Осмотр квартиры", en: "Apartment inspection" },
      { ru: "Демонтажные работы", en: "Demolition work" },
      { ru: "Упаковка мусора", en: "Debris packaging" },
      { ru: "Вынос мусора", en: "Debris removal" },
      { ru: "Уборка помещения", en: "Room cleanup" },
    ],
    process: [
      { ru: "Осмотр квартиры и оценка", en: "Apartment inspection and assessment" },
      { ru: "Согласование объёма работ", en: "Work scope agreement" },
      { ru: "Подготовка и защита поверхностей", en: "Surface preparation and protection" },
      { ru: "Демонтажные работы", en: "Demolition work" },
      { ru: "Вывоз мусора и уборка", en: "Waste removal and cleanup" },
    ],
    faq: [
      { q: { ru: "Работаете ли вы в выходные?", en: "Do you work on weekends?" }, a: { ru: "Да, но в жилых домах соблюдаем режим тишины: с 9:00 до 19:00 в будни, с 10:00 до 18:00 в выходные.", en: "Yes, but we observe quiet hours in residential buildings." } },
      { q: { ru: "Нужно ли согласование с УК?", en: "Is management company approval needed?" }, a: { ru: "Для перепланировки — да. Мы поможем с оформлением документов.", en: "For replanning — yes. We'll help with documentation." } },
    ],
    relatedSlugs: ["renovation", "waste-removal", "dismantling"],
  },
  {
    slug: "building-demolition",
    titleKey: "services.buildingDemo",
    descKey: "services.buildingDemoDesc",
    priceUnit: "м²",
    minArea: 50,
    maxArea: 20000,
    duration: { ru: "После оценки объекта", en: "After site assessment" },
    features: [
      { ru: "Промышленные объекты", en: "Industrial facilities" },
      { ru: "Склады и гаражи", en: "Warehouses and garages" },
      { ru: "Механизированный снос", en: "Mechanized demolition" },
      { ru: "Рекультивация территории", en: "Land reclamation" },
    ],
    details: {
      ru: "Полный снос промышленных объектов, складов, гаражей и других строений. Выполняем механизированный и ручной демонтаж в зависимости от условий. Обеспечиваем безопасность на объекте, получаем все необходимые разрешения. После сноса проводим рекультивацию и подготовку площадки.",
      en: "Complete demolition of industrial facilities, warehouses, garages and other structures.",
    },
    includes: [
      { ru: "Техническое обследование", en: "Technical survey" },
      { ru: "Разрешительная документация", en: "Permit documentation" },
      { ru: "Снос конструкций", en: "Structure demolition" },
      { ru: "Вывоз мусора", en: "Waste removal" },
      { ru: "Подготовка площадки", en: "Site preparation" },
    ],
    process: [
      { ru: "Техническое обследование объекта", en: "Technical survey" },
      { ru: "Получение разрешительной документации", en: "Obtaining permits" },
      { ru: "Подготовка площадки и ограждение", en: "Site preparation and fencing" },
      { ru: "Механизированный демонтаж", en: "Mechanized demolition" },
      { ru: "Вывоз и утилизация отходов", en: "Waste removal and disposal" },
      { ru: "Рекультивация территории", en: "Land reclamation" },
    ],
    faq: [
      { q: { ru: "Какую технику вы используете?", en: "What equipment do you use?" }, a: { ru: "Экскаваторы с гидромолотами, ножницами по металлу, погрузчики, самосвалы 20–30 тонн.", en: "Excavators with hydraulic hammers, metal shears, loaders, 20-30 ton dump trucks." } },
      { q: { ru: "Можете ли снести здание рядом с другими постройками?", en: "Can you demolish a building near other structures?" }, a: { ru: "Да, мы выполняем селективный демонтаж с максимальной аккуратностью, применяя ручные и малогабаритные методы.", en: "Yes, we perform selective demolition with maximum care." } },
    ],
    relatedSlugs: ["demolition", "waste-removal", "dismantling"],
  },
  {
    slug: "waste-removal",
    titleKey: "services.wasteRemoval",
    descKey: "services.wasteRemovalDesc",
    priceUnit: "контейнер",
    minArea: 1,
    maxArea: 50,
    duration: { ru: "После оценки объекта", en: "After site assessment" },
    features: [
      { ru: "Контейнеры 8–27 м³", en: "8–27 m³ containers" },
      { ru: "Погрузка включена", en: "Loading included" },
      { ru: "Легальная утилизация", en: "Legal disposal" },
      { ru: "Работа без выходных", en: "7 days a week" },
    ],
    details: {
      ru: "Организуем погрузку и вывоз строительного мусора контейнерами объёмом от 8 до 27 м³. Работаем ежедневно, включая выходные. Вся утилизация проводится в соответствии с законодательством РФ. Предоставляем документы об утилизации отходов.",
      en: "We organize loading and removal of construction waste in containers from 8 to 27 m³.",
    },
    includes: [
      { ru: "Подача контейнера", en: "Container delivery" },
      { ru: "Погрузка мусора", en: "Waste loading" },
      { ru: "Транспортировка", en: "Transportation" },
      { ru: "Утилизация по закону", en: "Legal disposal" },
      { ru: "Документы об утилизации", en: "Disposal documents" },
    ],
    process: [
      { ru: "Оформление заявки", en: "Application processing" },
      { ru: "Подача контейнера на объект", en: "Container delivery to site" },
      { ru: "Погрузка строительного мусора", en: "Construction waste loading" },
      { ru: "Транспортировка на полигон", en: "Transportation to landfill" },
      { ru: "Выдача документов об утилизации", en: "Disposal document issuance" },
    ],
    faq: [
      { q: { ru: "Какой объём контейнера выбрать?", en: "What container size to choose?" }, a: { ru: "Для 1-комнатной квартиры — 8 м³, для 2–3 комнатной — 15 м³, для дома или промобъекта — 20–27 м³.", en: "For 1-room apartment — 8m³, 2-3 room — 15m³, house/industrial — 20-27m³." } },
      { q: { ru: "Как быстро подадите контейнер?", en: "How fast can you deliver?" }, a: { ru: "В большинстве случаев — в течение 2–4 часов после оформления заявки.", en: "Usually within 2-4 hours after application." } },
    ],
    relatedSlugs: ["demolition", "apartment-demolition", "building-demolition"],
  },
  {
    slug: "dismantling",
    titleKey: "services.dismantling",
    descKey: "services.dismantlingDesc",
    priceUnit: "м²",
    minArea: 5,
    maxArea: 2000,
    duration: { ru: "После оценки объекта", en: "After site assessment" },
    features: [
      { ru: "Электрика", en: "Electrical" },
      { ru: "Сантехника", en: "Plumbing" },
      { ru: "Вентиляция", en: "Ventilation" },
      { ru: "Отопление", en: "Heating" },
    ],
    details: {
      ru: "Выполняем демонтаж всех видов инженерных коммуникаций: электропроводка, водоснабжение, канализация, вентиляция, отопление. Работы проводятся после безопасного отключения систем. Все материалы сортируются для последующей утилизации или переработки.",
      en: "We perform dismantling of all types of engineering utilities: electrical wiring, water supply, sewage, ventilation, heating.",
    },
    includes: [
      { ru: "Отключение коммуникаций", en: "Utility disconnection" },
      { ru: "Демонтаж систем", en: "System dismantling" },
      { ru: "Сортировка материалов", en: "Material sorting" },
      { ru: "Вывоз отходов", en: "Waste removal" },
    ],
    process: [
      { ru: "Обследование инженерных систем", en: "Engineering systems survey" },
      { ru: "Безопасное отключение", en: "Safe disconnection" },
      { ru: "Демонтаж коммуникаций", en: "Utility dismantling" },
      { ru: "Сортировка и утилизация", en: "Sorting and disposal" },
    ],
    faq: [
      { q: { ru: "Демонтируете ли вы старую проводку?", en: "Do you remove old wiring?" }, a: { ru: "Да, выполняем полный демонтаж электрики с заменой распределительных коробок и щитков.", en: "Yes, we perform full electrical dismantling." } },
      { q: { ru: "Можно демонтировать только часть коммуникаций?", en: "Can you dismantle only part?" }, a: { ru: "Конечно, мы выполним демонтаж именно тех систем, которые вам нужно заменить.", en: "Of course, we'll dismantle only the systems you need replaced." } },
    ],
    relatedSlugs: ["apartment-demolition", "renovation", "waste-removal"],
  },
  {
    slug: "diamond-cutting",
    titleKey: "services.concrete",
    descKey: "services.concreteDesc",
    priceUnit: "м.п.",
    minArea: 1,
    maxArea: 500,
    duration: { ru: "После оценки объекта", en: "After site assessment" },
    features: [
      { ru: "Без вибрации", en: "No vibration" },
      { ru: "Без пыли", en: "No dust" },
      { ru: "Точность ±1 мм", en: "±1mm precision" },
      { ru: "Любая толщина", en: "Any thickness" },
    ],
    details: {
      ru: "Алмазное бурение и резка бетона, кирпича, железобетона — это самый точный и аккуратный способ демонтажа. Технология позволяет работать без вибрации и пыли, что критично в жилых зданиях и действующих объектах. Режем проёмы, ниши, штробы с точностью до 1 мм.",
      en: "Diamond drilling and cutting of concrete, brick, reinforced concrete is the most precise and neat demolition method.",
    },
    includes: [
      { ru: "Разметка и подготовка", en: "Marking and preparation" },
      { ru: "Алмазная резка/бурение", en: "Diamond cutting/drilling" },
      { ru: "Водоподача и пылеудаление", en: "Water supply and dust removal" },
      { ru: "Уборка после работ", en: "Post-work cleanup" },
    ],
    process: [
      { ru: "Замеры и разметка", en: "Measurements and marking" },
      { ru: "Подключение водоподачи", en: "Water supply connection" },
      { ru: "Алмазная резка / бурение", en: "Diamond cutting / drilling" },
      { ru: "Контроль точности", en: "Precision control" },
      { ru: "Уборка и сдача результата", en: "Cleanup and result handover" },
    ],
    faq: [
      { q: { ru: "Какую толщину бетона можно резать?", en: "What concrete thickness can be cut?" }, a: { ru: "До 1500 мм — стены, перекрытия, фундаменты. Для больших толщин применяем канатную резку.", en: "Up to 1500mm — walls, slabs, foundations." } },
      { q: { ru: "Можно ли резать в жилом доме?", en: "Can you cut in a residential building?" }, a: { ru: "Да, технология безвибрационная и практически бесшумная. Подходит для многоквартирных домов.", en: "Yes, the technology is vibration-free and nearly silent." } },
    ],
    relatedSlugs: ["demolition", "apartment-demolition", "construction"],
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
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedService, setSubmittedService] = useState<string | null>(null);
  const [submittedPrice, setSubmittedPrice] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isWaste = service?.slug === "waste-removal";

  const calculatedPrice = 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke("notify-request", {
        body: {
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim() || null,
          service: service ? t(service.titleKey) : null,
          calculated_price: null,
          source: "service_page",
        },
      });
      if (error) throw error;

      setSubmittedService(service ? t(service.titleKey) : null);
      setSubmittedPrice(null);
      setShowSuccess(true);
      setName("");
      setPhone("");
      setMessage("");
    } catch {
      toast({
        title: lang === "ru" ? "Ошибка" : "Error",
        description: lang === "ru" ? "Попробуйте позвонить: +7 (936) 666-99-58" : "Please try calling us",
        variant: "destructive",
      });
    }
    setSubmitting(false);
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

  const relatedServices = service.relatedSlugs
    .map(s => servicesData.find(sd => sd.slug === s))
    .filter(Boolean) as ServiceData[];

  const seoTitle = t(service.titleKey);
  const seoDesc = `${t(service.descKey)} Состав и стоимость работ уточняются после оценки условий объекта.`;

  return (
    <>
    <SuccessOverlay
      open={showSuccess}
      onClose={() => setShowSuccess(false)}
      service={submittedService}
      price={submittedPrice}
    />
    <SEOHead title={seoTitle} description={seoDesc} canonical={`/services/${service.slug}`} />
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Back */}
      <AnimatedSection>
        <Button variant="ghost" onClick={() => navigate("/services")} className="mb-6 text-muted-foreground hover:text-foreground">
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
              {lang === "ru" ? "Расчёт по объекту" : "Site-specific estimate"}
            </div>
            <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-sm">
              <Clock className="w-4 h-4" />
              {service.duration[lang]}
            </div>
            <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-sm">
              <Shield className="w-4 h-4" />
              {lang === "ru" ? "Условия по договорённости" : "Terms agreed per project"}
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

          {/* Process / How we work */}
          <AnimatedSection delay={0.25}>
            <div className="glass-card p-8">
              <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                {lang === "ru" ? "Как мы работаем" : "How We Work"}
              </h2>
              <div className="relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border/50" />
                <div className="space-y-6">
                  {service.process.map((step, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-4 relative"
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 z-10">
                        {i + 1}
                      </div>
                      <div className="pt-1">
                        <span className="text-foreground font-medium">{step[lang]}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* FAQ */}
          <AnimatedSection delay={0.3}>
            <div className="glass-card p-8">
              <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                {lang === "ru" ? "Частые вопросы" : "FAQ"}
              </h2>
              <div className="space-y-3">
                {service.faq.map((item, i) => (
                  <div key={i} className="border border-border/30 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
                    >
                      <span className="text-sm font-medium text-foreground pr-4">{item.q[lang]}</span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="px-4 pb-4"
                      >
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.a[lang]}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Portfolio tile */}
          <AnimatedSection delay={0.35}>
            <motion.div
              className="glass-card p-8 cursor-pointer group hover:border-primary/30 transition-colors"
              whileHover={{ y: -4 }}
              onClick={() => navigate("/projects")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                    <FolderOpen className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground text-lg">
                      {lang === "ru" ? "Наше портфолио" : "Our Portfolio"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {lang === "ru" ? "Посмотрите примеры выполненных работ по данной услуге" : "See examples of completed work for this service"}
                    </p>
                  </div>
                </div>
                <motion.div whileHover={{ rotate: 45 }} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-secondary-foreground" />
                </motion.div>
              </div>
            </motion.div>
          </AnimatedSection>

          {/* Related services */}
          {relatedServices.length > 0 && (
            <AnimatedSection delay={0.4}>
              <div className="glass-card p-8">
                <h2 className="text-xl font-display font-bold text-foreground mb-6">
                  {lang === "ru" ? "Похожие услуги" : "Related Services"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedServices.map((rs) => (
                    <motion.div
                      key={rs.slug}
                      className="p-4 rounded-xl bg-secondary/50 border border-border/30 cursor-pointer hover:border-primary/30 transition-colors group"
                      whileHover={{ y: -3 }}
                      onClick={() => navigate(`/services/${rs.slug}`)}
                    >
                      <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {t(rs.titleKey)}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{t(rs.descKey)}</p>
                      <span className="text-xs font-semibold text-primary">{lang === "ru" ? "По смете" : "By estimate"}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>

        {/* Right: Calculator + Order */}
        <div className="space-y-6">
          <AnimatedSection delay={0.1}>
            <div className="glass-card p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-display font-bold text-foreground">
                  {lang === "ru" ? "Параметры объекта" : "Site details"}
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

              {false && !isWaste && area[0] > 100 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-4 p-3 rounded-xl bg-primary/10 text-sm"
                >
                  <span className="text-primary font-semibold">
                    {area[0] > 1000 ? "−15%" : area[0] > 500 ? "−10%" : "−5%"}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {lang === "ru" ? "параметр для оценки объёма" : "scope assessment factor"}
                  </span>
                </motion.div>
              )}

              <div className="border-t border-border/30 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {lang === "ru" ? "Стоимость:" : "Cost:"}
                  </span>
                  <motion.span
                    key={calculatedPrice}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-display font-bold text-primary"
                  >
                    {lang === "ru" ? "После оценки" : "After assessment"}
                  </motion.span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {lang === "ru"
                    ? "Стоимость определяется после уточнения состава работ, материалов и условий площадки"
                    : "Cost is confirmed after clarifying scope, materials and site conditions"}
                </p>
              </div>

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
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" />{lang === "ru" ? "Отправляем..." : "Sending..."}</>
                  ) : (
                    lang === "ru" ? "Отправить заявку" : "Submit Request"
                  )}
                </Button>
              </form>

              <div className="mt-4 flex gap-3">
                <a
                  href="tel:+79366669958"
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {lang === "ru" ? "Позвонить" : "Call"}
                </a>
                <a
                  href="mailto:borzenkos@vk.com"
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
    </>
  );
};

export default ServiceDetailPage;
