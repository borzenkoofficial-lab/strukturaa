import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator, Phone, Mail, CheckCircle2, Ruler, Clock, Shield, Loader2, ArrowUpRight, ChevronDown, HelpCircle, Layers, FolderOpen, Home, Bath, Paintbrush, DoorOpen, Zap, Trash2, Sofa, Grid2X2, Hammer, Package } from "lucide-react";
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
      { ru: "Уточнение необходимых согласований", en: "Clarifying required approvals" },
      { ru: "Демонтажные работы", en: "Demolition work" },
      { ru: "Вывоз строительного мусора", en: "Construction waste removal" },
      { ru: "Уборка территории", en: "Site cleanup" },
    ],
    process: [
      { ru: "Обсуждение задачи и условий", en: "Discussing the task and site conditions" },
      { ru: "Выезд инженера на объект", en: "Engineer visit to the site" },
      { ru: "Составление сметы и плана работ", en: "Cost estimate and work plan" },
      { ru: "Заключение договора", en: "Contract signing" },
      { ru: "Выполнение демонтажных работ", en: "Demolition work execution" },
      { ru: "Вывоз мусора и уборка", en: "Waste removal and cleanup" },
      { ru: "Сдача объекта заказчику", en: "Handover to customer" },
    ],
    faq: [
      { q: { ru: "Нужно ли разрешение на демонтаж?", en: "Is a demolition permit required?" }, a: { ru: "Требования зависят от типа объекта и состава работ. Необходимые согласования определяются до начала работ.", en: "Requirements depend on the structure and scope. Necessary approvals are identified before work starts." } },
      { q: { ru: "Сколько по времени занимает демонтаж?", en: "How long does demolition take?" }, a: { ru: "Срок зависит от объёма, материалов, доступа и ограничений площадки. График согласуется после оценки.", en: "Timing depends on scope, materials, access and site constraints. The schedule is agreed after assessment." } },
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
      { ru: "Замеры по согласованию", en: "Measurements by arrangement" },
      { ru: "Разработка дизайн-проекта", en: "Design project development" },
      { ru: "Утверждение сметы", en: "Cost estimate approval" },
      { ru: "Черновые и чистовые работы", en: "Rough and finish work" },
      { ru: "Финальная уборка и сдача", en: "Final cleanup and handover" },
    ],
    faq: [
      { q: { ru: "Сколько стоит ремонт квартиры?", en: "How much does apartment renovation cost?" }, a: { ru: "Стоимость зависит от площади, состояния помещения, состава работ, материалов и доступа на объект. Расчёт готовится после уточнения этих условий.", en: "Cost depends on area, room condition, scope, materials and site access. An estimate is prepared after clarifying these factors." } },
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
      { ru: "Демонтаж ненесущих перегородок после проверки", en: "Non-load-bearing partition removal after verification" },
      { ru: "Снятие покрытий, плинтусов и стяжки", en: "Removal of floor finishes, skirting and screed" },
      { ru: "Снятие штукатурки, обоев и плитки", en: "Removal of plaster, wallpaper and tiles" },
      { ru: "Демонтаж подвесных потолков и облицовки", en: "Suspended ceiling and cladding removal" },
      { ru: "Разборка сантехники и кухонных элементов", en: "Removal of sanitaryware and kitchen elements" },
      { ru: "Двери, коробки, встроенная мебель и детали", en: "Doors, frames, fitted furniture and details" },
      { ru: "Отдельно согласуем электрику и сантехнику", en: "Electrical and plumbing work scoped separately" },
      { ru: "Упаковка, вынос и вывоз по согласованию", en: "Packing, carry-out and disposal by arrangement" },
    ],
    details: {
      ru: "Комплексный демонтаж квартиры перед ремонтом: снимаем напольные покрытия и плинтусы, разбираем согласованные ненесущие перегородки, удаляем старую штукатурку, обои, плитку, подвесные потолки, дверные блоки и встроенные элементы. В санузле можно отдельно включить плитку, ванну или душевую, сантехнику, экраны и ненесущие короба. Кухню, мебель, электрику, сантехнику, окна, балкон и вынос/вывоз отходов включаем в состав по отдельному перечню. Несущие конструкции, проёмы, общедомовые системы и инженерные отключения требуют отдельной проверки и согласования — работы с ними не начинаются только на основании визуальной схемы.",
      en: "Apartment strip-out before renovation can include agreed non-load-bearing partitions, floor finishes and screed, plaster, wallpaper, tiles, suspended ceilings, door sets and fitted elements. Bathroom works may include tiles, sanitaryware, bath or shower, screens and non-structural boxing. Kitchen, furniture, electrical and plumbing work, windows, balcony finishes and waste removal are listed separately. Structural elements, openings, common-building systems and utility isolation require specific assessment and approval; a visual plan alone is not enough to authorize such work.",
    },
    includes: [
      { ru: "Осмотр квартиры и уточнение границ демонтажа", en: "Apartment inspection and confirmation of demolition limits" },
      { ru: "Согласование сохраняемых элементов и защиты проходов", en: "Agreement on retained elements and route protection" },
      { ru: "Снятие покрытий пола, плинтусов и отдельных слоёв стяжки", en: "Removal of floor finishes, skirting and agreed screed layers" },
      { ru: "Демонтаж отделки стен, плитки и потолочных систем по перечню", en: "Removal of listed wall finishes, tiles and ceiling systems" },
      { ru: "Разборка ненесущих перегородок после проверки типа конструкции", en: "Removal of non-load-bearing partitions after checking the construction type" },
      { ru: "Санузел, кухонные элементы и двери — по составу заявки", en: "Bathroom, kitchen elements and doors as specified in the request" },
      { ru: "Упаковка, вынос, погрузка и вывоз — если включены в смету", en: "Packing, carry-out, loading and removal if included in the estimate" },
      { ru: "Сбор остаточного мусора и подготовка помещения к следующему этапу", en: "Collection of remaining debris and preparation for the next stage" },
    ],
    process: [
      { ru: "Выбор зон и предварительного состава работ", en: "Select areas and preliminary scope" },
      { ru: "Уточнение материалов, доступа и сохраняемых элементов", en: "Confirm materials, access and elements to retain" },
      { ru: "Проверка конструкций и инженерных систем при необходимости", en: "Check structural elements and utilities where required" },
      { ru: "Смета, последовательность, сроки и логистика", en: "Estimate, sequence, schedule and logistics" },
      { ru: "Защита проходов и выполнение согласованного демонтажа", en: "Protect routes and perform the agreed strip-out" },
      { ru: "Уборка и передача помещения по согласованному результату", en: "Clean up and hand over the agreed result" },
    ],
    faq: [
      { q: { ru: "Можно ли демонтировать несущую стену или сделать проём?", en: "Can a load-bearing wall be removed or opened?" }, a: { ru: "Это нельзя определять по фото или плану в конфигураторе. Требуются проверка типа конструкции, проектное решение и необходимые согласования. Работы с несущими элементами в обычный состав демонтажа не включаем без отдельной подготовки.", en: "This cannot be determined from a photo or this configurator plan. The structure must be checked and the required design and approvals obtained. Structural work is not included in ordinary strip-out without separate preparation." } },
      { q: { ru: "Можно заказать только демонтаж пола или санузла?", en: "Can I order only floor or bathroom demolition?" }, a: { ru: "Да. Отметьте конкретные зоны и виды работ в интерактивном блоке выше; предварительный состав можно передать в заявку.", en: "Yes. Select specific areas and work types in the configurator above and transfer the preliminary scope to your request." } },
      { q: { ru: "Вы выносите и вывозите строительный мусор?", en: "Do you carry out and remove construction waste?" }, a: { ru: "Упаковку, вынос, погрузку и вывоз можно включить в состав работ. Объём, маршрут, работа лифта, парковка и контейнер согласуются отдельно.", en: "Packing, carry-out, loading and removal can be included. Volume, route, lift access, parking and container are agreed separately." } },
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
      ru: "Демонтаж промышленных объектов, складов, гаражей и других строений. Способ выполнения, требования к согласованиям и подготовка площадки определяются с учётом типа объекта и условий работ.",
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
      { ru: "Погрузка по согласованию", en: "Loading by arrangement" },
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
      { q: { ru: "Какую толщину бетона можно резать?", en: "What concrete thickness can be cut?" }, a: { ru: "Допустимая толщина зависит от материала, оборудования и условий площадки. Возможный метод уточняется до начала работ.", en: "Up to 1500mm — walls, slabs, foundations." } },
      { q: { ru: "Можно ли резать в жилом доме?", en: "Can you cut in a residential building?" }, a: { ru: "Алмазная резка может снизить вибрационную нагрузку по сравнению с ударным способом. Уровень шума и меры защиты оцениваются для конкретного объекта.", en: "Yes, the technology is vibration-free and nearly silent." } },
    ],
    relatedSlugs: ["demolition", "apartment-demolition", "construction"],
  },
];


type ApartmentRoomId = "all" | "living" | "bedroom" | "kitchen" | "bathroom" | "hall" | "balcony";
type ApartmentScopeSelection = { roomId: ApartmentRoomId; workId: string };

const apartmentRooms: { id: ApartmentRoomId; label: { ru: string; en: string }; code: string }[] = [
  { id: "all", label: { ru: "Вся квартира", en: "Whole apartment" }, code: "ALL" },
  { id: "living", label: { ru: "Гостиная", en: "Living room" }, code: "LIVING" },
  { id: "bedroom", label: { ru: "Спальня", en: "Bedroom" }, code: "BEDROOM" },
  { id: "kitchen", label: { ru: "Кухня", en: "Kitchen" }, code: "KITCHEN" },
  { id: "bathroom", label: { ru: "Санузел", en: "Bathroom" }, code: "BATH" },
  { id: "hall", label: { ru: "Коридор", en: "Hallway" }, code: "HALL" },
  { id: "balcony", label: { ru: "Балкон / лоджия", en: "Balcony / loggia" }, code: "BALCONY" },
];

const apartmentWorkOptions: {
  id: string;
  title: { ru: string; en: string };
  description: { ru: string; en: string };
  group: { ru: string; en: string };
  rooms: ApartmentRoomId[];
  icon: typeof Layers;
}[] = [
  {
    id: "partitions", title: { ru: "Перегородки и ненесущие стены", en: "Partitions and non-load-bearing walls" },
    description: { ru: "Разборка перегородок после проверки их типа и границ работ.", en: "Removal of partitions after their type and work limits are checked." },
    group: { ru: "Стены", en: "Walls" }, rooms: ["living", "bedroom", "kitchen", "bathroom", "hall"], icon: Home,
  },
  {
    id: "flooring", title: { ru: "Напольные покрытия", en: "Floor coverings" },
    description: { ru: "Ламинат, паркет, линолеум, ковровые покрытия и плинтусы.", en: "Laminate, parquet, linoleum, carpet and skirting boards." },
    group: { ru: "Полы", en: "Floors" }, rooms: ["all"], icon: Grid2X2,
  },
  {
    id: "screed", title: { ru: "Стяжка и наливной пол", en: "Screed and self-levelling floor" },
    description: { ru: "Удаление слоёв пола с оценкой основания и способа разборки.", en: "Removal of floor layers after checking the substrate and method." },
    group: { ru: "Полы", en: "Floors" }, rooms: ["living", "bedroom", "kitchen", "bathroom", "hall", "balcony"], icon: Hammer,
  },
  {
    id: "ceilings", title: { ru: "Потолки и подвесные системы", en: "Ceilings and suspended systems" },
    description: { ru: "Гипсокартон, подвесные конструкции, рейки и облицовка.", en: "Drywall, suspended structures, slats and cladding." },
    group: { ru: "Потолки", en: "Ceilings" }, rooms: ["all"], icon: Layers,
  },
  {
    id: "wall-finish", title: { ru: "Старая отделка стен", en: "Existing wall finishes" },
    description: { ru: "Обои, штукатурка, шпаклёвка и непрочные отделочные слои.", en: "Wallpaper, plaster, putty and loose finish layers." },
    group: { ru: "Отделка", en: "Finishes" }, rooms: ["all"], icon: Paintbrush,
  },
  {
    id: "tiles", title: { ru: "Плитка и облицовка", en: "Tiles and cladding" },
    description: { ru: "Керамическая плитка, клеевые слои и облицовка стен.", en: "Ceramic tiles, adhesive layers and wall cladding." },
    group: { ru: "Отделка", en: "Finishes" }, rooms: ["kitchen", "bathroom", "hall", "balcony"], icon: Grid2X2,
  },
  {
    id: "bathroom", title: { ru: "Комплексный демонтаж санузла", en: "Bathroom strip-out" },
    description: { ru: "Сантехника, ванна или душевая, экраны, плитка и ненесущие короба — по согласованному составу.", en: "Sanitaryware, bath or shower, screens, tiles and non-structural boxing by agreed scope." },
    group: { ru: "Санузел", en: "Bathroom" }, rooms: ["bathroom"], icon: Bath,
  },
  {
    id: "plumbing", title: { ru: "Сантехника и трубы", en: "Plumbing and pipework" },
    description: { ru: "Демонтаж оборудования и участков трубопроводов после согласованного отключения.", en: "Removal of fixtures and pipe sections after an agreed safe isolation." },
    group: { ru: "Инженерия", en: "Utilities" }, rooms: ["kitchen", "bathroom"], icon: Zap,
  },
  {
    id: "electrics", title: { ru: "Электрика и освещение", en: "Electrical and lighting" },
    description: { ru: "Светильники, выключатели и участки проводки — после обесточивания и согласования.", en: "Lights, switches and wiring sections after power isolation and approval." },
    group: { ru: "Инженерия", en: "Utilities" }, rooms: ["all"], icon: Zap,
  },
  {
    id: "doors", title: { ru: "Двери, коробки и наличники", en: "Doors, frames and architraves" },
    description: { ru: "Межкомнатные полотна, коробки, наличники и согласованные элементы проёмов.", en: "Interior door leaves, frames, architraves and agreed opening elements." },
    group: { ru: "Проёмы", en: "Openings" }, rooms: ["living", "bedroom", "kitchen", "bathroom", "hall"], icon: DoorOpen,
  },
  {
    id: "kitchen", title: { ru: "Кухня и встроенные элементы", en: "Kitchen and fitted elements" },
    description: { ru: "Фартук, гарнитур и встроенные элементы по перечню; технику и сохраняемые предметы отделяем заранее.", en: "Backsplash, cabinets and fitted elements by list; appliances and items to keep are identified beforehand." },
    group: { ru: "Кухня", en: "Kitchen" }, rooms: ["kitchen"], icon: Sofa,
  },
  {
    id: "built-ins", title: { ru: "Шкафы и встроенная мебель", en: "Wardrobes and fitted furniture" },
    description: { ru: "Разборка шкафов, ниш, стеллажей и другой мебели по согласованному перечню.", en: "Dismantling of wardrobes, niches, shelving and other listed furniture." },
    group: { ru: "Мебель", en: "Furniture" }, rooms: ["all"], icon: Sofa,
  },
  {
    id: "windows", title: { ru: "Подоконники, откосы и оконные блоки", en: "Sills, reveals and window units" },
    description: { ru: "Демонтаж только согласованных элементов с учётом фасада и требований безопасности.", en: "Removal of agreed elements subject to facade and safety constraints." },
    group: { ru: "Окна", en: "Windows" }, rooms: ["living", "bedroom", "kitchen", "balcony"], icon: Home,
  },
  {
    id: "balcony", title: { ru: "Отделка балкона / лоджии", en: "Balcony / loggia finishes" },
    description: { ru: "Внутренняя облицовка, покрытия и встроенные элементы; без вмешательства в несущие части.", en: "Internal cladding, finishes and fitted elements; no structural alterations." },
    group: { ru: "Балкон", en: "Balcony" }, rooms: ["balcony"], icon: Layers,
  },
  {
    id: "baseboards", title: { ru: "Плинтусы и мелкие элементы", en: "Skirting and small fixtures" },
    description: { ru: "Плинтусы, пороги, наличники и прочие элементы по согласованному списку.", en: "Skirting, thresholds, architraves and other listed details." },
    group: { ru: "Отделка", en: "Finishes" }, rooms: ["all"], icon: Ruler,
  },
  {
    id: "waste", title: { ru: "Упаковка, вынос и вывоз", en: "Packing, carry-out and removal" },
    description: { ru: "Объём, маршрут, лифт, парковка и формат вывоза согласуются отдельно.", en: "Volume, route, lift access, parking and disposal format are agreed separately." },
    group: { ru: "Логистика", en: "Logistics" }, rooms: ["all"], icon: Package,
  },
];

function resolveApartmentSelectionRoom(roomId: ApartmentRoomId, workId: string): ApartmentRoomId {
  if (roomId !== "all") return roomId;
  const work = apartmentWorkOptions.find((item) => item.id === workId);
  if (work && work.rooms.length === 1 && work.rooms[0] !== "all") return work.rooms[0];
  return roomId;
}

function getApartmentScopeSummary(selections: ApartmentScopeSelection[], lang: "ru" | "en") {
  if (!selections.length) return "";
  const prefix = lang === "ru" ? "Состав работ по зонам:" : "Selected work by room:";
  const lines = selections.map(({ roomId, workId }) => {
    const room = apartmentRooms.find((item) => item.id === roomId);
    const work = apartmentWorkOptions.find((item) => item.id === workId);
    return "• " + (room ? room.label[lang] : roomId) + " — " + (work ? work.title[lang] : workId);
  });
  return prefix + "\n" + lines.join("\n");
}

function ApartmentDemolitionStudio({
  lang,
  selected,
  onToggle,
  onClear,
  onSelectAll,
  onApply,
}: {
  lang: "ru" | "en";
  selected: ApartmentScopeSelection[];
  onToggle: (roomId: ApartmentRoomId, workId: string) => void;
  onClear: () => void;
  onSelectAll: (roomId: ApartmentRoomId, workIds: string[]) => void;
  onApply: () => void;
}) {
  const [activeRoom, setActiveRoom] = useState<ApartmentRoomId>("all");
  const [viewMode, setViewMode] = useState<"3d" | "plan">("3d");
  const isRu = lang === "ru";
  const activeRoomData = apartmentRooms.find((item) => item.id === activeRoom) ?? apartmentRooms[0];
  const visibleWorkOptions = apartmentWorkOptions.filter((work) =>
    activeRoom === "all" || work.rooms.includes("all") || work.rooms.includes(activeRoom)
  );
  const isSelected = (roomId: ApartmentRoomId, workId: string) => {
    const effectiveRoomId = resolveApartmentSelectionRoom(roomId, workId);
    return selected.some((item) => item.roomId === effectiveRoomId && item.workId === workId);
  };
  const roomShape = (roomId: ApartmentRoomId, x: number, y: number, width: number, height: number, label: string) => {
    const active = activeRoom === roomId;
    return (
      <g key={roomId} role="button" tabIndex={0} aria-label={label} aria-pressed={active}
        onClick={() => setActiveRoom(roomId)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setActiveRoom(roomId);
          }
        }}
        style={{ cursor: "pointer", outline: "none" }}>
        <rect x={x} y={y} width={width} height={height}
          fill={active ? "hsl(var(--primary) / .22)" : "hsl(var(--card) / .58)"}
          stroke={active ? "hsl(var(--primary))" : "hsl(var(--border) / .9)"}
          strokeWidth={active ? 3 : 1.5} />
        <rect x={x + 5} y={y + 5} width={width - 10} height={height - 10}
          fill="none" stroke={active ? "hsl(var(--primary) / .4)" : "hsl(var(--foreground) / .055)"}
          strokeWidth="1" strokeDasharray={active ? "0" : "3 6"} />
        <text x={x + width / 2} y={y + height / 2 - 2} textAnchor="middle" dominantBaseline="middle"
          fontSize={width < 135 ? 10 : 12} fontWeight={active ? 700 : 500}
          letterSpacing=".8" fill="hsl(var(--foreground) / .92)" style={{ pointerEvents: "none" }}>{label.toUpperCase()}</text>
        <text x={x + width / 2} y={y + height / 2 + 16} textAnchor="middle" fontSize="8.5"
          letterSpacing="1.2" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
          style={{ pointerEvents: "none" }}>{apartmentRooms.find((room) => room.id === roomId)?.code}</text>
      </g>
    );
  };

  return (
    <section className="skol-apartment-studio mb-8 overflow-hidden border border-border/60 bg-card/35">
      <div className="border-b border-border/55 p-5 sm:p-7 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-[.95fr_1.05fr] sm:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-primary">
              <span className="h-px w-6 bg-primary" /> 01 / APARTMENT STRIP-OUT
            </p>
            <h2 className="max-w-xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {isRu ? "Соберите состав демонтажа по своей квартире" : "Configure demolition for your apartment"}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            {isRu
              ? "Выберите помещение на схеме, затем отметьте нужные работы. Список подстраивается под выбранную зону, а готовый состав можно передать в заявку."
              : "Choose a room on the plan and select the work you need. The list adapts to the selected area, and your scope can be transferred to the request form."}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[.92fr_1.08fr]">
        <div className="min-w-0 border-b border-border/55 p-3 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">
              {viewMode === "3d" ? (isRu ? "Объёмная модель / выберите зону" : "3D model / select a zone") : (isRu ? "План / выберите зону" : "Plan / select a zone")}
            </span>
            <div className="flex items-center gap-1 border border-border/60 bg-background/45 p-1">
              <button type="button" onClick={() => setViewMode("3d")} aria-pressed={viewMode === "3d"}
                className={"min-h-8 px-3 text-[10px] font-semibold transition-colors " + (viewMode === "3d" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                3D / {isRu ? "Объём" : "Volume"}
              </button>
              <button type="button" onClick={() => setViewMode("plan")} aria-pressed={viewMode === "plan"}
                className={"min-h-8 px-3 text-[10px] font-semibold transition-colors " + (viewMode === "plan" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                2D / {isRu ? "План" : "Plan"}
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden border border-border/55 bg-background/50 p-1.5 sm:p-3">
            <div className="pointer-events-none absolute inset-0 opacity-55" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)/.055) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/.055) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            {viewMode === "plan" ? (
              <svg viewBox="0 0 620 360" className="relative z-10 block h-auto w-full" role="img" aria-label={isRu ? "Интерактивный план квартиры" : "Interactive apartment plan"}>
                <path d="M32 32H588V328H32Z" fill="none" stroke="hsl(var(--foreground) / .2)" strokeWidth="1.5" strokeDasharray="5 5" />
                {roomShape("living", 42, 42, 198, 132, isRu ? "Гостиная" : "Living")}
                {roomShape("bedroom", 248, 42, 165, 132, isRu ? "Спальня" : "Bedroom")}
                {roomShape("kitchen", 421, 42, 157, 98, isRu ? "Кухня" : "Kitchen")}
                {roomShape("bathroom", 421, 148, 157, 83, isRu ? "Санузел" : "Bathroom")}
                {roomShape("hall", 248, 182, 165, 136, isRu ? "Коридор" : "Hallway")}
                {roomShape("balcony", 42, 182, 198, 136, isRu ? "Балкон" : "Balcony")}
                <g fill="hsl(var(--muted-foreground))" fontSize="8" fontFamily="ui-monospace, monospace" letterSpacing="1.2">
                  <text x="42" y="20">SKOL / SPATIAL PLAN</text>
                  <text x="444" y="348">SCHEMATIC / 01:07</text>
                </g>
                <path d="M20 42H34M20 42V56M600 304V328H576" fill="none" stroke="hsl(var(--primary) / .6)" strokeWidth="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 620 360" className="relative z-10 block h-auto w-full" role="img" aria-label={isRu ? "Интерактивная изометрическая 3D-модель квартиры" : "Interactive isometric 3D apartment model"}>
                <defs>
                  <linearGradient id="apt-floor" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--foreground) / .08)" />
                    <stop offset="100%" stopColor="hsl(var(--foreground) / .025)" />
                  </linearGradient>
                  <linearGradient id="apt-active" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary) / .42)" />
                    <stop offset="100%" stopColor="hsl(var(--primary) / .12)" />
                  </linearGradient>
                </defs>
                <g fill="none" stroke="hsl(var(--foreground) / .07)" strokeWidth="1">
                  <path d="M28 284H592M48 302H572M74 320H546" />
                  <path d="M75 42V321M125 42V321M175 42V321M225 42V321M275 42V321M325 42V321M375 42V321M425 42V321M475 42V321M525 42V321" opacity=".4" />
                </g>
                <path d="M42 230 310 82 578 228 309 347Z" fill="hsl(var(--foreground) / .025)" stroke="hsl(var(--foreground) / .22)" strokeWidth="1.2" />
                <g fill="none" stroke="hsl(var(--foreground) / .18)" strokeWidth="1" strokeDasharray="4 5">
                  <path d="M96 224 96 242M224 154 224 172M360 228 360 246M468 169 468 187" />
                </g>
                <g role="button" tabIndex={0} aria-label={isRu ? "Гостиная" : "Living room"} aria-pressed={activeRoom === "living"} onClick={() => setActiveRoom("living")} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveRoom("living"); } }} style={{ cursor: "pointer", outline: "none" }}>
                  <path d="M65 172 166 116 166 160 65 216Z" fill={activeRoom === "living" ? "hsl(var(--primary) / .28)" : "hsl(var(--foreground) / .07)"} stroke={activeRoom === "living" ? "hsl(var(--primary))" : "hsl(var(--border) / .8)"} strokeWidth={activeRoom === "living" ? 2 : 1} />
                  <path d="M65 172 166 228 166 160 65 216Z" fill={activeRoom === "living" ? "hsl(var(--primary) / .12)" : "hsl(var(--foreground) / .035)"} stroke={activeRoom === "living" ? "hsl(var(--primary) / .8)" : "hsl(var(--foreground) / .22)"} strokeWidth="1" />
                  <path d="M65 172 166 116 270 170 166 228Z" fill={activeRoom === "living" ? "url(#apt-active)" : "url(#apt-floor)"} stroke={activeRoom === "living" ? "hsl(var(--primary))" : "hsl(var(--foreground) / .35)"} strokeWidth={activeRoom === "living" ? 2.5 : 1.2} />
                  <text x="166" y="171" textAnchor="middle" fontSize="11" fontWeight="600" fill="hsl(var(--foreground))" style={{ pointerEvents: "none" }}>{isRu ? "ГОСТИНАЯ" : "LIVING"}</text>
                </g>
                <g role="button" tabIndex={0} aria-label={isRu ? "Спальня" : "Bedroom"} aria-pressed={activeRoom === "bedroom"} onClick={() => setActiveRoom("bedroom")} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveRoom("bedroom"); } }} style={{ cursor: "pointer", outline: "none" }}>
                  <path d="M166 116 257 66 257 108 166 160Z" fill={activeRoom === "bedroom" ? "hsl(var(--primary) / .28)" : "hsl(var(--foreground) / .07)"} stroke={activeRoom === "bedroom" ? "hsl(var(--primary))" : "hsl(var(--border) / .8)"} strokeWidth={activeRoom === "bedroom" ? 2 : 1} />
                  <path d="M166 116 270 170 270 124 166 160Z" fill="hsl(var(--foreground) / .04)" stroke="hsl(var(--foreground) / .22)" strokeWidth="1" />
                  <path d="M166 116 257 66 362 118 270 170Z" fill={activeRoom === "bedroom" ? "url(#apt-active)" : "url(#apt-floor)"} stroke={activeRoom === "bedroom" ? "hsl(var(--primary))" : "hsl(var(--foreground) / .35)"} strokeWidth={activeRoom === "bedroom" ? 2.5 : 1.2} />
                  <text x="264" y="122" textAnchor="middle" fontSize="10" fontWeight="600" fill="hsl(var(--foreground))" style={{ pointerEvents: "none" }}>{isRu ? "СПАЛЬНЯ" : "BEDROOM"}</text>
                </g>
                <g role="button" tabIndex={0} aria-label={isRu ? "Кухня" : "Kitchen"} aria-pressed={activeRoom === "kitchen"} onClick={() => setActiveRoom("kitchen")} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveRoom("kitchen"); } }} style={{ cursor: "pointer", outline: "none" }}>
                  <path d="M362 118 447 164 447 206 362 160Z" fill={activeRoom === "kitchen" ? "hsl(var(--primary) / .26)" : "hsl(var(--foreground) / .06)"} stroke={activeRoom === "kitchen" ? "hsl(var(--primary))" : "hsl(var(--border) / .8)"} strokeWidth={activeRoom === "kitchen" ? 2 : 1} />
                  <path d="M270 170 362 118 447 164 354 215Z" fill={activeRoom === "kitchen" ? "url(#apt-active)" : "url(#apt-floor)"} stroke={activeRoom === "kitchen" ? "hsl(var(--primary))" : "hsl(var(--foreground) / .35)"} strokeWidth={activeRoom === "kitchen" ? 2.5 : 1.2} />
                  <text x="358" y="170" textAnchor="middle" fontSize="10" fontWeight="600" fill="hsl(var(--foreground))" style={{ pointerEvents: "none" }}>{isRu ? "КУХНЯ" : "KITCHEN"}</text>
                </g>
                <g role="button" tabIndex={0} aria-label={isRu ? "Санузел" : "Bathroom"} aria-pressed={activeRoom === "bathroom"} onClick={() => setActiveRoom("bathroom")} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveRoom("bathroom"); } }} style={{ cursor: "pointer", outline: "none" }}>
                  <path d="M354 215 447 164 447 207 354 259Z" fill={activeRoom === "bathroom" ? "hsl(var(--primary) / .28)" : "hsl(var(--foreground) / .07)"} stroke={activeRoom === "bathroom" ? "hsl(var(--primary))" : "hsl(var(--border) / .8)"} strokeWidth={activeRoom === "bathroom" ? 2 : 1} />
                  <path d="M354 215 447 207 447 250 354 259Z" fill="hsl(var(--foreground) / .035)" stroke="hsl(var(--foreground) / .22)" strokeWidth="1" />
                  <path d="M270 170 354 215 447 164 362 118Z" fill={activeRoom === "bathroom" ? "url(#apt-active)" : "url(#apt-floor)"} stroke={activeRoom === "bathroom" ? "hsl(var(--primary))" : "hsl(var(--foreground) / .35)"} strokeWidth={activeRoom === "bathroom" ? 2.5 : 1.2} />
                  <text x="355" y="177" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="hsl(var(--foreground))" style={{ pointerEvents: "none" }}>{isRu ? "САНУЗЕЛ" : "BATHROOM"}</text>
                </g>
                <g role="button" tabIndex={0} aria-label={isRu ? "Коридор" : "Hallway"} aria-pressed={activeRoom === "hall"} onClick={() => setActiveRoom("hall")} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveRoom("hall"); } }} style={{ cursor: "pointer", outline: "none" }}>
                  <path d="M166 228 270 170 354 215 249 274Z" fill={activeRoom === "hall" ? "url(#apt-active)" : "url(#apt-floor)"} stroke={activeRoom === "hall" ? "hsl(var(--primary))" : "hsl(var(--foreground) / .35)"} strokeWidth={activeRoom === "hall" ? 2.5 : 1.2} />
                  <path d="M166 228 249 274 249 309 166 263Z" fill={activeRoom === "hall" ? "hsl(var(--primary) / .12)" : "hsl(var(--foreground) / .04)"} stroke={activeRoom === "hall" ? "hsl(var(--primary) / .8)" : "hsl(var(--foreground) / .22)"} strokeWidth="1" />
                  <text x="258" y="224" textAnchor="middle" fontSize="10" fontWeight="600" fill="hsl(var(--foreground))" style={{ pointerEvents: "none" }}>{isRu ? "КОРИДОР" : "HALL"}</text>
                </g>
                <g role="button" tabIndex={0} aria-label={isRu ? "Балкон" : "Balcony"} aria-pressed={activeRoom === "balcony"} onClick={() => setActiveRoom("balcony")} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveRoom("balcony"); } }} style={{ cursor: "pointer", outline: "none" }}>
                  <path d="M38 188 65 172 166 228 139 244Z" fill={activeRoom === "balcony" ? "url(#apt-active)" : "url(#apt-floor)"} stroke={activeRoom === "balcony" ? "hsl(var(--primary))" : "hsl(var(--foreground) / .35)"} strokeWidth={activeRoom === "balcony" ? 2.5 : 1.2} />
                  <path d="M38 188 139 244 139 268 38 212Z" fill={activeRoom === "balcony" ? "hsl(var(--primary) / .16)" : "hsl(var(--foreground) / .04)"} stroke={activeRoom === "balcony" ? "hsl(var(--primary) / .8)" : "hsl(var(--foreground) / .22)"} strokeWidth="1" />
                  <text x="96" y="211" textAnchor="middle" fontSize="9" fontWeight="600" fill="hsl(var(--foreground))" style={{ pointerEvents: "none" }}>{isRu ? "БАЛКОН" : "BALCONY"}</text>
                </g>
                <g fill="hsl(var(--muted-foreground))" fontSize="8" fontFamily="ui-monospace, monospace" letterSpacing="1.2">
                  <text x="30" y="20">SKOL / APARTMENT VOLUME</text>
                  <text x="408" y="338">AXONOMETRIC / SCHEMATIC</text>
                </g>
                <path d="M20 32H78M20 32V48M600 298V320H580" fill="none" stroke="hsl(var(--primary) / .7)" strokeWidth="1" />
              </svg>
            )}
          </div>
          <button type="button" onClick={() => setActiveRoom("all")} aria-pressed={activeRoom === "all"}
            className={"mt-3 flex min-h-11 w-full items-center justify-between border px-3 py-2 text-sm transition-colors " + (activeRoom === "all" ? "border-primary/60 bg-primary/10 text-foreground" : "border-border/55 bg-background/45 text-muted-foreground hover:border-primary/40 hover:text-foreground")}>
            <span className="flex items-center gap-2"><Home className="h-4 w-4 text-primary" />{isRu ? "Вся квартира" : "Whole apartment"}</span>
            <span className="font-mono text-[9px] text-muted-foreground">ALL AREAS</span>
          </button>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            {isRu
              ? "Схема условная и нужна для выбора зоны. Реальный состав определяется после осмотра, особенно если затрагиваются несущие конструкции или инженерные системы."
              : "The plan is schematic and used to select an area. Actual scope is confirmed after inspection, especially where structural elements or utilities are involved."}
          </p>
        </div>

        <div className="min-w-0 p-4 sm:p-5 lg:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[.16em] text-primary">
                {isRu ? "Выбранная зона" : "Selected area"} / {activeRoomData.code}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {isRu ? "Какие работы нужны?" : "Which work do you need?"}
              </h3>
            </div>
            <span className="border border-primary/35 bg-primary/10 px-3 py-2 text-xs font-semibold text-foreground">
              {selected.length} {isRu ? "поз." : "items"}
            </span>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2">
            {apartmentRooms.filter((room) => room.id !== "all").map((room) => {
              const active = activeRoom === room.id;
              return (
                <button key={room.id} type="button" aria-pressed={active} onClick={() => setActiveRoom(room.id)}
                  className={"min-h-10 border px-3 py-2 text-left text-xs font-medium transition-colors " + (active ? "border-primary/60 bg-primary/10 text-foreground" : "border-border/55 bg-background/40 text-muted-foreground hover:border-primary/35 hover:text-foreground")}>
                  {room.label[lang]}
                </button>
              );
            })}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {visibleWorkOptions.map((work) => {
              const Icon = work.icon;
              const chosen = isSelected(activeRoom, work.id);
              return (
                <button key={work.id} type="button" aria-pressed={chosen} onClick={() => onToggle(activeRoom, work.id)}
                  className={"skol-apartment-work-card group relative flex min-h-[136px] min-w-0 flex-col border p-3 text-left transition-colors sm:p-4 " + (chosen ? "border-primary/65 bg-primary/[.09]" : "border-border/55 bg-background/45 hover:border-primary/40 hover:bg-card/70")}>
                  <div className="flex items-start justify-between gap-2">
                    <span className={"flex h-9 w-9 shrink-0 items-center justify-center border " + (chosen ? "border-primary/45 bg-primary/10 text-primary" : "border-border/65 text-muted-foreground group-hover:text-primary")}>
                      <Icon className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                    <span className={"flex h-5 w-5 shrink-0 items-center justify-center border " + (chosen ? "border-primary bg-primary text-primary-foreground" : "border-border/70 text-transparent")}>
                      {chosen ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="h-2 w-2" />}
                    </span>
                  </div>
                  <span className="mt-3 block text-sm font-semibold leading-snug text-foreground">{work.title[lang]}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">{work.description[lang]}</span>
                  <span className="mt-auto pt-3 font-mono text-[8px] uppercase tracking-[.15em] text-primary">{work.group[lang]}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => onSelectAll(activeRoom, visibleWorkOptions.map((work) => work.id))}
              className="min-h-10 border border-border/70 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-primary/50">
              {isRu ? "Выбрать весь список" : "Select all shown"}
            </button>
            <button type="button" onClick={onClear}
              className="min-h-10 border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground">
              {isRu ? "Очистить выбор" : "Clear selection"}
            </button>
          </div>

          {selected.length > 0 && (
            <div className="mt-4 border border-primary/30 bg-primary/[.06] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{isRu ? "Состав готов к передаче" : "Scope ready to transfer"}</p>
                <span className="font-mono text-[9px] text-primary">{String(selected.length).padStart(2, "0")} / SCOPE</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {isRu ? "Выбранные зоны и работы попадут в описание заявки. Стоимость не рассчитывается автоматически: её уточним по фактическому объёму и условиям." : "Selected rooms and work will be added to the request. Price is not auto-calculated; it is confirmed after checking actual scope and conditions."}
              </p>
              <button type="button" onClick={onApply}
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
                {isRu ? "Передать состав в заявку" : "Add scope to request"} <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


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
  const [selectedApartmentTasks, setSelectedApartmentTasks] = useState<ApartmentScopeSelection[]>([]);

  const toggleApartmentTask = (roomId: ApartmentRoomId, workId: string) => {
    const effectiveRoomId = resolveApartmentSelectionRoom(roomId, workId);
    setSelectedApartmentTasks((current) =>
      current.some((item) => item.roomId === effectiveRoomId && item.workId === workId)
        ? current.filter((item) => !(item.roomId === effectiveRoomId && item.workId === workId))
        : [...current, { roomId: effectiveRoomId, workId }]
    );
  };

  const selectAllApartmentTasks = (roomId: ApartmentRoomId, workIds: string[]) => {
    setSelectedApartmentTasks((current) => {
      const additions = workIds
        .map((workId) => ({ roomId: resolveApartmentSelectionRoom(roomId, workId), workId }))
        .filter((item) => !current.some((existing) => existing.roomId === item.roomId && existing.workId === item.workId));
      return [...current, ...additions];
    });
  };

  const applyApartmentScopeToRequest = () => {
    const scopeText = getApartmentScopeSummary(selectedApartmentTasks, lang);
    if (!scopeText) return;
    setMessage((current) => {
      const cleanMessage = current.split("Состав работ по зонам:")[0].split("Selected work by room:")[0].trim();
      return [cleanMessage, scopeText].filter(Boolean).join("\n\n");
    });
    document.getElementById("service-request-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const isWaste = service?.slug === "waste-removal";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);

    try {
      const scopeSummary = service?.slug === "apartment-demolition"
        ? getApartmentScopeSummary(selectedApartmentTasks, lang)
        : "";
      const cleanMessage = message.split("Состав работ по зонам:")[0].split("Selected work by room:")[0].trim();
      const finalMessage = [cleanMessage, scopeSummary].filter(Boolean).join("\n\n");

      const { error } = await supabase.functions.invoke("notify-request", {
        body: {
          name: name.trim(),
          phone: phone.trim(),
          message: finalMessage || null,
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
  const seoDesc = service.slug === "apartment-demolition"
    ? (lang === "ru"
      ? "Комплексный демонтаж квартир в Москве и Московской области: перегородки, полы, стяжка, отделка, санузел, кухня, двери, инженерные элементы, упаковка и вывоз по согласованию."
      : "Apartment strip-out in Moscow and the Moscow region: partitions, floors, screed, finishes, bathroom, kitchen, doors, utilities and agreed waste removal.")
    : t(service.descKey) + " Состав и стоимость работ уточняются после оценки условий объекта.";

  return (
    <>
    <SuccessOverlay
      open={showSuccess}
      onClose={() => setShowSuccess(false)}
      service={submittedService}
      price={submittedPrice}
    />
    <SEOHead title={seoTitle} description={seoDesc} canonical={`/services/${service.slug}`} />
    <div className="skol-service-detail relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      {/* Back */}
      <AnimatedSection>
        <Button variant="ghost" onClick={() => navigate("/services")} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {lang === "ru" ? "Все услуги" : "All Services"}
        </Button>
      </AnimatedSection>

      {/* Hero */}
      <AnimatedSection>
        <div className="skol-detail-hero glass-card relative isolate overflow-hidden p-6 sm:p-8 md:p-12 mb-8">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] overflow-hidden opacity-25 lg:block" aria-hidden="true">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=85)" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-card via-card/35 to-transparent" />
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)/.16) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/.16) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
          </div>
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

      {service.slug === "apartment-demolition" && (
        <AnimatedSection delay={0.08}>
          <ApartmentDemolitionStudio
            lang={lang}
            selected={selectedApartmentTasks}
            onToggle={toggleApartmentTask}
            onClear={() => setSelectedApartmentTasks([])}
            onSelectAll={selectAllApartmentTasks}
            onApply={applyApartmentScopeToRequest}
          />
        </AnimatedSection>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <AnimatedSection delay={0.1}>
            <div className="skol-editorial-panel glass-card p-5 sm:p-7 lg:p-8">
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
            <div className="skol-editorial-panel glass-card p-5 sm:p-7 lg:p-8">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                {lang === "ru" ? "Преимущества" : "Features"}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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
            <div className="skol-editorial-panel glass-card p-5 sm:p-7 lg:p-8">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                {lang === "ru" ? "Возможный состав работ" : "Potential scope of work"}
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
            <div className="skol-editorial-panel glass-card p-5 sm:p-7 lg:p-8">
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
            <div className="skol-editorial-panel glass-card p-5 sm:p-7 lg:p-8">
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
              <div className="skol-editorial-panel glass-card p-5 sm:p-7 lg:p-8">
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
            <div className="skol-editorial-panel glass-card p-5 sm:p-6 lg:sticky lg:top-24">
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

              <p className="mb-4 border-l border-primary/60 pl-3 text-xs leading-5 text-muted-foreground">
                {lang === "ru"
                  ? "Площадь — только один из факторов. Итог зависит от материалов, доступа, ограничений и состава работ."
                  : "Area is only one factor. Final cost depends on materials, access, constraints and scope."}
              </p>

              <div className="border-t border-border/30 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {lang === "ru" ? "Стоимость:" : "Cost:"}
                  </span>
                  <motion.span
                    key={area[0]}
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

              <form id="service-request-form" onSubmit={handleSubmit} className="space-y-4">
                <h4 className="font-display font-semibold text-foreground">
                  {lang === "ru" ? "Оставить заявку" : "Submit Request"}
                </h4>
                {service.slug === "apartment-demolition" && selectedApartmentTasks.length > 0 && (
                  <div className="border border-primary/30 bg-primary/[.06] p-3">
                    <p className="text-xs font-semibold text-foreground">
                      {lang === "ru" ? "К заявке будет приложен состав работ" : "The selected scope will be attached to the request"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {selectedApartmentTasks.length} {lang === "ru" ? "позиций выбрано" : "items selected"}
                    </p>
                  </div>
                )}
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
