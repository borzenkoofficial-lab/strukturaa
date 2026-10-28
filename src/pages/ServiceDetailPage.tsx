import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator, Phone, Mail, CheckCircle2, Ruler, Clock, Shield, Loader2, ArrowUpRight, ChevronDown, HelpCircle, Layers, FolderOpen, Home, Bath, Paintbrush, DoorOpen, Zap, Trash2, Sofa, Grid2X2, Hammer, Package } from "lucide-react";
import { useEffect, useState } from "react";
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

function getApartmentScopeSummary(selections: ApartmentScopeSelection[], lang: "ru" | "en", quantity?: number, quantityLabel?: string) {
  if (!selections.length) return "";
  const prefix = lang === "ru" ? "Состав работ по зонам:" : "Selected work by room:";
  const lines = selections.map(({ roomId, workId }) => {
    const room = apartmentRooms.find((item) => item.id === roomId);
    const work = apartmentWorkOptions.find((item) => item.id === workId);
    return "• " + (room ? room.label[lang] : roomId) + " — " + (work ? work.title[lang] : workId);
  });
  const quantityLine = typeof quantity === "number" && quantity > 0
    ? getQuantitySummaryLabel(quantityLabel, lang) + ": " + formatQuantitySummaryValue(quantity, quantityLabel)
    : "";
  return [prefix, quantityLine, ...lines].filter(Boolean).join("\n");
}


const apartmentRecommendationRules: Record<string, string[]> = {
  partitions: ["waste", "wall-finish"],
  flooring: ["waste"],
  screed: ["flooring", "waste"],
  ceilings: ["electrics", "waste"],
  "wall-finish": ["waste"],
  tiles: ["plumbing", "waste"],
  bathroom: ["tiles", "plumbing", "waste"],
  plumbing: ["waste"],
  electrics: ["waste"],
  doors: ["baseboards", "waste"],
  kitchen: ["built-ins", "waste"],
  "built-ins": ["waste"],
  windows: ["waste"],
  balcony: ["waste"],
  baseboards: ["waste"],
};

function getApartmentRecommendations(selections: ApartmentScopeSelection[]) {
  const chosen = new Set(selections.map((item) => item.workId));
  const suggested = new Set<string>();
  selections.forEach((item) => (apartmentRecommendationRules[item.workId] ?? []).forEach((id) => suggested.add(id)));
  return apartmentWorkOptions.filter((item) => suggested.has(item.id) && !chosen.has(item.id));
}

function getApartmentRecommendationReason(workId: string, lang: "ru" | "en") {
  const ru: Record<string, string> = {
    waste: "Упаковку, вынос и вывоз лучше согласовать вместе с объёмом демонтажа.",
    plumbing: "Проверьте сантехнические подключения и безопасное отключение до разборки санузла или плитки.",
    tiles: "При комплексном демонтаже санузла плитка и облицовка обычно требуют отдельного пункта в составе.",
    electrics: "Светильники и электроподключения нужно проверить до разборки потолка.",
    "wall-finish": "После снятия перегородок может потребоваться удалить старые отделочные слои.",
    "built-ins": "Уточните, нужно ли разбирать встроенные шкафы вместе с кухонным гарнитуром.",
    baseboards: "Плинтусы и наличники часто остаются после снятия покрытия и дверей.",
    flooring: "После снятия стяжки может потребоваться отдельно удалить оставшееся напольное покрытие.",
  };
  const en: Record<string, string> = {
    waste: "Agree packing, carry-out and disposal alongside the demolition volume.",
    plumbing: "Check plumbing connections and safe isolation before removing bathroom fixtures or tiles.",
    tiles: "Bathroom strip-out commonly needs a separate tile and cladding item.",
    electrics: "Check lighting and electrical connections before dismantling a ceiling.",
    "wall-finish": "Removing partitions may leave existing finish layers that need separate removal.",
    "built-ins": "Confirm whether fitted cabinets should be dismantled with the kitchen.",
    baseboards: "Skirting and architraves may remain after flooring and door removal.",
    flooring: "Removing screed may also require a separate floor-finish removal item.",
  };
  return (lang === "ru" ? ru : en)[workId] ?? (lang === "ru" ? "Уточните эту работу при осмотре." : "Confirm this item during the site inspection.");
}

function ApartmentDemolitionStudio({
  lang,
  selected,
  onToggle,
  onClear,
  onSelectAll,
  onAddRecommendations,
  onApply,
}: {
  lang: "ru" | "en";
  selected: ApartmentScopeSelection[];
  onToggle: (roomId: ApartmentRoomId, workId: string) => void;
  onClear: () => void;
  onSelectAll: (roomId: ApartmentRoomId, workIds: string[]) => void;
  onAddRecommendations: (workIds: string[]) => void;
  onApply: () => void;
}) {
  const [activeRoom, setActiveRoom] = useState<ApartmentRoomId>("all");
  const [viewMode, setViewMode] = useState<"3d" | "plan">("3d");
  const isRu = lang === "ru";
  const activeRoomData = apartmentRooms.find((item) => item.id === activeRoom) ?? apartmentRooms[0];
  const visibleWorkOptions = apartmentWorkOptions.filter((work) =>
    activeRoom === "all" || work.rooms.includes("all") || work.rooms.includes(activeRoom)
  );
  const recommendations = getApartmentRecommendations(selected);
  const hasSelectedStructuralScope = selected.some((item) => item.workId === "partitions");
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
                  <path d="M447 164 515 202 515 242 447 204Z" fill={activeRoom === "bathroom" ? "hsl(var(--primary) / .25)" : "hsl(var(--foreground) / .07)"} stroke={activeRoom === "bathroom" ? "hsl(var(--primary))" : "hsl(var(--border) / .8)"} strokeWidth={activeRoom === "bathroom" ? 2 : 1} />
                  <path d="M515 202 422 253 422 293 515 242Z" fill={activeRoom === "bathroom" ? "hsl(var(--primary) / .14)" : "hsl(var(--foreground) / .035)"} stroke={activeRoom === "bathroom" ? "hsl(var(--primary) / .8)" : "hsl(var(--foreground) / .22)"} strokeWidth="1" />
                  <path d="M354 215 447 164 515 202 422 253Z" fill={activeRoom === "bathroom" ? "url(#apt-active)" : "url(#apt-floor)"} stroke={activeRoom === "bathroom" ? "hsl(var(--primary))" : "hsl(var(--foreground) / .35)"} strokeWidth={activeRoom === "bathroom" ? 2.5 : 1.2} />
                  <text x="420" y="210" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="hsl(var(--foreground))" style={{ pointerEvents: "none" }}>{isRu ? "САНУЗЕЛ" : "BATHROOM"}</text>
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

          {hasSelectedStructuralScope && (
            <div className="mt-4 border border-primary/40 bg-primary/[.06] p-4">
              <p className="text-sm font-semibold text-foreground">{isRu ? "Проверьте тип перегородок" : "Verify partition type"}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {isRu ? "Перед демонтажом нужно убедиться, что перегородка не является несущей и не содержит скрытых коммуникаций. Схема не заменяет обследование." : "Before removal, verify that the partition is non-load-bearing and contains no hidden utilities. This diagram is not a site survey."}
              </p>
            </div>
          )}
          {recommendations.length > 0 && (
            <div className="mt-4 border border-border/60 bg-secondary/25 p-4">
              <p className="font-mono text-[9px] uppercase tracking-[.16em] text-primary">{isRu ? "СКОЛ / РЕКОМЕНДАЦИИ" : "SKOL / SUGGESTIONS"}</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">{isRu ? "Что ещё стоит учесть" : "What else to consider"}</h3>
                <span className="font-mono text-xs text-primary">{String(recommendations.length).padStart(2, "0")}</span>
              </div>
              <div className="mt-3 space-y-3">
                {recommendations.slice(0, 4).map((item) => (
                  <div key={item.id} className="border-t border-border/40 pt-3 first:border-t-0 first:pt-0">
                    <p className="text-sm font-medium text-foreground">{item.title[lang]}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{getApartmentRecommendationReason(item.id, lang)}</p>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => onAddRecommendations(recommendations.map((item) => item.id))}
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 border border-primary/60 px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-primary/10">
                {isRu ? "Добавить рекомендации в состав" : "Add suggestions to scope"} <ArrowUpRight className="h-4 w-4" />
              </button>
              <p className="mt-2 text-[11px] leading-4 text-muted-foreground">{isRu ? "Работы добавятся в общий состав по квартире. Ничего не добавляется автоматически." : "Suggestions are added to the overall apartment scope only after you confirm."}</p>
            </div>
          )}

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



type BuildingDemolitionConfig = {
  objectType: string;
  structureType: string;
  selected: string[];
};

const buildingObjectTypes = [
  { id: "industrial", ru: "Промышленное здание", en: "Industrial building" },
  { id: "warehouse", ru: "Склад / ангар", en: "Warehouse / hangar" },
  { id: "garage", ru: "Гараж / небольшая постройка", en: "Garage / small structure" },
  { id: "commercial", ru: "Коммерческое здание", en: "Commercial building" },
  { id: "other", ru: "Другой тип объекта", en: "Other structure" },
];

const buildingStructureTypes = [
  { id: "brick", ru: "Кирпич", en: "Brick" },
  { id: "concrete", ru: "Железобетон", en: "Reinforced concrete" },
  { id: "steel", ru: "Металлокаркас", en: "Steel frame" },
  { id: "mixed", ru: "Смешанная конструкция / не знаю", en: "Mixed structure / unknown" },
];

const buildingWorkOptions = [
  { id: "full", ru: "Полный снос здания", en: "Full building demolition", noteRu: "Полный разбор строения в согласованных границах.", noteEn: "Complete removal within the agreed work limits." },
  { id: "roof", ru: "Кровля и верхние конструкции", en: "Roof and upper structures", noteRu: "Кровельный пирог, фермы и другие верхние элементы по проекту работ.", noteEn: "Roof layers, trusses and other upper elements within the work plan." },
  { id: "facade", ru: "Фасад и наружные стены", en: "Facade and external walls", noteRu: "Разборка с учётом соседних зданий, проходов и ограждений.", noteEn: "Removal planned around neighbouring buildings, access and barriers." },
  { id: "frame", ru: "Каркас и несущие элементы", en: "Frame and structural elements", noteRu: "Требует обследования и согласованной последовательности демонтажа.", noteEn: "Requires assessment and an agreed demolition sequence." },
  { id: "interior", ru: "Внутренние конструкции и отделка", en: "Interior structures and finishes", noteRu: "Перегородки, внутренние системы и отделка по перечню.", noteEn: "Partitions, internal systems and finishes according to a scope list." },
  { id: "foundation", ru: "Фундамент и плита", en: "Foundation and slab", noteRu: "Способ разборки определяется после оценки глубины и материала.", noteEn: "The method depends on assessed depth and material." },
  { id: "utilities", ru: "Инженерные сети", en: "Utilities", noteRu: "До работ требуется определить границы и безопасно отключить сети.", noteEn: "Limits must be identified and utilities safely isolated before work." },
  { id: "waste", ru: "Погрузка, вывоз и уборка", en: "Loading, waste removal and cleanup", noteRu: "Объём отходов, техника и логистика уточняются для площадки.", noteEn: "Waste volume, equipment and logistics are confirmed for the site." },
];

function getBuildingDemolitionSummary(config: BuildingDemolitionConfig, lang: "ru" | "en", quantity?: number, quantityLabel?: string) {
  if (!config.selected.length) return "";
  const isRu = lang === "ru";
  const objectType = buildingObjectTypes.find((item) => item.id === config.objectType);
  const structureType = buildingStructureTypes.find((item) => item.id === config.structureType);
  const selectedWorks = buildingWorkOptions.filter((item) => config.selected.includes(item.id));
  const title = isRu ? "Состав демонтажа здания:" : "Building demolition scope:";
  const objectLabel = isRu ? "Тип объекта" : "Structure type";
  const materialLabel = isRu ? "Конструкция" : "Construction";
  const workLabel = isRu ? "Выбранные работы" : "Selected work";
  return [
    title,
    objectLabel + ": " + (objectType ? objectType[lang] : config.objectType),
    materialLabel + ": " + (structureType ? structureType[lang] : config.structureType),
    ...(typeof quantity === "number" && quantity > 0
      ? [getQuantitySummaryLabel(quantityLabel, lang) + ": " + formatQuantitySummaryValue(quantity, quantityLabel)]
      : []),
    workLabel + ":",
    ...selectedWorks.map((item) => "• " + item[lang]),
  ].join("\n");
}


function getBuildingDemolitionRecommendations(config: BuildingDemolitionConfig) {
  const chosen = new Set(config.selected);
  const suggested = new Set<string>();
  if (chosen.has("full")) ["roof", "facade", "frame", "interior", "foundation", "utilities", "waste"].forEach((id) => suggested.add(id));
  if (["roof", "facade", "frame", "interior", "foundation", "utilities"].some((id) => chosen.has(id))) suggested.add("waste");
  if (chosen.has("full") || chosen.has("frame") || chosen.has("foundation")) suggested.add("utilities");
  return buildingWorkOptions.filter((item) => suggested.has(item.id) && !chosen.has(item.id));
}

function BuildingDemolitionStudio({
  lang,
  config,
  onChange,
  onAddRecommendations,
  onApply,
}: {
  lang: "ru" | "en";
  config: BuildingDemolitionConfig;
  onChange: (next: BuildingDemolitionConfig) => void;
  onAddRecommendations: (workIds: string[]) => void;
  onApply: () => void;
}) {
  const [viewMode, setViewMode] = useState<"3d" | "elevation">("3d");
  const isRu = lang === "ru";
  const toggleWork = (id: string) => {
    onChange({
      ...config,
      selected: config.selected.includes(id)
        ? config.selected.filter((item) => item !== id)
        : [...config.selected, id],
    });
  };
  const isSelected = (id: string) => config.selected.includes(id);
  const recommendations = getBuildingDemolitionRecommendations(config);
  const hasStructuralRisk = config.selected.some((id) => ["full", "frame", "foundation"].includes(id));
  const selectable = (id: string) => ({
    role: "button" as const,
    tabIndex: 0,
    "aria-pressed": isSelected(id),
    onClick: () => toggleWork(id),
    onKeyDown: (event: React.KeyboardEvent<SVGGElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleWork(id);
      }
    },
    style: { cursor: "pointer", outline: "none" },
  });

  return (
    <section className="skol-building-studio mb-8 overflow-hidden border border-border/60 bg-card/35">
      <div className="border-b border-border/55 p-5 sm:p-7 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-[.95fr_1.05fr] sm:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-primary">
              <span className="h-px w-6 bg-primary" /> 02 / BUILDING DEMOLITION
            </p>
            <h2 className="max-w-xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {isRu ? "Настройте состав демонтажа здания" : "Configure building demolition"}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            {isRu
              ? "Выберите тип объекта и конструкцию, затем нажимайте на элементы объёмной схемы или отмечайте работы в списке. Это предварительное описание задачи, не проект производства работ."
              : "Choose the structure type, then select elements on the 3D diagram or use the work list. This is a preliminary brief, not a demolition method statement."}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.02fr_.98fr]">
        <div className="min-w-0 border-b border-border/55 p-3 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">
              {viewMode === "3d" ? (isRu ? "Объёмная схема / выберите элемент" : "3D scheme / select an element") : (isRu ? "Фасадная схема / выберите элемент" : "Elevation / select an element")}
            </span>
            <div className="flex items-center gap-1 border border-border/60 bg-background/45 p-1">
              <button type="button" onClick={() => setViewMode("3d")} aria-pressed={viewMode === "3d"}
                className={"min-h-8 px-3 text-[10px] font-semibold transition-colors " + (viewMode === "3d" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                3D / {isRu ? "Объём" : "Volume"}
              </button>
              <button type="button" onClick={() => setViewMode("elevation")} aria-pressed={viewMode === "elevation"}
                className={"min-h-8 px-3 text-[10px] font-semibold transition-colors " + (viewMode === "elevation" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                2D / {isRu ? "Фасад" : "Elevation"}
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden border border-border/55 bg-background/50 p-1.5 sm:p-3">
            <div className="pointer-events-none absolute inset-0 opacity-55" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)/.055) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/.055) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            {viewMode === "3d" ? (
              <svg viewBox="0 0 620 390" className="relative z-10 block h-auto w-full" role="img" aria-label={isRu ? "Интерактивная изометрическая схема здания для демонтажа" : "Interactive isometric building demolition model"}>
                <defs>
                  <linearGradient id="building-roof" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--foreground) / .14)" />
                    <stop offset="100%" stopColor="hsl(var(--foreground) / .035)" />
                  </linearGradient>
                  <linearGradient id="building-active" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary) / .52)" />
                    <stop offset="100%" stopColor="hsl(var(--primary) / .12)" />
                  </linearGradient>
                </defs>
                <g fill="none" stroke="hsl(var(--foreground) / .075)" strokeWidth="1">
                  <path d="M24 310H596M50 330H570M90 350H530M130 370H490" />
                  <path d="M90 55V360M140 35V355M190 20V350M240 18V350M290 18V350M340 18V350M390 18V350M440 35V355M490 55V360M540 85V350" opacity=".45" />
                </g>
                <path d="M62 290 304 156 562 288 319 382Z" fill="hsl(var(--foreground) / .035)" stroke="hsl(var(--foreground) / .2)" strokeWidth="1.2" />
                <path d="M112 145 313 32 506 137 306 253Z" fill={isSelected("roof") ? "url(#building-active)" : "url(#building-roof)"} stroke={isSelected("roof") ? "hsl(var(--primary))" : "hsl(var(--border) / .9)"} strokeWidth={isSelected("roof") ? 3 : 1.5} {...selectable("roof")} />
                <path d="M112 145 306 253 306 348 112 238Z" fill={isSelected("frame") ? "url(#building-active)" : "hsl(var(--foreground) / .055)"} stroke={isSelected("frame") ? "hsl(var(--primary))" : "hsl(var(--border) / .9)"} strokeWidth={isSelected("frame") ? 3 : 1.2} {...selectable("frame")} />
                <path d="M306 253 506 137 506 230 306 348Z" fill={isSelected("facade") ? "url(#building-active)" : "hsl(var(--foreground) / .085)"} stroke={isSelected("facade") ? "hsl(var(--primary))" : "hsl(var(--border) / .9)"} strokeWidth={isSelected("facade") ? 3 : 1.2} {...selectable("facade")} />
                <g fill="none" stroke={isSelected("frame") ? "hsl(var(--primary) / .95)" : "hsl(var(--foreground) / .24)"} strokeWidth={isSelected("frame") ? 4 : 2} {...selectable("frame")}>
                  <path d="M148 165V258M198 193V286M247 220V313M112 145 112 238M306 253V348" />
                  <path d="M337 235 337 330M386 207 386 301M436 178 436 272M486 149 486 243" />
                  <path d="M112 190 306 300M112 218 306 328M306 300 506 183M306 327 506 211" opacity=".7" />
                </g>
                <g fill="none" stroke="hsl(var(--foreground) / .3)" strokeWidth="1.2" strokeDasharray="5 5">
                  <path d="M112 145 112 107M313 32V15M506 137V100M306 253V223" />
                </g>
                <g transform="translate(0 5)" pointerEvents="none" fill="hsl(var(--foreground) / .9)" fontSize="10" fontFamily="ui-monospace, monospace" letterSpacing="1.2">
                  <text x="309" y="18" textAnchor="middle">{isRu ? "КРОВЛЯ" : "ROOF"}</text>
                  <text x="78" y="204" transform="rotate(29 78 204)" textAnchor="middle">{isRu ? "КАРКАС" : "FRAME"}</text>
                  <text x="474" y="265" transform="rotate(-30 474 265)" textAnchor="middle">{isRu ? "ФАСАД" : "FACADE"}</text>
                </g>
                <path d="M74 80H96M74 80V102M544 325H566V303" fill="none" stroke="hsl(var(--primary) / .7)" strokeWidth="1.5" />
                <text x="32" y="30" fill="hsl(var(--muted-foreground))" fontSize="8" fontFamily="ui-monospace, monospace" letterSpacing="1.2">SKOL / DEMOLITION MODEL</text>
              </svg>
            ) : (
              <svg viewBox="0 0 620 390" className="relative z-10 block h-auto w-full" role="img" aria-label={isRu ? "Фасадная схема здания для демонтажа" : "Building elevation demolition scheme"}>
                <g fill="none" stroke="hsl(var(--foreground) / .075)" strokeWidth="1">
                  <path d="M25 340H595M25 360H595" />
                  <path d="M60 50V350M110 50V350M160 50V350M210 50V350M260 50V350M310 50V350M360 50V350M410 50V350M460 50V350M510 50V350M560 50V350" />
                </g>
                <path d="M92 110 310 45 528 110Z" fill={isSelected("roof") ? "hsl(var(--primary) / .35)" : "hsl(var(--foreground) / .09)"} stroke={isSelected("roof") ? "hsl(var(--primary))" : "hsl(var(--border) / .9)"} strokeWidth="1.5" {...selectable("roof")} />
                <rect x="92" y="110" width="436" height="226" fill={isSelected("facade") ? "hsl(var(--primary) / .22)" : "hsl(var(--foreground) / .055)"} stroke={isSelected("facade") ? "hsl(var(--primary))" : "hsl(var(--border) / .9)"} strokeWidth={isSelected("facade") ? 3 : 1.5} {...selectable("facade")} />
                <g fill="none" stroke={isSelected("frame") ? "hsl(var(--primary))" : "hsl(var(--foreground) / .28)"} strokeWidth={isSelected("frame") ? 4 : 2} {...selectable("frame")}>
                  <path d="M92 110V336M165 110V336M238 110V336M310 110V336M382 110V336M455 110V336M528 110V336" />
                  <path d="M92 185H528M92 260H528" />
                </g>
                <g fill="hsl(var(--foreground) / .75)" fontSize="9" fontFamily="ui-monospace, monospace" letterSpacing="1">
                  <text x="310" y="375" textAnchor="middle">{isRu ? "СХЕМА УСЛОВНАЯ • НЕ В МАСШТАБЕ" : "SCHEMATIC • NOT TO SCALE"}</text>
                  <text x="310" y="82" textAnchor="middle">{isRu ? "КРОВЛЯ" : "ROOF"}</text>
                </g>
              </svg>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { id: "full", ru: "Всё здание", en: "Whole building" },
              { id: "roof", ru: "Кровля", en: "Roof" },
              { id: "facade", ru: "Фасад", en: "Facade" },
              { id: "frame", ru: "Каркас", en: "Frame" },
            ].map((item) => (
              <button key={item.id} type="button" onClick={() => toggleWork(item.id)} aria-pressed={isSelected(item.id)}
                className={"min-h-10 border px-3 py-2 text-left text-xs font-semibold transition-colors " + (isSelected(item.id) ? "border-primary bg-primary/10 text-foreground" : "border-border/55 bg-background/40 text-muted-foreground hover:text-foreground")}>
                {item[lang]}
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            {isRu
              ? "Модель условная и не предназначена для определения несущей схемы. Тип конструкций, устойчивость, порядок демонтажа и необходимые согласования устанавливаются после обследования."
              : "The model is schematic and cannot identify the actual load-bearing system. Structure type, stability, sequence and required approvals must be established after a survey."}
          </p>
        </div>

        <div className="min-w-0 p-4 sm:p-6 lg:p-7">
          <div className="mb-6">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">{isRu ? "01 / Тип объекта" : "01 / Structure type"}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {buildingObjectTypes.map((item) => (
                <button key={item.id} type="button" onClick={() => onChange({ ...config, objectType: item.id })} aria-pressed={config.objectType === item.id}
                  className={"min-h-11 border px-3 py-2 text-left text-xs font-semibold transition-colors " + (config.objectType === item.id ? "border-primary bg-primary/10 text-foreground" : "border-border/50 bg-background/35 text-muted-foreground hover:text-foreground")}>
                  {item[lang]}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">{isRu ? "02 / Материал и конструкция" : "02 / Material and structure"}</p>
            <div className="grid grid-cols-2 gap-2">
              {buildingStructureTypes.map((item) => (
                <button key={item.id} type="button" onClick={() => onChange({ ...config, structureType: item.id })} aria-pressed={config.structureType === item.id}
                  className={"min-h-10 border px-3 py-2 text-left text-xs transition-colors " + (config.structureType === item.id ? "border-primary bg-primary/10 text-foreground" : "border-border/50 bg-background/35 text-muted-foreground hover:text-foreground")}>
                  {item[lang]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">{isRu ? "03 / Состав работ" : "03 / Work scope"}</p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{isRu ? "Что необходимо демонтировать" : "What needs to be demolished"}</h3>
              </div>
              <span className="font-mono text-xs text-primary">{String(config.selected.length).padStart(2, "0")} / 08</span>
            </div>
            <div className="space-y-2">
              {buildingWorkOptions.map((item) => (
                <button key={item.id} type="button" onClick={() => toggleWork(item.id)} aria-pressed={isSelected(item.id)}
                  className={"flex w-full items-start gap-3 border p-3 text-left transition-colors " + (isSelected(item.id) ? "border-primary/70 bg-primary/[.08]" : "border-border/50 bg-background/30 hover:border-border")}>
                  <span className={"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[10px] " + (isSelected(item.id) ? "border-primary bg-primary text-primary-foreground" : "border-border text-transparent")}>✓</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">{item[lang]}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">{isRu ? item.noteRu : item.noteEn}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {hasStructuralRisk && (
            <div className="mt-5 border border-primary/45 bg-primary/[.07] p-4">
              <p className="text-sm font-semibold text-foreground">{isRu ? "Обследование до начала работ" : "Survey before work starts"}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {isRu ? "При полном сносе и работах с каркасом или фундаментом нужно проверить конструктивную схему, устойчивость, соседние здания, временное раскрепление и необходимые согласования." : "For full demolition or work on the frame/foundation, verify structural stability, neighbouring buildings, temporary bracing and required approvals."}
              </p>
            </div>
          )}
          {recommendations.length > 0 && (
            <div className="mt-5 border border-border/60 bg-secondary/25 p-4">
              <p className="font-mono text-[9px] uppercase tracking-[.16em] text-primary">{isRu ? "СКОЛ / РЕКОМЕНДАЦИИ" : "SKOL / SUGGESTIONS"}</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-foreground">{isRu ? "Дополнительно к выбранному" : "Suggested additions"}</h4>
                <span className="font-mono text-xs text-primary">{String(recommendations.length).padStart(2, "0")}</span>
              </div>
              <div className="mt-3 space-y-3">
                {recommendations.slice(0, 4).map((item) => (
                  <div key={item.id} className="border-t border-border/40 pt-3 first:border-t-0 first:pt-0">
                    <p className="text-sm font-medium text-foreground">{item[lang]}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{isRu ? item.noteRu : item.noteEn}</p>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => onAddRecommendations(recommendations.map((item) => item.id))}
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 border border-primary/60 px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-primary/10">
                {isRu ? "Добавить рекомендации в состав" : "Add suggestions to scope"} <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {config.selected.length > 0 && (
            <div className="mt-5 border border-primary/30 bg-primary/[.06] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{isRu ? "Состав готов к передаче" : "Scope ready to transfer"}</p>
                <button type="button" onClick={() => onChange({ ...config, selected: [] })} className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
                  {isRu ? "Очистить" : "Clear"}
                </button>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {isRu ? "Выбранные параметры попадут в описание заявки. Объём, техника, сроки и стоимость подтверждаются после оценки площадки." : "The selected parameters will be added to the request. Scope, equipment, schedule and cost are confirmed after site assessment."}
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


type ServiceScopeSelection = { profile: string; material: string; selected: string[] };
type ServiceScopeChoice = { id: string; ru: string; en: string };
type ServiceScopeWork = { id: string; ru: string; en: string; noteRu: string; noteEn: string };
type ServiceScopeZone = { id: string; ru: string; en: string; d3: string; d2: string; x: number; y: number };
type ServiceScopeDefinition = {
  code: string;
  kind: "demolition" | "construction" | "renovation" | "waste" | "systems" | "cutting";
  title: { ru: string; en: string };
  intro: { ru: string; en: string };
  profileLabel: { ru: string; en: string };
  profiles: ServiceScopeChoice[];
  materialLabel: { ru: string; en: string };
  materials: ServiceScopeChoice[];
  works: ServiceScopeWork[];
  zones: ServiceScopeZone[];
  note: { ru: string; en: string };
};

const serviceScopeDefinitions: Record<string, ServiceScopeDefinition> = {
  demolition: {
    code: "01 / SELECTIVE DEMOLITION",
    kind: "demolition",
    title: { ru: "Соберите состав демонтажа", en: "Configure demolition scope" },
    intro: { ru: "Отметьте элементы здания на схеме и уточните объём задачи. Выбранные позиции можно передать прямо в заявку.", en: "Select building elements in the diagram and define the scope. Selected items can be transferred directly to the request." },
    profileLabel: { ru: "Тип задачи", en: "Project type" },
    profiles: [
      { id: "partial", ru: "Частичный демонтаж", en: "Selective demolition" },
      { id: "full", ru: "Полный демонтаж", en: "Full demolition" },
      { id: "interior", ru: "Демонтаж внутри здания", en: "Interior strip-out" },
      { id: "site", ru: "Расчистка площадки", en: "Site clearance" },
    ],
    materialLabel: { ru: "Материал конструкций", en: "Structure material" },
    materials: [
      { id: "brick", ru: "Кирпич / блок", en: "Brick / block" },
      { id: "concrete", ru: "Бетон / железобетон", en: "Concrete / reinforced concrete" },
      { id: "steel", ru: "Металлокаркас", en: "Steel frame" },
      { id: "mixed", ru: "Смешанный / уточнить", en: "Mixed / to be assessed" },
    ],
    works: [
      { id: "roof", ru: "Кровля и верхние конструкции", en: "Roof and upper structures", noteRu: "Кровельные слои и согласованные верхние элементы.", noteEn: "Roof layers and agreed upper elements." },
      { id: "facade", ru: "Фасад и наружные стены", en: "Facade and external walls", noteRu: "С учётом границ участка и соседних строений.", noteEn: "Considering site boundaries and adjacent structures." },
      { id: "structure", ru: "Каркас и несущие элементы", en: "Frame and structural elements", noteRu: "Только после обследования и утверждения последовательности.", noteEn: "Only after survey and an approved sequence." },
      { id: "interior", ru: "Внутренние конструкции", en: "Internal structures", noteRu: "Перегородки и элементы внутри объекта по перечню.", noteEn: "Partitions and listed internal elements." },
      { id: "foundation", ru: "Фундамент и основание", en: "Foundation and base", noteRu: "Метод зависит от глубины и материала основания.", noteEn: "Method depends on foundation depth and material." },
      { id: "utilities", ru: "Инженерные коммуникации", en: "Utilities", noteRu: "После определения границ и безопасного отключения.", noteEn: "After defining limits and safe isolation." },
      { id: "waste", ru: "Погрузка и вывоз отходов", en: "Debris loading and removal", noteRu: "Объём и логистика согласуются отдельно.", noteEn: "Volume and logistics are agreed separately." },
      { id: "cleanup", ru: "Уборка и подготовка территории", en: "Cleanup and site preparation", noteRu: "Согласованный уровень очистки площадки.", noteEn: "Agreed level of site clearance." },
    ],
    zones: [
      { id: "roof", ru: "Кровля", en: "Roof", d3: "M145 130 L310 43 L478 132 L310 224 Z", d2: "M146 95 L310 36 L474 95 L474 121 L310 62 L146 121 Z", x: 310, y: 131 },
      { id: "facade", ru: "Фасад", en: "Facade", d3: "M145 130 L310 224 L310 322 L145 230 Z", d2: "M146 121 L310 62 L310 318 L146 260 Z", x: 219, y: 232 },
      { id: "structure", ru: "Каркас", en: "Frame", d3: "M310 224 L478 132 L478 232 L310 322 Z", d2: "M310 62 L474 121 L474 260 L310 318 Z", x: 397, y: 233 },
      { id: "interior", ru: "Внутри", en: "Interior", d3: "M211 166 L310 112 L414 168 L310 223 Z", d2: "M203 145 L310 105 L416 145 L416 224 L310 265 L203 224 Z", x: 310, y: 188 },
      { id: "foundation", ru: "Основание", en: "Foundation", d3: "M145 230 L310 322 L478 232 L478 259 L310 350 L145 257 Z", d2: "M146 260 L310 318 L474 260 L474 283 L310 340 L146 283 Z", x: 310, y: 296 },
      { id: "utilities", ru: "Сети", en: "Utilities", d3: "M92 286 L132 264 L167 284 L127 307 Z", d2: "M72 294 L120 294 L120 315 L72 315 Z", x: 117, y: 292 },
    ],
    note: { ru: "Схема условная. Несущая схема, устойчивость, очередность работ и необходимые согласования устанавливаются по результатам обследования.", en: "Schematic only. Structural system, stability, work sequence and required approvals must be determined by a site assessment." },
  },
  construction: {
    code: "02 / STRUCTURAL WORKS",
    kind: "construction",
    title: { ru: "Сконфигурируйте монтаж конструкций", en: "Configure structural works" },
    intro: { ru: "Выберите тип проекта, материал и элементы монтажа. Состав помогает сформировать исходную заявку на оценку объекта.", en: "Choose the project type, material and assembly elements. The scope helps prepare an initial site-assessment request." },
    profileLabel: { ru: "Тип проекта", en: "Project type" },
    profiles: [
      { id: "new", ru: "Новое строительство", en: "New construction" },
      { id: "rebuild", ru: "Реконструкция", en: "Reconstruction" },
      { id: "extension", ru: "Пристройка / надстройка", en: "Extension / additional storey" },
      { id: "assembly", ru: "Сборка отдельной конструкции", en: "Standalone structure assembly" },
    ],
    materialLabel: { ru: "Тип конструкции", en: "Structure type" },
    materials: [
      { id: "steel", ru: "Металлокаркас", en: "Steel frame" },
      { id: "concrete", ru: "Железобетон", en: "Reinforced concrete" },
      { id: "prefab", ru: "Сборные элементы", en: "Prefabricated elements" },
      { id: "mixed", ru: "Комбинированная", en: "Combined structure" },
    ],
    works: [
      { id: "foundation", ru: "Основание и опорные узлы", en: "Foundation and support nodes", noteRu: "Подготовка основания и проверка опорных точек.", noteEn: "Base preparation and support-point verification." },
      { id: "columns", ru: "Колонны и стойки", en: "Columns and posts", noteRu: "Монтаж вертикальных несущих элементов.", noteEn: "Assembly of vertical structural members." },
      { id: "beams", ru: "Балки и фермы", en: "Beams and trusses", noteRu: "Подъём и соединение горизонтальных элементов.", noteEn: "Lifting and joining horizontal members." },
      { id: "slabs", ru: "Перекрытия и настилы", en: "Floor slabs and decking", noteRu: "Тип, вес и способ подачи уточняются по проекту.", noteEn: "Type, weight and lifting method are confirmed from the design." },
      { id: "roof", ru: "Кровельный каркас", en: "Roof frame", noteRu: "Фермы, прогоны и несущие элементы покрытия.", noteEn: "Trusses, purlins and roof-supporting elements." },
      { id: "stairs", ru: "Лестницы и площадки", en: "Stairs and platforms", noteRu: "Марши, площадки, ограждения и узлы крепления.", noteEn: "Flights, landings, railings and fixing nodes." },
      { id: "welding", ru: "Сварные и болтовые соединения", en: "Welded and bolted connections", noteRu: "Состав и контроль соединений определяются проектом.", noteEn: "Connection scope and inspection are defined by the design." },
      { id: "lifting", ru: "Подъёмная техника и логистика", en: "Lifting equipment and logistics", noteRu: "Подъезд, грузоподъёмность и зона работы согласуются заранее.", noteEn: "Access, lifting capacity and operating zone are agreed beforehand." },
    ],
    zones: [
      { id: "roof", ru: "Фермы", en: "Trusses", d3: "M145 126 L310 35 L472 126 L310 218 Z", d2: "M145 116 L310 40 L472 116 L472 135 L310 59 L145 135 Z", x: 310, y: 123 },
      { id: "columns", ru: "Колонны", en: "Columns", d3: "M145 126 L310 218 L310 329 L145 237 Z", d2: "M145 135 L163 141 L163 322 L145 316 Z M292 188 L310 194 L310 328 L292 322 Z", x: 222, y: 262 },
      { id: "beams", ru: "Балки", en: "Beams", d3: "M310 218 L472 126 L472 237 L310 329 Z", d2: "M310 59 L328 67 L328 309 L310 318 Z M454 126 L472 135 L472 316 L454 307 Z", x: 390, y: 260 },
      { id: "slabs", ru: "Перекрытия", en: "Slabs", d3: "M174 175 L310 99 L443 175 L310 250 Z", d2: "M145 190 L310 114 L472 190 L472 210 L310 135 L145 210 Z", x: 310, y: 177 },
      { id: "foundation", ru: "Опоры", en: "Supports", d3: "M125 257 L310 361 L492 257 L492 276 L310 382 L125 276 Z", d2: "M125 318 L492 318 L492 346 L125 346 Z", x: 310, y: 337 },
      { id: "stairs", ru: "Лестницы", en: "Stairs", d3: "M382 280 L436 250 L460 264 L406 295 Z", d2: "M388 263 L449 263 L449 281 L388 281 Z", x: 421, y: 274 },
    ],
    note: { ru: "Схема не заменяет проект и расчёт несущей способности. Способ монтажа, временное раскрепление и грузоподъёмность техники проверяются для конкретного объекта.", en: "This schematic does not replace engineering design or load calculations. Assembly method, temporary bracing and equipment capacity must be verified for the site." },
  },
  renovation: {
    code: "03 / INTERIOR RENOVATION",
    kind: "renovation",
    title: { ru: "Соберите состав ремонтных работ", en: "Configure renovation scope" },
    intro: { ru: "Выберите тип помещения и формат ремонта, затем отметьте нужные зоны и системы. Список попадёт в заявку для уточнения сметы.", en: "Choose the space type and renovation format, then select the required areas and systems. Your selections will be attached to the request for estimating." },
    profileLabel: { ru: "Тип помещения", en: "Space type" },
    profiles: [
      { id: "apartment", ru: "Квартира", en: "Apartment" },
      { id: "office", ru: "Офис", en: "Office" },
      { id: "commercial", ru: "Коммерческое помещение", en: "Commercial space" },
      { id: "house", ru: "Дом / коттедж", en: "House / cottage" },
    ],
    materialLabel: { ru: "Формат ремонта", en: "Renovation format" },
    materials: [
      { id: "rough", ru: "Черновой этап", en: "Rough-in stage" },
      { id: "finish", ru: "Чистовая отделка", en: "Finish work" },
      { id: "complex", ru: "Комплексно под ключ", en: "Full turnkey" },
      { id: "partial", ru: "Отдельные работы", en: "Selected tasks only" },
    ],
    works: [
      { id: "walls", ru: "Стены и перегородки", en: "Walls and partitions", noteRu: "Возведение, выравнивание и подготовка поверхностей.", noteEn: "Construction, levelling and surface preparation." },
      { id: "floor", ru: "Полы и основание", en: "Floors and substrate", noteRu: "Стяжка, выравнивание, покрытия и плинтусы.", noteEn: "Screed, levelling, floor finishes and skirting." },
      { id: "ceiling", ru: "Потолки", en: "Ceilings", noteRu: "Подготовка, покраска или потолочные системы.", noteEn: "Preparation, painting or ceiling systems." },
      { id: "wet", ru: "Санузел и мокрые зоны", en: "Bathrooms and wet areas", noteRu: "Гидроизоляция, плитка и сопряжения систем.", noteEn: "Waterproofing, tiles and service interfaces." },
      { id: "utilities", ru: "Электрика и освещение", en: "Electrical and lighting", noteRu: "Перечень точек и схема разводки уточняются отдельно.", noteEn: "Point schedule and wiring layout are confirmed separately." },
      { id: "plumbing", ru: "Сантехника и отопление", en: "Plumbing and heating", noteRu: "Оборудование и подключение по согласованному перечню.", noteEn: "Fixtures and connections according to the agreed list." },
      { id: "doors", ru: "Двери и встроенные элементы", en: "Doors and built-in elements", noteRu: "Полотна, коробки, шкафы и сопряжения отделки.", noteEn: "Door sets, fitted storage and finish interfaces." },
      { id: "finish", ru: "Покраска и финишная отделка", en: "Painting and final finishes", noteRu: "Цвета, материалы и качество основания утверждаются до работ.", noteEn: "Colours, materials and substrate condition are agreed before work." },
    ],
    zones: [
      { id: "walls", ru: "Стены", en: "Walls", d3: "M145 130 L310 221 L310 327 L145 235 Z", d2: "M150 90 L310 35 L470 90 L470 302 L310 350 L150 302 Z", x: 220, y: 230 },
      { id: "floor", ru: "Пол", en: "Floor", d3: "M145 235 L310 327 L478 235 L310 333 Z", d2: "M150 302 L310 350 L470 302 L310 255 Z", x: 310, y: 303 },
      { id: "ceiling", ru: "Потолок", en: "Ceiling", d3: "M145 130 L310 43 L478 132 L310 221 Z", d2: "M150 90 L310 35 L470 90 L310 139 Z", x: 310, y: 129 },
      { id: "wet", ru: "Мокрая зона", en: "Wet area", d3: "M337 205 L417 160 L461 185 L381 230 Z", d2: "M335 175 L435 145 L435 222 L335 250 Z", x: 390, y: 199 },
      { id: "utilities", ru: "Инженерия", en: "Utilities", d3: "M195 158 L245 130 L285 152 L235 180 Z", d2: "M175 150 L270 150 L270 188 L175 188 Z", x: 229, y: 160 },
      { id: "plumbing", ru: "Сантехника", en: "Plumbing", d3: "M360 247 L397 226 L420 240 L383 261 Z", d2: "M350 231 L425 231 L425 250 L350 250 Z", x: 387, y: 241 },
    ],
    note: { ru: "Схема помогает описать желаемый объём, но не заменяет замеры, проверку оснований и согласование инженерных решений. Финальная смета формируется после уточнения материалов и условий.", en: "The scheme describes the desired scope but does not replace measurements, substrate checks or utility planning. The final estimate follows confirmation of materials and conditions." },
  },
  "waste-removal": {
    code: "04 / WASTE LOGISTICS",
    kind: "waste",
    title: { ru: "Настройте вывоз строительных отходов", en: "Configure construction waste removal" },
    intro: { ru: "Выберите контейнер и тип отходов, отметьте нужные операции. Итоговый объём, подъезд и график подтвердим до подачи техники.", en: "Choose a container and waste type, then select the required services. Volume, access and schedule are confirmed before dispatch." },
    profileLabel: { ru: "Объём контейнера", en: "Container capacity" },
    profiles: [
      { id: "8", ru: "8 м³ — небольшой объём", en: "8 m³ — small volume" },
      { id: "12", ru: "12 м³ — средний объём", en: "12 m³ — medium volume" },
      { id: "20", ru: "20 м³ — большой объём", en: "20 m³ — large volume" },
      { id: "27", ru: "27 м³ — крупный объём", en: "27 m³ — extra-large volume" },
    ],
    materialLabel: { ru: "Тип отходов", en: "Waste type" },
    materials: [
      { id: "mixed", ru: "Смешанный строительный мусор", en: "Mixed construction waste" },
      { id: "concrete", ru: "Бетон / кирпич", en: "Concrete / brick" },
      { id: "soil", ru: "Грунт и инертные материалы", en: "Soil and inert material" },
      { id: "clean", ru: "Раздельно собранные отходы", en: "Sorted waste" },
    ],
    works: [
      { id: "delivery", ru: "Подача и установка контейнера", en: "Container delivery and placement", noteRu: "Проверяем подъезд, место установки и ограничения площадки.", noteEn: "Access, placement area and site restrictions must be checked." },
      { id: "loading", ru: "Погрузка отходов", en: "Waste loading", noteRu: "Погрузка включается в состав только по согласованию.", noteEn: "Loading is included only when agreed." },
      { id: "carryout", ru: "Вынос из здания", en: "Carry-out from building", noteRu: "Уточняются этаж, лифт, расстояние и режим доступа.", noteEn: "Floor, lift, distance and access hours must be confirmed." },
      { id: "transport", ru: "Транспортировка", en: "Transportation", noteRu: "Маршрут и формат техники зависят от площадки.", noteEn: "Route and vehicle type depend on the site." },
      { id: "swap", ru: "Замена / повторная подача", en: "Container exchange / repeat delivery", noteRu: "Количество рейсов согласуется после оценки объёма.", noteEn: "Number of trips is agreed after volume assessment." },
      { id: "sorting", ru: "Сортировка отходов", en: "Waste sorting", noteRu: "Возможность разделения зависит от состава и упаковки.", noteEn: "Sorting depends on material mix and packaging." },
      { id: "documents", ru: "Документы по вывозу", en: "Waste transport documents", noteRu: "Набор документов уточняется по виду отходов и договору.", noteEn: "Documentation depends on waste type and contract." },
      { id: "cleanup", ru: "Уборка точки погрузки", en: "Loading area cleanup", noteRu: "Границы уборки фиксируются до начала работ.", noteEn: "Cleanup boundaries are agreed before work starts." },
    ],
    zones: [
      { id: "delivery", ru: "Контейнер", en: "Container", d3: "M200 190 L405 190 L455 160 L250 160 Z M200 190 L200 265 L405 265 L405 190 Z M405 190 L455 160 L455 235 L405 265 Z", d2: "M170 145 L430 145 L430 275 L170 275 Z", x: 322, y: 216 },
      { id: "loading", ru: "Погрузка", en: "Loading", d3: "M91 122 L140 96 L180 119 L130 147 Z", d2: "M75 115 L155 115 L155 145 L75 145 Z", x: 130, y: 122 },
      { id: "transport", ru: "Вывоз", en: "Transport", d3: "M415 276 L463 249 L510 275 L462 303 Z", d2: "M410 286 L500 286 L500 310 L410 310 Z", x: 460, y: 291 },
      { id: "sorting", ru: "Сортировка", en: "Sorting", d3: "M115 270 L157 247 L198 270 L156 294 Z", d2: "M82 243 L160 243 L160 270 L82 270 Z", x: 140, y: 261 },
      { id: "cleanup", ru: "Уборка", en: "Cleanup", d3: "M220 293 L307 276 L350 298 L265 317 Z", d2: "M205 317 L360 317 L360 335 L205 335 Z", x: 279, y: 308 },
    ],
    note: { ru: "Контейнер выбирается предварительно. Допустимость размещения, масса и состав отходов, правила площадки и документы проверяются при оформлении заказа.", en: "Container size is a preliminary choice. Placement, waste weight and composition, site rules and documentation are verified when arranging the service." },
  },
  dismantling: {
    code: "05 / UTILITIES DISMANTLING",
    kind: "systems",
    title: { ru: "Соберите состав демонтажа инженерных систем", en: "Configure utility dismantling" },
    intro: { ru: "Отметьте сети и оборудование, которые требуется демонтировать. Перед началом определяем границы работ и безопасное отключение систем.", en: "Select the systems and equipment to dismantle. Work boundaries and safe isolation are established before starting." },
    profileLabel: { ru: "Тип объекта", en: "Site type" },
    profiles: [
      { id: "residential", ru: "Жилое помещение", en: "Residential" },
      { id: "office", ru: "Офис / коммерческий объект", en: "Office / commercial" },
      { id: "industrial", ru: "Промышленный объект", en: "Industrial facility" },
      { id: "partial", ru: "Локальный участок", en: "Local section" },
    ],
    materialLabel: { ru: "Статус отключения", en: "Isolation status" },
    materials: [
      { id: "isolated", ru: "Системы отключены", en: "Systems isolated" },
      { id: "need", ru: "Нужно организовать отключение", en: "Isolation to be arranged" },
      { id: "unknown", ru: "Статус неизвестен", en: "Status unknown" },
      { id: "live", ru: "Объект действующий", en: "Live / operating site" },
    ],
    works: [
      { id: "electrics", ru: "Кабели, проводка и щиты", en: "Cables, wiring and panels", noteRu: "Работы с электрическими частями — после подтверждённого обесточивания.", noteEn: "Electrical work proceeds only after verified isolation." },
      { id: "plumbing", ru: "Трубопроводы и сантехника", en: "Pipes and plumbing", noteRu: "Среда, давление и границы отключения уточняются заранее.", noteEn: "Fluid, pressure and isolation limits are confirmed in advance." },
      { id: "ventilation", ru: "Воздуховоды и вентиляция", en: "Ductwork and ventilation", noteRu: "Проверяем подвесы, габариты, доступ и способ разделения.", noteEn: "Supports, dimensions, access and segmentation method are checked." },
      { id: "heating", ru: "Отопление и радиаторы", en: "Heating and radiators", noteRu: "Учитываются теплоноситель, температура и состояние стояков.", noteEn: "Heating medium, temperature and riser status are considered." },
      { id: "equipment", ru: "Инженерное оборудование", en: "Mechanical equipment", noteRu: "Вес, крепления, подъём и пути удаления определяются до демонтажа.", noteEn: "Weight, fixings, lifting and removal routes are established before dismantling." },
      { id: "cables", ru: "Кабельные лотки и опоры", en: "Cable trays and supports", noteRu: "Согласуется участок демонтажа и сохраняемые коммуникации.", noteEn: "The removal limits and retained utilities are agreed." },
      { id: "fire", ru: "Противопожарные системы", en: "Fire protection systems", noteRu: "Демонтаж согласуется с ответственными за безопасность объекта.", noteEn: "Removal is coordinated with the site's safety lead." },
      { id: "waste", ru: "Погрузка и вывоз", en: "Loading and disposal", noteRu: "Состав и обращение с отходами уточняются по материалам.", noteEn: "Waste types and handling are confirmed based on materials." },
    ],
    zones: [
      { id: "electrics", ru: "Электрика", en: "Electrical", d3: "M65 100 L240 100 L240 153 L65 153 Z", d2: "M65 85 L255 85 L255 135 L65 135 Z", x: 153, y: 127 },
      { id: "plumbing", ru: "Трубы", en: "Pipes", d3: "M280 100 L450 100 L450 153 L280 153 Z", d2: "M300 85 L500 85 L500 135 L300 135 Z", x: 365, y: 127 },
      { id: "ventilation", ru: "Воздуховоды", en: "Ductwork", d3: "M65 205 L240 205 L240 258 L65 258 Z", d2: "M65 180 L255 180 L255 230 L65 230 Z", x: 153, y: 232 },
      { id: "heating", ru: "Отопление", en: "Heating", d3: "M280 205 L450 205 L450 258 L280 258 Z", d2: "M300 180 L500 180 L500 230 L300 230 Z", x: 365, y: 232 },
      { id: "equipment", ru: "Оборудование", en: "Equipment", d3: "M210 280 L310 225 L410 280 L310 335 Z", d2: "M210 265 L410 265 L410 328 L210 328 Z", x: 310, y: 290 },
    ],
    note: { ru: "Не демонтируйте и не разрезайте действующие сети без подтверждённого отключения и разрешения ответственного лица. Схема служит только для описания состава работ.", en: "Do not dismantle or cut live utilities without verified isolation and authorization. This diagram only describes the requested scope." },
  },
  "diamond-cutting": {
    code: "06 / DIAMOND CUTTING",
    kind: "cutting",
    title: { ru: "Настройте алмазную резку и бурение", en: "Configure diamond cutting and drilling" },
    intro: { ru: "Выберите материал и тип операции, отметьте элементы на схеме. Размеры, армирование, доступ и допустимость вмешательства проверяются отдельно.", en: "Choose the material and operation, then select elements in the diagram. Dimensions, reinforcement, access and permission to alter the structure are checked separately." },
    profileLabel: { ru: "Операция", en: "Operation" },
    profiles: [
      { id: "opening", ru: "Резка проёма", en: "Opening cut" },
      { id: "slab", ru: "Резка перекрытия", en: "Slab cutting" },
      { id: "drilling", ru: "Алмазное бурение", en: "Diamond drilling" },
      { id: "chase", ru: "Штробы и технологические резы", en: "Chases and service cuts" },
    ],
    materialLabel: { ru: "Материал", en: "Material" },
    materials: [
      { id: "concrete", ru: "Бетон", en: "Concrete" },
      { id: "reinforced", ru: "Железобетон", en: "Reinforced concrete" },
      { id: "brick", ru: "Кирпич / блок", en: "Brick / block" },
      { id: "stone", ru: "Камень / другой материал", en: "Stone / other material" },
    ],
    works: [
      { id: "opening", ru: "Дверные и технологические проёмы", en: "Door and service openings", noteRu: "Границы реза и усиление определяются по проектному решению.", noteEn: "Cut limits and reinforcement depend on the engineering design." },
      { id: "slab", ru: "Проёмы в перекрытии", en: "Slab openings", noteRu: "Нужны проверка армирования, нагрузок и допустимости выреза.", noteEn: "Reinforcement, loads and cut feasibility must be checked." },
      { id: "drilling", ru: "Отверстия и проходки", en: "Holes and penetrations", noteRu: "Диаметр, глубина и расположение уточняются до бурения.", noteEn: "Diameter, depth and position are confirmed before drilling." },
      { id: "chases", ru: "Штробы и каналы", en: "Chases and channels", noteRu: "В несущих конструкциях выполняются только по согласованному решению.", noteEn: "In structural elements, work requires an approved solution." },
      { id: "wall", ru: "Резка стен и плит", en: "Wall and slab cuts", noteRu: "Способ и последовательность зависят от толщины и армирования.", noteEn: "Method and sequence depend on thickness and reinforcement." },
      { id: "reinforcement", ru: "Работа с армированием", en: "Reinforcement handling", noteRu: "Арматуру нельзя перерезать без проверки конструктивного решения.", noteEn: "Rebar must not be cut without checking the structural design." },
      { id: "water", ru: "Водоподача и сбор шлама", en: "Water supply and slurry collection", noteRu: "Заранее согласуются защита отделки и безопасный отвод воды.", noteEn: "Protection and safe water/slurry collection must be arranged." },
      { id: "cleanup", ru: "Уборка рабочей зоны", en: "Work-area cleanup", noteRu: "Уровень уборки и обращение с отходами фиксируются в смете.", noteEn: "Cleanup level and waste handling are listed in the estimate." },
    ],
    zones: [
      { id: "wall", ru: "Стена", en: "Wall", d3: "M130 78 L430 78 L430 308 L130 308 Z", d2: "M100 60 L470 60 L470 320 L100 320 Z", x: 280, y: 170 },
      { id: "opening", ru: "Проём", en: "Opening", d3: "M215 175 L330 175 L330 308 L215 308 Z", d2: "M205 175 L345 175 L345 320 L205 320 Z", x: 275, y: 238 },
      { id: "slab", ru: "Плита", en: "Slab", d3: "M95 300 L280 330 L475 300 L280 270 Z", d2: "M115 315 L455 315 L455 350 L115 350 Z", x: 280, y: 323 },
      { id: "drilling", ru: "Бурение", en: "Drilling", d3: "M360 120 A30 30 0 1 0 420 120 A30 30 0 1 0 360 120 Z", d2: "M365 105 A32 32 0 1 0 429 105 A32 32 0 1 0 365 105 Z", x: 395, y: 120 },
      { id: "chases", ru: "Штробы", en: "Chases", d3: "M160 105 L178 105 L178 260 L160 260 Z", d2: "M150 95 L174 95 L174 282 L150 282 Z", x: 162, y: 195 },
      { id: "water", ru: "Сбор шлама", en: "Slurry collection", d3: "M450 280 L500 252 L535 272 L485 302 Z", d2: "M450 285 L520 285 L520 315 L450 315 Z", x: 484, y: 294 },
    ],
    note: { ru: "Схема условная и не подтверждает допустимость резки. Проёмы и резы в несущих элементах выполняются только после проверки конструкции и требуемых проектных согласований.", en: "Schematic only; it does not confirm that cutting is permitted. Cuts in structural elements require structural assessment and any necessary design approvals." },
  },
};

type SiteConditions = {
  access: string;
  schedule: string;
  logistics: string;
};

const emptySiteConditions: SiteConditions = {
  access: "unknown",
  schedule: "unknown",
  logistics: "unknown",
};

const residentialAccessOptions = [
  { id: "unknown", ru: "Не уточнено", en: "Not specified" },
  { id: "ground", ru: "Первый этаж / без лестниц", en: "Ground floor / no stairs" },
  { id: "elevator", ru: "Есть лифт", en: "Elevator available" },
  { id: "stairs", ru: "Только лестница / ручной перенос", en: "Stairs only / manual carry" },
  { id: "restricted", ru: "Ограничен подъезд или проход", en: "Restricted vehicle or pedestrian access" },
];

const siteAccessOptions = [
  { id: "unknown", ru: "Не уточнено", en: "Not specified" },
  { id: "clear", ru: "Свободный подъезд и проход", en: "Clear vehicle and pedestrian access" },
  { id: "restricted", ru: "Ограничен подъезд или проход", en: "Restricted access" },
  { id: "lifting", ru: "Нужна подъёмная или спецтехника", en: "Lifting or specialist equipment needed" },
];

const siteScheduleOptions = [
  { id: "unknown", ru: "Не уточнено", en: "Not specified" },
  { id: "day", ru: "Работы в дневное время", en: "Daytime work" },
  { id: "restricted", ru: "Есть ограничения по времени", en: "Restricted working hours" },
  { id: "noise", ru: "Ограничения по шуму", en: "Noise restrictions" },
  { id: "offhours", ru: "Работы вне обычного графика", en: "Out-of-hours work" },
];

const siteLogisticsOptions = [
  { id: "unknown", ru: "Не уточнено", en: "Not specified" },
  { id: "remove", ru: "Вывоз отходов нужен", en: "Waste removal required" },
  { id: "stage", ru: "Нужно временное складирование", en: "Temporary on-site storage needed" },
  { id: "none", ru: "Вывоз не требуется", en: "Waste removal not required" },
];

const wasteLogisticsOptions = [
  { id: "unknown", ru: "Не уточнено", en: "Not specified" },
  { id: "truck", ru: "Машина / контейнер подъезжает к месту погрузки", en: "Truck / container can reach loading point" },
  { id: "carry", ru: "Нужен вынос с расстояния", en: "Waste must be carried from a distance" },
  { id: "loading", ru: "Материал подготовлен к погрузке", en: "Material is ready for loading" },
];

function getSiteConditionsSummary(conditions: SiteConditions, lang: "ru" | "en", slug: string) {
  const isRu = lang === "ru";
  const residential = slug === "apartment-demolition" || slug === "renovation";
  const accessOptions = residential ? residentialAccessOptions : siteAccessOptions;
  const logisticsOptions = slug === "waste-removal" ? wasteLogisticsOptions : siteLogisticsOptions;
  const entries = [
    {
      id: conditions.access,
      options: accessOptions,
      label: isRu ? (residential ? "Этаж / лифт / перенос" : "Доступ к объекту") : (residential ? "Floor / elevator / carry" : "Site access"),
    },
    {
      id: conditions.schedule,
      options: siteScheduleOptions,
      label: isRu ? "Время и ограничения работ" : "Working hours / restrictions",
    },
    {
      id: conditions.logistics,
      options: logisticsOptions,
      label: isRu ? (slug === "waste-removal" ? "Условия погрузки" : "Вывоз и логистика отходов") : (slug === "waste-removal" ? "Loading conditions" : "Waste removal and logistics"),
    },
  ];
  const lines = entries.flatMap(({ id, options, label }) => {
    if (!id || id === "unknown") return [];
    const option = options.find((item) => item.id === id);
    return option ? [label + ": " + option[lang]] : [];
  });
  if (!lines.length) return "";
  return [isRu ? "Условия объекта:" : "Site conditions:", ...lines].join("\n");
}

function formatQuantitySummaryValue(quantity: number, quantityLabel?: string) {
  const unit = (quantityLabel ?? "").toLowerCase();
  if (unit.includes("контейнер") || unit.includes("container")) return String(quantity);
  return String(quantity) + (quantityLabel ? " " + quantityLabel : "");
}

function cleanServiceScopeMessage(message: string) {
  return message
    .split("Состав работ по зонам:")[0]
    .split("Selected work by room:")[0]
    .split("Состав демонтажа здания:")[0]
    .split("Building demolition scope:")[0]
    .split("Состав работ по услуге:")[0]
    .split("Service work scope:")[0]
    .split("Условия объекта:")[0]
    .split("Site conditions:")[0]
    .trim();
}


function getQuantitySummaryLabel(quantityLabel: string | undefined, lang: "ru" | "en") {
  const unit = (quantityLabel ?? "").toLowerCase();
  if (unit.includes("м²") || unit.includes("m²") || unit.includes("sqm")) return lang === "ru" ? "Площадь" : "Area";
  if (unit.includes("м³") || unit.includes("m³") || unit.includes("m3") || unit.includes("куб")) return lang === "ru" ? "Объём" : "Volume";
  if (unit.includes("м.п.") || unit.includes("linear") || unit.includes("погон")) return lang === "ru" ? "Длина" : "Length";
  if (unit.includes("контейнер") || unit.includes("container")) return lang === "ru" ? "Количество контейнеров" : "Number of containers";
  return lang === "ru" ? "Количество" : "Quantity";
}

function getServiceScopeSummary(config: ServiceScopeSelection, slug: string, lang: "ru" | "en", serviceTitle?: string, quantity?: number, quantityLabel?: string) {
  const definition = serviceScopeDefinitions[slug];
  if (!definition || config.selected.length === 0) return "";
  const profile = definition.profiles.find((item) => item.id === config.profile) ?? definition.profiles[0];
  const material = definition.materials.find((item) => item.id === config.material) ?? definition.materials[0];
  const selectedWorks = definition.works.filter((item) => config.selected.includes(item.id));
  const isRu = lang === "ru";
  return [
    isRu ? "Состав работ по услуге:" : "Service work scope:",
    (isRu ? "Услуга: " : "Service: ") + (serviceTitle || definition.title[lang]),
    (isRu ? "Тип / формат: " : "Project type: ") + profile[lang],
    (isRu ? "Материал / условия: " : "Material / conditions: ") + material[lang],
    ...(typeof quantity === "number" && quantity > 0
      ? [getQuantitySummaryLabel(quantityLabel, lang) + ": " + formatQuantitySummaryValue(quantity, quantityLabel)]
      : []),
    (isRu ? "Выбранные работы:" : "Selected work:"),
    ...selectedWorks.map((item) => "• " + item[lang]),
  ].join("\n");
}


const serviceScopeRecommendationRules: Record<string, Record<string, string[]>> = {
  demolition: {
    full: ["roof", "facade", "structure", "interior", "foundation", "utilities", "waste", "cleanup"],
    roof: ["waste", "cleanup"],
    facade: ["waste", "cleanup"],
    structure: ["waste", "cleanup"],
    interior: ["waste", "cleanup"],
    foundation: ["waste", "cleanup"],
  },
  construction: {
    columns: ["beams", "lifting"],
    beams: ["columns", "lifting"],
    slabs: ["lifting"],
    roof: ["lifting", "columns"],
    stairs: ["lifting"],
  },
  renovation: {
    walls: ["floor", "finish"],
    floor: ["walls", "finish"],
    ceiling: ["utilities", "finish"],
    wet: ["plumbing"],
    plumbing: ["wet"],
    utilities: ["finish"],
    doors: ["finish"],
  },
  "waste-removal": {
    delivery: ["transport", "documents"],
    loading: ["delivery", "transport"],
    carryout: ["loading", "transport"],
    swap: ["delivery", "transport"],
    sorting: ["documents"],
  },
  dismantling: {
    electrics: ["waste"],
    plumbing: ["waste"],
    ventilation: ["equipment", "waste"],
    heating: ["plumbing", "waste"],
    equipment: ["waste"],
    cables: ["waste"],
    fire: ["waste"],
  },
  "diamond-cutting": {
    opening: ["water", "cleanup", "reinforcement"],
    slab: ["water", "cleanup", "reinforcement"],
    drilling: ["water", "cleanup"],
    chases: ["cleanup"],
    wall: ["water", "cleanup", "reinforcement"],
  },
};

function getServiceScopeRecommendations(config: ServiceScopeSelection, slug: string) {
  const definition = serviceScopeDefinitions[slug];
  if (!definition || config.selected.length === 0) return [];
  const rules = serviceScopeRecommendationRules[slug] ?? {};
  const suggestedIds = new Set<string>();
  if (slug === "demolition" && config.profile === "full") {
    definition.works.forEach((item) => suggestedIds.add(item.id));
  }
  config.selected.forEach((id) => {
    (rules[id] ?? []).forEach((suggestion) => suggestedIds.add(suggestion));
  });
  return definition.works.filter((item) => suggestedIds.has(item.id) && !config.selected.includes(item.id));
}

function getServiceScopeRecommendationReason(slug: string, itemId: string, lang: "ru" | "en") {
  const ruReasons: Record<string, Record<string, string>> = {
    demolition: {
      waste: "Логистику отходов лучше согласовать до начала демонтажа.",
      cleanup: "Заранее зафиксируйте, в каком состоянии передаётся площадка.",
      structure: "Для полного сноса уточните обследование и последовательность разборки.",
    },
    construction: {
      lifting: "Подъём и доступ техники влияют на последовательность и стоимость монтажа.",
      columns: "Балки и фермы требуют согласованных опор и несущего каркаса.",
    },
    renovation: {
      plumbing: "Инженерные выводы стоит согласовать до закрытия мокрой зоны.",
      wet: "Отделка санузла обычно требует согласования сантехники и гидроизоляции.",
      finish: "Финишный этап зависит от готовности основания и завершения инженерных работ.",
      floor: "Уровни пола лучше увязать с дверями и другими помещениями.",
      utilities: "Проверьте расположение точек до чистовой отделки.",
    },
    "waste-removal": {
      delivery: "Для вывоза потребуется подходящий контейнер и согласованное место установки.",
      transport: "Заранее согласуйте маршрут, подъезд и формат машины.",
      loading: "Погрузка часто требует отдельного расчёта по трудозатратам.",
      documents: "Уточните документы и способ обращения с выбранным видом отходов.",
    },
    dismantling: {
      waste: "После демонтажа нужно определить погрузку и обращение с отходами.",
      equipment: "До разборки оборудования нужно проверить вес, крепления и путь выноса.",
      plumbing: "Проверьте границы отключения, если работы затрагивают трубопроводы.",
    },
    "diamond-cutting": {
      reinforcement: "Перед резкой нужно проверить армирование и допустимость вмешательства.",
      water: "Уточните подачу воды, защиту отделки и сбор шлама.",
      cleanup: "Согласуйте уборку и вывоз остатков после резки.",
    },
  };
  const enReasons: Record<string, Record<string, string>> = {
    demolition: {
      waste: "Agree on debris logistics before demolition starts.",
      cleanup: "Define the condition in which the site will be handed over.",
      structure: "For full demolition, confirm the survey and dismantling sequence.",
    },
    construction: {
      lifting: "Lifting and equipment access affect installation sequence and cost.",
      columns: "Beams and trusses depend on coordinated supports and framing.",
    },
    renovation: {
      plumbing: "Coordinate utility outlets before closing the wet area.",
      wet: "Bathroom finishes need coordination with plumbing and waterproofing.",
      finish: "Finishes depend on substrate readiness and completed utilities.",
      floor: "Floor levels should be coordinated with doors and adjacent rooms.",
      utilities: "Confirm utility points before applying final finishes.",
    },
    "waste-removal": {
      delivery: "Waste removal requires a suitable container and a confirmed placement area.",
      transport: "Confirm vehicle access, route and vehicle type in advance.",
      loading: "Loading may require a separate labour estimate.",
      documents: "Confirm the documents required for the selected waste type.",
    },
    dismantling: {
      waste: "Plan loading and waste handling after dismantling.",
      equipment: "Check equipment weight, fixings and removal route before dismantling.",
      plumbing: "Confirm isolation limits when pipework is involved.",
    },
    "diamond-cutting": {
      reinforcement: "Check reinforcement and cutting feasibility before work.",
      water: "Confirm water supply, surface protection and slurry collection.",
      cleanup: "Agree on cleanup and removal of residues after cutting.",
    },
  };
  return (lang === "ru" ? ruReasons : enReasons)[slug]?.[itemId]
    ?? (lang === "ru" ? "Уточните эту позицию на этапе обследования объекта." : "Confirm this item during site assessment.");
}

function getServiceScopeInsight(slug: string, profileId: string, materialId: string, selected: string[], lang: "ru" | "en") {
  const isRu = lang === "ru";
  if (slug === "dismantling" && materialId !== "isolated") {
    return {
      title: isRu ? "Сначала проверьте отключение систем" : "Verify utility isolation first",
      body: isRu
        ? "В заявке будет отмечено, что отключение не подтверждено. Работы с действующими электросетями, трубопроводами и оборудованием нельзя начинать без разрешения ответственного лица и безопасной изоляции."
        : "The request will indicate that isolation is not confirmed. Work on live electrical systems, pipework and equipment must not begin without authorization and safe isolation.",
      warning: true,
    };
  }
  if (slug === "diamond-cutting" && selected.some((id) => ["opening", "slab", "chases", "wall"].includes(id))) {
    return {
      title: isRu ? "Проверьте конструкцию перед резкой" : "Check the structure before cutting",
      body: isRu
        ? "Проёмы, штробы и резка стен/перекрытий могут затрагивать несущие элементы. Допустимость резки и необходимость проекта подтверждаются до начала работ."
        : "Openings, chases and wall/slab cuts may affect structural elements. Feasibility and any design approvals must be confirmed before work.",
      warning: true,
    };
  }
  if (slug === "demolition" && (profileId === "full" || selected.includes("structure") || selected.includes("foundation"))) {
    return {
      title: isRu ? "Нужна проверка объекта до демонтажа" : "Assess the site before demolition",
      body: isRu
        ? "Для полного сноса или работ с каркасом и фундаментом до начала уточняются конструктивная схема, соседние здания, ограждение, техника и необходимые согласования."
        : "For full demolition or work on the frame/foundation, verify the structural system, neighbouring buildings, barriers, equipment and required approvals first.",
      warning: true,
    };
  }
  if (slug === "construction" && selected.some((id) => ["columns", "beams", "slabs", "roof"].includes(id))) {
    return {
      title: isRu ? "Сверьте монтаж с проектом" : "Verify installation against the design",
      body: isRu
        ? "Перед монтажом несущих элементов нужно проверить проектные узлы, временное раскрепление, грузоподъёмность техники и последовательность подъёма."
        : "Before installing structural members, verify connection details, temporary bracing, equipment capacity and lifting sequence.",
      warning: true,
    };
  }
  if (slug === "waste-removal" && ["concrete", "soil"].includes(materialId)) {
    return {
      title: isRu ? "Проверьте массу и состав отходов" : "Check waste weight and composition",
      body: isRu
        ? "Для грунта, бетона и кирпича важно учитывать не только объём, но и массу, ограничения контейнера и допустимую нагрузку автомобиля."
        : "For soil, concrete and brick, consider not only volume but also weight, container limits and vehicle payload.",
      warning: true,
    };
  }
  if (slug === "renovation" && selected.includes("wet") && !selected.includes("plumbing")) {
    return {
      title: isRu ? "Не забудьте увязать мокрую зону с сантехникой" : "Coordinate the wet area with plumbing",
      body: isRu
        ? "Перед отделкой санузла нужно определить сантехнические выводы и проверить гидроизоляцию. Сантехнические работы можно добавить в рекомендации ниже."
        : "Before finishing a bathroom, confirm plumbing outlets and waterproofing. Plumbing can be added from the recommendations below.",
      warning: false,
    };
  }
  return null;
}

function ServiceScopeConfigurator({
  slug,
  lang,
  value,
  onChange,
  onApply,
  quantity,
  quantityLabel,
}: {
  slug: string;
  lang: "ru" | "en";
  value: ServiceScopeSelection;
  onChange: React.Dispatch<React.SetStateAction<ServiceScopeSelection>>;
  onApply: (selection: ServiceScopeSelection) => void;
  quantity: number;
  quantityLabel: string;
}) {
  const definition = serviceScopeDefinitions[slug];
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  if (!definition) return null;
  const isRu = lang === "ru";
  const profileId = definition.profiles.some((item) => item.id === value.profile) ? value.profile : definition.profiles[0].id;
  const materialId = definition.materials.some((item) => item.id === value.material)
    ? value.material
    : definition.materials.find((item) => item.id === "unknown")?.id ?? definition.materials[0].id;
  const selected = (id: string) => value.selected.includes(id);
  const normalizeSelection = (current: ServiceScopeSelection): ServiceScopeSelection => ({
    profile: definition.profiles.some((item) => item.id === current.profile) ? current.profile : definition.profiles[0].id,
    material: definition.materials.some((item) => item.id === current.material)
      ? current.material
      : definition.materials.find((item) => item.id === "unknown")?.id ?? definition.materials[0].id,
    selected: current.selected,
  });
  const toggle = (id: string) => onChange((current) => {
    const normalized = normalizeSelection(current);
    return {
      ...normalized,
      selected: current.selected.includes(id)
        ? current.selected.filter((item) => item !== id)
        : [...current.selected, id],
    };
  });
  const chooseProfile = (id: string) => onChange((current) => ({ ...current, profile: id }));
  const chooseMaterial = (id: string) => onChange((current) => ({ ...current, material: id }));
  const zonePath = (zone: ServiceScopeZone) => viewMode === "3d" ? zone.d3 : zone.d2;
  const recommendations = getServiceScopeRecommendations({ ...value, profile: profileId, material: materialId }, slug);
  const insight = getServiceScopeInsight(slug, profileId, materialId, value.selected, lang);
  const selectionProgress = Math.min(100, Math.round((value.selected.length / definition.works.length) * 100));
  const addRecommendations = () => onChange((current) => {
    const normalized = normalizeSelection(current);
    const currentRecommendations = getServiceScopeRecommendations(normalized, slug);
    return {
      ...normalized,
      selected: Array.from(new Set([...current.selected, ...currentRecommendations.map((item) => item.id)])),
    };
  });

  return (
    <section className="skol-service-scope mb-8 overflow-hidden border border-border/60 bg-card/35">
      <div className="border-b border-border/55 p-5 sm:p-7 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-[.95fr_1.05fr] sm:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-primary">
              <span className="h-px w-6 bg-primary" /> {definition.code}
            </p>
            <h2 className="max-w-xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">{definition.title[lang]}</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{definition.intro[lang]}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[.98fr_1.02fr]">
        <div className="min-w-0 border-b border-border/55 p-3 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">
              {viewMode === "3d" ? (isRu ? "Объёмная схема / выберите элемент" : "3D schematic / select an element") : (isRu ? "План / выберите элемент" : "Plan / select an element")}
            </span>
            <div className="flex items-center gap-1 border border-border/60 bg-background/45 p-1">
              <button type="button" onClick={() => setViewMode("3d")} aria-pressed={viewMode === "3d"}
                className={"min-h-8 px-3 text-[10px] font-semibold transition-colors " + (viewMode === "3d" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>3D / {isRu ? "Объём" : "Volume"}</button>
              <button type="button" onClick={() => setViewMode("2d")} aria-pressed={viewMode === "2d"}
                className={"min-h-8 px-3 text-[10px] font-semibold transition-colors " + (viewMode === "2d" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>2D / {isRu ? "План" : "Plan"}</button>
            </div>
          </div>
          <div className="relative overflow-hidden border border-border/55 bg-background/50 p-1.5 sm:p-3">
            <div className="pointer-events-none absolute inset-0 opacity-55" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)/.055) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/.055) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <svg viewBox="0 0 620 390" className="relative z-10 block h-auto w-full" role="group" aria-label={definition.title[lang]}>
              <defs>
                <linearGradient id={"scope-active-" + slug} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary) / .46)" />
                  <stop offset="100%" stopColor="hsl(var(--primary) / .12)" />
                </linearGradient>
              </defs>
              {definition.kind === "demolition" && (
                <g fill="none" stroke="hsl(var(--foreground) / .22)" strokeWidth="1.2">
                  <path d={viewMode === "3d" ? "M145 130 L310 43 L478 132 L310 224 Z M145 130 L145 230 L310 322 L310 224 M310 224 L478 132 L478 232 L310 322 M145 257 L310 350 L478 259" : "M146 95 L310 36 L474 95 L474 283 L310 340 L146 283 Z M146 121 L474 121 M310 62 V318 M146 190 H474 M146 260 H474"} />
                  <path d="M160 145L296 220M182 124L317 201M333 207L454 141M333 232L454 166" strokeDasharray="4 5" />
                </g>
              )}
              {definition.kind === "construction" && (
                <g fill="none" stroke="hsl(var(--foreground) / .28)" strokeWidth="2">
                  <path d={viewMode === "3d" ? "M145 126L310 35L472 126L310 218Z M145 126V237L310 329V218 M310 218V329L472 237V126 M145 182L310 274L472 182 M145 237L310 145L472 237" : "M145 116L310 40L472 116V316L310 382L145 316Z M145 135H472 M145 205H472 M145 275H472 M200 90V340 M255 65V360 M365 65V360 M420 90V340"} />
                  <path d="M145 126L472 237M472 126L145 237" strokeDasharray="5 5" opacity=".5" />
                </g>
              )}
              {definition.kind === "renovation" && (
                <g fill="none" stroke="hsl(var(--foreground) / .22)" strokeWidth="1.3">
                  <path d={viewMode === "3d" ? "M145 130L310 43L478 132L310 224Z M145 130V235L310 327V224 M310 224L478 132V235L310 327 M200 158L310 98L422 157L310 218Z" : "M150 90L310 35L470 90V302L310 350L150 302Z M150 195H470 M310 35V350 M150 90L310 145L470 90 M150 302L310 245L470 302"} />
                </g>
              )}
              {definition.kind === "waste" && (
                <g fill="none" stroke="hsl(var(--foreground) / .28)" strokeWidth="1.5">
                  <path d={viewMode === "3d" ? "M200 190L250 160H455L405 190Z M200 190V265H405V190 M405 190L455 160V235L405 265 M225 207V251M260 207V251M295 207V251M330 207V251M365 207V251" : "M170 145H430V275H170Z M198 166V255M236 166V255M274 166V255M312 166V255M350 166V255M388 166V255 M70 290H540"} />
                  <path d="M82 150L123 128L165 151L124 175Z" />
                  <circle cx="445" cy="298" r="16" /><circle cx="492" cy="298" r="16" />
                </g>
              )}
              {definition.kind === "systems" && (
                <g fill="none" stroke="hsl(var(--foreground) / .28)" strokeWidth="2">
                  <path d={viewMode === "3d" ? "M65 100H240V153H65Z M280 100H450V153H280Z M65 205H240V258H65Z M280 205H450V258H280Z M210 280L310 225L410 280L310 335Z" : "M65 85H255V135H65Z M300 85H500V135H300Z M65 180H255V230H65Z M300 180H500V230H300Z M210 265H410V328H210Z"} />
                  <path d="M82 126H220M295 126H435M82 231H220M295 231H435" strokeDasharray="5 5" />
                  <circle cx="94" cy="90" r="8" /><circle cx="470" cy="170" r="8" />
                </g>
              )}
              {definition.kind === "cutting" && (
                <g fill="none" stroke="hsl(var(--foreground) / .28)" strokeWidth="1.5">
                  <path d={viewMode === "3d" ? "M130 78H430V308H130Z M130 78L170 58H470L430 78 M430 78L470 58V288L430 308" : "M100 60H470V320H100Z M120 80H450V300H120Z"} />
                  <path d="M145 95H414M145 121H414M145 147H414M145 173H414M145 199H414M145 225H414M145 251H414M145 277H414M170 82V304M210 82V304M250 82V304M290 82V304M330 82V304M370 82V304M410 82V304" strokeDasharray="3 5" opacity=".7" />
                  <path d="M205 175H345V308H205Z" strokeDasharray="6 5" />
                  <circle cx="395" cy="120" r="30" />
                  <circle cx="395" cy="120" r="17" />
                </g>
              )}
              {definition.zones.map((zone) => (
                <g key={zone.id} role="button" tabIndex={0} aria-label={zone[lang]} aria-pressed={selected(zone.id)}
                  onClick={() => toggle(zone.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggle(zone.id);
                    }
                  }}
                  style={{ cursor: "pointer", outline: "none" }}>
                  <path d={zonePath(zone)}
                    fill={selected(zone.id) ? "url(#scope-active-" + slug + ")" : "hsl(var(--card) / .22)"}
                    stroke={selected(zone.id) ? "hsl(var(--primary))" : "hsl(var(--foreground) / .28)"}
                    strokeWidth={selected(zone.id) ? 3 : 1.25} />
                  <text x={zone.x} y={zone.y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight={selected(zone.id) ? 700 : 500}
                    fill="hsl(var(--foreground) / .95)" style={{ pointerEvents: "none" }}>{isRu ? zone.ru.toUpperCase() : zone.en.toUpperCase()}</text>
                  {selected(zone.id) && <circle cx={zone.x} cy={zone.y + 15} r="3.5" fill="hsl(var(--primary))" pointerEvents="none" />}
                </g>
              ))}
              <g fill="hsl(var(--muted-foreground))" fontSize="8" fontFamily="ui-monospace, monospace" letterSpacing="1.2">
                <text x="28" y="28">SKOL / {definition.code.split("/")[1].trim()}</text>
                <text x="440" y="374" textAnchor="end">{isRu ? "СХЕМА УСЛОВНАЯ" : "SCHEMATIC ONLY"}</text>
              </g>
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {definition.zones.map((zone) => (
              <button key={zone.id} type="button" onClick={() => toggle(zone.id)} aria-pressed={selected(zone.id)}
                className={"min-h-9 border px-3 py-2 text-xs font-medium transition-colors " + (selected(zone.id) ? "border-primary bg-primary/10 text-foreground" : "border-border/55 bg-background/40 text-muted-foreground hover:text-foreground")}>
                {zone[lang]}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">{definition.note[lang]}</p>
        </div>

        <div className="min-w-0 p-4 sm:p-6 lg:p-7">
          <div className="mb-6">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">{isRu ? "01 / Параметры задачи" : "01 / Project parameters"}</p>
            <p className="mb-2 text-sm font-semibold text-foreground">{definition.profileLabel[lang]}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {definition.profiles.map((item) => (
                <button key={item.id} type="button" onClick={() => chooseProfile(item.id)} aria-pressed={profileId === item.id}
                  className={"min-h-10 border px-3 py-2 text-left text-xs font-semibold transition-colors " + (profileId === item.id ? "border-primary bg-primary/10 text-foreground" : "border-border/50 bg-background/35 text-muted-foreground hover:text-foreground")}>
                  {item[lang]}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold text-foreground">{definition.materialLabel[lang]}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {definition.materials.map((item) => (
                <button key={item.id} type="button" onClick={() => chooseMaterial(item.id)} aria-pressed={materialId === item.id}
                  className={"min-h-10 border px-3 py-2 text-left text-xs transition-colors " + (materialId === item.id ? "border-primary bg-primary/10 text-foreground" : "border-border/50 bg-background/35 text-muted-foreground hover:text-foreground")}>
                  {item[lang]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">{isRu ? "02 / Состав работ" : "02 / Work scope"}</p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{isRu ? "Что включить в заявку" : "What to include"}</h3>
              </div>
              <span className="font-mono text-xs text-primary">{String(value.selected.length).padStart(2, "0")} / {String(definition.works.length).padStart(2, "0")}</span>
            </div>
            <div className="mb-4 h-1.5 overflow-hidden bg-secondary" role="progressbar" aria-label={isRu ? "Выбранные позиции" : "Selected work items"} aria-valuemin={0} aria-valuemax={definition.works.length} aria-valuenow={value.selected.length}>
              <div className="h-full bg-primary transition-all duration-300" style={{ width: selectionProgress + "%" }} />
            </div>
            <div className="space-y-2">
              {definition.works.map((item) => (
                <button key={item.id} type="button" onClick={() => toggle(item.id)} aria-pressed={selected(item.id)}
                  className={"flex w-full items-start gap-3 border p-3 text-left transition-colors " + (selected(item.id) ? "border-primary/70 bg-primary/[.08]" : "border-border/50 bg-background/30 hover:border-border")}>
                  <span className={"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[10px] " + (selected(item.id) ? "border-primary bg-primary text-primary-foreground" : "border-border text-transparent")}>✓</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">{item[lang]}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">{isRu ? item.noteRu : item.noteEn}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          {insight && (
            <div className={"mt-5 border p-4 " + (insight.warning ? "border-primary/45 bg-primary/[.07]" : "border-border/60 bg-secondary/35")}>
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-primary" />
                {insight.title}
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{insight.body}</p>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="mt-5 border border-border/60 bg-secondary/25 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[.16em] text-primary">{isRu ? "СКОЛ / РЕКОМЕНДАЦИИ" : "SKOL / SUGGESTIONS"}</p>
                  <h4 className="mt-1 text-sm font-semibold text-foreground">{isRu ? "Что стоит учесть дополнительно" : "What to consider next"}</h4>
                </div>
                <span className="font-mono text-xs text-primary">{String(recommendations.length).padStart(2, "0")}</span>
              </div>
              <div className="mt-3 space-y-3">
                {recommendations.slice(0, 4).map((item) => (
                  <div key={item.id} className="border-t border-border/40 pt-3 first:border-t-0 first:pt-0">
                    <p className="text-sm font-medium text-foreground">{item[lang]}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{getServiceScopeRecommendationReason(slug, item.id, lang)}</p>
                  </div>
                ))}
              </div>
              {recommendations.length > 4 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {isRu ? "И ещё " + (recommendations.length - 4) + " рекомендаций." : "Plus " + (recommendations.length - 4) + " more suggestions."}
                </p>
              )}
              <button type="button" onClick={addRecommendations}
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 border border-primary/60 px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-primary/10">
                {isRu ? "Добавить рекомендации в состав" : "Add suggestions to scope"} <ArrowUpRight className="h-4 w-4" />
              </button>
              <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
                {isRu ? "Рекомендации не добавляются автоматически — вы сами подтверждаете состав." : "Suggestions are not added automatically; you choose what to include."}
              </p>
            </div>
          )}

          {value.selected.length > 0 && (
            <div className="mt-5 border border-primary/30 bg-primary/[.06] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{isRu ? "Состав готов к передаче" : "Scope ready to transfer"}</p>
                <button type="button" onClick={() => onChange({ ...value, selected: [] })} className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">{isRu ? "Очистить" : "Clear"}</button>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {isRu ? "Выбранные работы и параметры попадут в описание заявки. Цена не рассчитывается по схеме и уточняется после оценки объекта." : "Selected work and parameters will be added to the request. The diagram does not calculate price; it is confirmed after site assessment."}
              </p>
              <button type="button" onClick={() => onApply({ profile: profileId, material: materialId, selected: [...value.selected] })}
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
  const [siteConditions, setSiteConditions] = useState<SiteConditions>(emptySiteConditions);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedService, setSubmittedService] = useState<string | null>(null);
  const [submittedPrice, setSubmittedPrice] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedApartmentTasks, setSelectedApartmentTasks] = useState<ApartmentScopeSelection[]>([]);
  const [serviceScopeSelection, setServiceScopeSelection] = useState<ServiceScopeSelection>({
    profile: "",
    material: "",
    selected: [],
  });

  useEffect(() => {
    setServiceScopeSelection({ profile: "", material: "", selected: [] });
    setSiteConditions(emptySiteConditions);
  }, [slug]);

  const [buildingDemolitionConfig, setBuildingDemolitionConfig] = useState<BuildingDemolitionConfig>({
    objectType: "industrial",
    structureType: "mixed",
    selected: [],
  });

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

  const addApartmentScopeRecommendations = (workIds: string[]) => {
    setSelectedApartmentTasks((current) => {
      const existingIds = new Set(current.map((item) => item.workId));
      const additions = workIds
        .filter((workId) => !existingIds.has(workId))
        .map((workId) => ({ roomId: "all" as ApartmentRoomId, workId }));
      return [...current, ...additions];
    });
  };

  const applyApartmentScopeToRequest = () => {
    const scopeText = getApartmentScopeSummary(selectedApartmentTasks, lang, area[0], unitLabel);
    if (!scopeText) return;
    setMessage((current) => {
      const cleanMessage = cleanServiceScopeMessage(current);
      const conditionsText = service ? getSiteConditionsSummary(siteConditions, lang, service.slug) : "";
      return [cleanMessage, scopeText, conditionsText].filter(Boolean).join("\n\n");
    });
    document.getElementById("service-request-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const addBuildingDemolitionRecommendations = (workIds: string[]) => {
    setBuildingDemolitionConfig((current) => ({
      ...current,
      selected: Array.from(new Set([...current.selected, ...workIds])),
    }));
  };

  const applyBuildingDemolitionScopeToRequest = () => {
    const scopeText = getBuildingDemolitionSummary(buildingDemolitionConfig, lang, area[0], unitLabel);
    if (!scopeText) return;
    setMessage((current) => {
      const cleanMessage = cleanServiceScopeMessage(current);
      const conditionsText = service ? getSiteConditionsSummary(siteConditions, lang, service.slug) : "";
      return [cleanMessage, scopeText, conditionsText].filter(Boolean).join("\n\n");
    });
    document.getElementById("service-request-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const applyServiceScopeToRequest = (selection: ServiceScopeSelection = serviceScopeSelection) => {
    if (!service) return;
    const scopeText = getServiceScopeSummary(selection, service.slug, lang, t(service.titleKey), area[0], unitLabel);
    if (!scopeText) return;
    const conditionsText = getSiteConditionsSummary(siteConditions, lang, service.slug);
    setMessage((current) => [cleanServiceScopeMessage(current), scopeText, conditionsText].filter(Boolean).join("\n\n"));
    document.getElementById("service-request-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const isWaste = service?.slug === "waste-removal";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);

    try {
      const scopeSummary = service?.slug === "apartment-demolition"
        ? getApartmentScopeSummary(selectedApartmentTasks, lang, area[0], unitLabel)
        : service?.slug === "building-demolition"
          ? getBuildingDemolitionSummary(buildingDemolitionConfig, lang, area[0], unitLabel)
          : service && serviceScopeDefinitions[service.slug]
            ? getServiceScopeSummary(serviceScopeSelection, service.slug, lang, t(service.titleKey), area[0], unitLabel)
            : "";
      const cleanMessage = cleanServiceScopeMessage(message);
      const conditionsSummary = service ? getSiteConditionsSummary(siteConditions, lang, service.slug) : "";
      const finalMessage = [cleanMessage, scopeSummary, conditionsSummary].filter(Boolean).join("\n\n");

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
            onAddRecommendations={addApartmentScopeRecommendations}
            onApply={applyApartmentScopeToRequest}
          />
        </AnimatedSection>
      )}

      {service.slug === "building-demolition" && (
        <AnimatedSection delay={0.08}>
          <BuildingDemolitionStudio
            lang={lang}
            config={buildingDemolitionConfig}
            onChange={setBuildingDemolitionConfig}
            onAddRecommendations={addBuildingDemolitionRecommendations}
            onApply={applyBuildingDemolitionScopeToRequest}
          />
        </AnimatedSection>
      )}

      {serviceScopeDefinitions[service.slug] && (
        <AnimatedSection delay={0.08}>
          <ServiceScopeConfigurator
            key={service.slug}
            slug={service.slug}
            lang={lang}
            value={serviceScopeSelection}
            onChange={setServiceScopeSelection}
            onApply={applyServiceScopeToRequest}
            quantity={area[0]}
            quantityLabel={unitLabel}
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
                  ? `${getQuantitySummaryLabel(unitLabel, lang)} — только один из факторов. Итог зависит от материалов, доступа, ограничений и состава работ.`
                  : `${getQuantitySummaryLabel(unitLabel, lang)} is only one factor. Final cost depends on materials, access, constraints and scope.`}
              </p>

              <div className="mb-6 border-t border-border/30 pt-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{lang === "ru" ? "Условия объекта" : "Site conditions"}</h4>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{lang === "ru" ? "Уточните факторы, которые влияют на организацию работ. Необязательные поля." : "Clarify factors that affect planning. All fields are optional."}</p>
                  </div>
                  <span className="font-mono text-[9px] text-primary">{lang === "ru" ? "ДАННЫЕ" : "INPUT"}</span>
                </div>
                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-1.5 block text-xs text-muted-foreground">{lang === "ru" ? (service.slug === "apartment-demolition" || service.slug === "renovation" ? "Этаж / лифт / перенос" : "Доступ к объекту") : (service.slug === "apartment-demolition" || service.slug === "renovation" ? "Floor / elevator / carry" : "Site access")}</span>
                    <select
                      value={siteConditions.access}
                      onChange={(event) => setSiteConditions((current) => ({ ...current, access: event.target.value }))}
                      className="min-h-10 w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    >
                      {(service.slug === "apartment-demolition" || service.slug === "renovation" ? residentialAccessOptions : siteAccessOptions).map((option) => (
                        <option key={option.id} value={option.id}>{option[lang]}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs text-muted-foreground">{lang === "ru" ? "Время и ограничения работ" : "Working hours / restrictions"}</span>
                    <select
                      value={siteConditions.schedule}
                      onChange={(event) => setSiteConditions((current) => ({ ...current, schedule: event.target.value }))}
                      className="min-h-10 w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    >
                      {siteScheduleOptions.map((option) => <option key={option.id} value={option.id}>{option[lang]}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs text-muted-foreground">{lang === "ru" ? (service.slug === "waste-removal" ? "Условия погрузки" : "Вывоз и логистика отходов") : (service.slug === "waste-removal" ? "Loading conditions" : "Waste removal and logistics")}</span>
                    <select
                      value={siteConditions.logistics}
                      onChange={(event) => setSiteConditions((current) => ({ ...current, logistics: event.target.value }))}
                      className="min-h-10 w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    >
                      {(service.slug === "waste-removal" ? wasteLogisticsOptions : siteLogisticsOptions).map((option) => (
                        <option key={option.id} value={option.id}>{option[lang]}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <p className="mt-3 text-[11px] leading-4 text-muted-foreground">{lang === "ru" ? "Выбранные условия будут добавлены в текст заявки. Неуточнённые поля не попадут в итог." : "Selected conditions will be attached to the request. Unspecified fields are omitted."}</p>
              </div>

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
