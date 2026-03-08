import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Lang = "ru" | "en";

const translations = {
  // Header
  "nav.services": { ru: "Услуги", en: "Services" },
  "nav.projects": { ru: "Проекты", en: "Projects" },
  "nav.about": { ru: "О нас", en: "About" },
  "nav.contacts": { ru: "Контакты", en: "Contacts" },
  "nav.news": { ru: "Новости", en: "News" },
  "header.search": { ru: "Демонтаж, строительство...", en: "Demolition, construction..." },
  "header.contact": { ru: "Связаться", en: "Contact" },

  // Intro
  "intro.tagline": { ru: "Строим будущее. Разбираем прошлое.", en: "Building the future. Dismantling the past." },

  // Category pills
  "cat.demolition": { ru: "Демонтаж", en: "Demolition" },
  "cat.construction": { ru: "Строительство", en: "Construction" },
  "cat.renovation": { ru: "Ремонт", en: "Renovation" },
  "cat.facades": { ru: "Фасады", en: "Facades" },
  "cat.roofing": { ru: "Кровля", en: "Roofing" },
  "cat.foundation": { ru: "Фундамент", en: "Foundation" },
  "cat.electrical": { ru: "Электрика", en: "Electrical" },
  "cat.apartments": { ru: "Квартиры", en: "Apartments" },
  "cat.buildings": { ru: "Здания", en: "Buildings" },

  // Bento grid
  "bento.from": { ru: "от 500₽", en: "from $7" },
  "bento.perSqm": { ru: "/м²", en: "/sq.m" },
  "bento.demolition": { ru: "Демонтаж зданий", en: "Building Demolition" },
  "bento.bestDeals": { ru: "Лучшие решения", en: "Best Solutions" },
  "bento.dealsDesc": { ru: "Скидки 50–60% на комплекс работ по демонтажу и вывозу мусора", en: "50–60% off for complex demolition and waste removal projects" },
  "bento.team": { ru: "Наша команда", en: "Our Team" },
  "bento.teamDesc": { ru: "120+ профессионалов с опытом работы более 15 лет в демонтаже и строительстве", en: "120+ professionals with 15+ years experience in demolition and construction" },
  "bento.subscribe": { ru: "Подписка", en: "Subscribe" },
  "bento.subscribeBtn": { ru: "Подписаться", en: "Subscribe" },
  "bento.exclusive": { ru: "Эксклюзив", en: "Exclusive" },
  "bento.exclusiveTitle": { ru: "Алмазная резка бетона", en: "Diamond Concrete Cutting" },
  "bento.exclusiveDesc": { ru: "Точный и бесшумный демонтаж конструкций с алмазным оборудованием. Без вибрации и пыли.", en: "Precise and silent structural demolition with diamond equipment. No vibration or dust." },
  "bento.open": { ru: "Открыть", en: "Open" },
  "bento.office": { ru: "Наш офис", en: "Our Office" },
  "bento.address": { ru: "г. Москва, ул. Строителей, д. 15", en: "15 Stroiteley St., Moscow" },
  "bento.hours": { ru: "Пн–Пт: 9:00–18:00 | Сб: 10:00–15:00", en: "Mon–Fri: 9:00–18:00 | Sat: 10:00–15:00" },

  // News
  "news.title": { ru: "Новости", en: "News" },
  "news.1.title": { ru: "Завершён демонтаж промышленного комплекса в Подмосковье", en: "Industrial complex demolition completed in Moscow region" },
  "news.1.date": { ru: "28 февраля 2026", en: "February 28, 2026" },
  "news.1.desc": { ru: "Наша команда успешно завершила масштабный проект по демонтажу заброшенного промышленного комплекса площадью 12 000 м². Работы выполнены за 45 дней с полным вывозом строительного мусора.", en: "Our team successfully completed a large-scale demolition project of an abandoned industrial complex spanning 12,000 sq.m. Work completed in 45 days with full waste removal." },
  "news.2.title": { ru: "STRUKTURA получила сертификат ISO 14001", en: "STRUKTURA obtains ISO 14001 certification" },
  "news.2.date": { ru: "15 февраля 2026", en: "February 15, 2026" },
  "news.2.desc": { ru: "Мы подтвердили соответствие международным стандартам экологического менеджмента. Все работы по демонтажу проводятся с минимальным воздействием на окружающую среду.", en: "We confirmed compliance with international environmental management standards. All demolition work is carried out with minimal environmental impact." },
  "news.3.title": { ru: "Новая техника для сноса многоэтажных зданий", en: "New equipment for multi-story building demolition" },
  "news.3.date": { ru: "3 февраля 2026", en: "February 3, 2026" },
  "news.3.desc": { ru: "Парк техники пополнился экскаваторами с удлинённой стрелой для высотного демонтажа до 40 метров. Это позволяет выполнять работы быстрее и безопаснее.", en: "Our fleet expanded with long-reach excavators for high-altitude demolition up to 40 meters. This enables faster and safer operations." },
  "news.readMore": { ru: "Читать далее", en: "Read more" },

  // Stats
  "stats.projects": { ru: "Проектов выполнено", en: "Projects Completed" },
  "stats.years": { ru: "Лет на рынке", en: "Years in Business" },
  "stats.clients": { ru: "Довольных клиентов", en: "Satisfied Clients" },
  "stats.sqm": { ru: "м² демонтировано", en: "sq.m demolished" },

  // Services
  "services.title": { ru: "Наши услуги", en: "Our Services" },
  "services.all": { ru: "Все услуги", en: "All Services" },
  "services.demolition": { ru: "Демонтаж зданий", en: "Building Demolition" },
  "services.demolitionDesc": { ru: "Полный и частичный демонтаж промышленных и жилых зданий любой сложности с вывозом мусора", en: "Full and partial demolition of industrial and residential buildings of any complexity with waste removal" },
  "services.construction": { ru: "Монтаж конструкций", en: "Structure Assembly" },
  "services.constructionDesc": { ru: "Монтаж металлоконструкций, железобетонных элементов и сборных конструкций", en: "Assembly of metal structures, reinforced concrete elements and prefab structures" },
  "services.renovation": { ru: "Ремонт и отделка", en: "Renovation & Finishing" },
  "services.renovationDesc": { ru: "Капитальный и косметический ремонт квартир, офисов и коммерческих помещений", en: "Major and cosmetic renovation of apartments, offices and commercial spaces" },
  "services.apartmentDemo": { ru: "Демонтаж квартир", en: "Apartment Demolition" },
  "services.apartmentDemoDesc": { ru: "Снос перегородок, демонтаж полов, стяжки, штукатурки. Подготовка квартиры к ремонту под ключ.", en: "Wall removal, floor demolition, screed, plaster. Complete apartment preparation for renovation." },
  "services.buildingDemo": { ru: "Снос зданий", en: "Building Demolition" },
  "services.buildingDemoDesc": { ru: "Полный снос промышленных объектов, складов, гаражей. Механизированный и ручной демонтаж.", en: "Complete demolition of industrial facilities, warehouses, garages. Mechanized and manual demolition." },
  "services.wasteRemoval": { ru: "Вывоз мусора", en: "Waste Removal" },
  "services.wasteRemovalDesc": { ru: "Погрузка и вывоз строительного мусора контейнерами от 8 до 27 м³. Утилизация по закону.", en: "Loading and removal of construction waste in 8-27 m³ containers. Legal disposal." },
  "services.dismantling": { ru: "Демонтаж коммуникаций", en: "Utility Dismantling" },
  "services.dismantlingDesc": { ru: "Демонтаж электрики, сантехники, вентиляции, отопления. Безопасное отключение и разборка.", en: "Dismantling of electrical, plumbing, ventilation, heating systems. Safe disconnection and disassembly." },
  "services.concrete": { ru: "Алмазная резка", en: "Diamond Cutting" },
  "services.concreteDesc": { ru: "Алмазное бурение и резка бетона, кирпича, железобетона. Без вибрации и пыли.", en: "Diamond drilling and cutting of concrete, brick, reinforced concrete. No vibration or dust." },

  // Services page
  "services.pageTitle": { ru: "Все услуги", en: "All Services" },
  "services.pageSubtitle": { ru: "Полный спектр демонтажных и строительных работ", en: "Full range of demolition and construction services" },
  "services.orderBtn": { ru: "Заказать", en: "Order" },
  "services.priceFrom": { ru: "от", en: "from" },

  // Process
  "process.title": { ru: "Как мы работаем", en: "How We Work" },
  "process.subtitle": { ru: "Четыре простых шага до результата", en: "Four simple steps to results" },
  "process.step1": { ru: "Заявка", en: "Request" },
  "process.step1Desc": { ru: "Оставьте заявку, и мы свяжемся в течение 30 минут", en: "Submit a request and we'll contact you within 30 minutes" },
  "process.step2": { ru: "Оценка", en: "Assessment" },
  "process.step2Desc": { ru: "Бесплатный выезд специалиста и точный расчёт стоимости", en: "Free specialist visit and precise cost estimate" },
  "process.step3": { ru: "Выполнение", en: "Execution" },
  "process.step3Desc": { ru: "Работы точно в срок с соблюдением всех стандартов", en: "Work on time and up to all standards" },
  "process.step4": { ru: "Вывоз мусора", en: "Waste Removal" },
  "process.step4Desc": { ru: "Уборка и вывоз строительного мусора включены в стоимость", en: "Cleanup and debris removal included" },

  // Testimonials
  "testimonials.title": { ru: "Отзывы клиентов", en: "Client Reviews" },
  "testimonials.subtitle": { ru: "Что говорят те, кто уже работал с нами", en: "What our clients say about us" },
  "testimonial.1.name": { ru: "Алексей Петров", en: "Alexey Petrov" },
  "testimonial.1.role": { ru: "Владелец ООО «СтройИнвест»", en: "Owner, StroyInvest LLC" },
  "testimonial.1.text": { ru: "STRUKTURA выполнила демонтаж старого здания за 3 дня. Профессионально, чисто, без лишнего шума. Рекомендую!", en: "STRUKTURA demolished the old building in 3 days. Professional, clean, no unnecessary noise. Highly recommend!" },
  "testimonial.2.name": { ru: "Мария Козлова", en: "Maria Kozlova" },
  "testimonial.2.role": { ru: "Главный инженер, ГК «Развитие»", en: "Chief Engineer, Razvitie Group" },
  "testimonial.2.text": { ru: "Работаем с командой уже 5 лет. Каждый проект — как по часам. Качество неизменно на высоте.", en: "We've worked with the team for 5 years. Every project runs like clockwork. Consistently high quality." },
  "testimonial.3.name": { ru: "Дмитрий Сидоров", en: "Dmitry Sidorov" },
  "testimonial.3.role": { ru: "Частный заказчик", en: "Private Client" },
  "testimonial.3.text": { ru: "Заказывал капитальный ремонт квартиры. Сдали в срок, бюджет не превысили. Очень доволен результатом!", en: "Ordered a major apartment renovation. Delivered on time, within budget. Very satisfied!" },

  // CTA
  "cta.title": { ru: "Готовы начать проект?", en: "Ready to Start?" },
  "cta.desc": { ru: "Получите бесплатную консультацию и расчёт стоимости. Мы перезвоним в течение 30 минут.", en: "Get a free consultation and cost estimate. We'll call you back within 30 minutes." },
  "cta.call": { ru: "Позвонить", en: "Call Us" },
  "cta.request": { ru: "Оставить заявку", en: "Submit Request" },

  // Footer
  "footer.rights": { ru: "© 2026 STRUKTURA. Все права защищены.", en: "© 2026 STRUKTURA. All rights reserved." },
  "footer.servicesTitle": { ru: "Услуги", en: "Services" },
  "footer.companyTitle": { ru: "Компания", en: "Company" },
  "footer.contactTitle": { ru: "Контакты", en: "Contact" },

  // About page
  "about.title": { ru: "О компании STRUKTURA", en: "About STRUKTURA" },
  "about.subtitle": { ru: "Более 15 лет опыта в демонтаже и строительстве", en: "Over 15 years of demolition and construction experience" },
  "about.story": { ru: "STRUKTURA — это команда профессионалов, специализирующаяся на демонтажных работах любой сложности. Мы начали свой путь в 2011 году с небольшой бригады, а сегодня выполняем масштабные проекты по всей России. Наш парк техники включает экскаваторы, погрузчики и специализированное оборудование для алмазной резки.", en: "STRUKTURA is a team of professionals specializing in demolition work of any complexity. We started in 2011 as a small crew and today we carry out large-scale projects across Russia. Our equipment fleet includes excavators, loaders and specialized diamond cutting equipment." },
  "about.mission": { ru: "Наша миссия — безопасный, быстрый и экологичный демонтаж с полным циклом услуг от оценки до вывоза мусора.", en: "Our mission is safe, fast and eco-friendly demolition with a full cycle of services from assessment to waste removal." },
  "about.value1": { ru: "Безопасность", en: "Safety" },
  "about.value1Desc": { ru: "Нулевой уровень травматизма за последние 5 лет. Все сотрудники проходят регулярное обучение по технике безопасности.", en: "Zero injury rate over the past 5 years. All employees undergo regular safety training." },
  "about.value2": { ru: "Качество", en: "Quality" },
  "about.value2Desc": { ru: "Сертифицированы по ISO 9001 и ISO 14001. Используем только проверенные технологии и современное оборудование.", en: "Certified ISO 9001 and ISO 14001. We use only proven technologies and modern equipment." },
  "about.value3": { ru: "Экология", en: "Ecology" },
  "about.value3Desc": { ru: "До 85% строительных отходов направляем на переработку. Минимальное воздействие на окружающую среду.", en: "Up to 85% of construction waste is recycled. Minimal environmental impact." },

  // Contacts page
  "contacts.title": { ru: "Свяжитесь с нами", en: "Contact Us" },
  "contacts.subtitle": { ru: "Мы всегда на связи и готовы обсудить ваш проект", en: "We're always available and ready to discuss your project" },
  "contacts.phone": { ru: "Телефон", en: "Phone" },
  "contacts.email": { ru: "Email", en: "Email" },
  "contacts.address": { ru: "Адрес", en: "Address" },
  "contacts.workHours": { ru: "Режим работы", en: "Working Hours" },
  "contacts.formName": { ru: "Ваше имя", en: "Your name" },
  "contacts.formPhone": { ru: "Телефон", en: "Phone" },
  "contacts.formMessage": { ru: "Опишите ваш проект", en: "Describe your project" },
  "contacts.formSubmit": { ru: "Отправить заявку", en: "Submit Request" },
  "contacts.formSuccess": { ru: "Заявка отправлена! Мы перезвоним в течение 30 минут.", en: "Request sent! We'll call you back within 30 minutes." },

  // Projects page
  "projects.title": { ru: "Наши проекты", en: "Our Projects" },
  "projects.subtitle": { ru: "Примеры выполненных работ", en: "Examples of completed work" },
  "projects.1.title": { ru: "Демонтаж завода ЗИЛ", en: "ZIL Factory Demolition" },
  "projects.1.desc": { ru: "Полный демонтаж производственного корпуса площадью 8 500 м². Срок — 60 дней.", en: "Complete demolition of 8,500 sq.m production building. Timeline — 60 days." },
  "projects.2.title": { ru: "Реконструкция БЦ «Горизонт»", en: "Horizon BC Reconstruction" },
  "projects.2.desc": { ru: "Демонтаж внутренних перегородок и коммуникаций на 12 этажах бизнес-центра.", en: "Interior wall and utility demolition across 12 floors of a business center." },
  "projects.3.title": { ru: "Снос жилого квартала", en: "Residential Block Demolition" },
  "projects.3.desc": { ru: "Демонтаж 5 пятиэтажных домов с подготовкой площадки под новое строительство.", en: "Demolition of 5 five-story buildings with site preparation for new construction." },
  "projects.4.title": { ru: "Демонтаж торгового центра", en: "Shopping Center Demolition" },
  "projects.4.desc": { ru: "Механизированный снос ТЦ площадью 15 000 м² в центре города за 40 дней.", en: "Mechanized demolition of 15,000 sq.m shopping center in the city center in 40 days." },
  "projects.area": { ru: "Площадь", en: "Area" },
  "projects.duration": { ru: "Срок", en: "Duration" },
  "projects.details": { ru: "Подробнее", en: "Details" },

  // Search
  "search.title": { ru: "Поиск", en: "Search" },
  "search.placeholder": { ru: "Введите запрос...", en: "Type your query..." },
  "search.noResults": { ru: "Ничего не найдено", en: "No results found" },
  "search.results": { ru: "Результаты", en: "Results" },

  // Favorites
  "favorites.added": { ru: "Добавлено в избранное", en: "Added to favorites" },
  "favorites.removed": { ru: "Удалено из избранного", en: "Removed from favorites" },

  // Menu
  "menu.title": { ru: "Меню", en: "Menu" },
  "menu.home": { ru: "Главная", en: "Home" },

  // Filter
  "filter.title": { ru: "Фильтры", en: "Filters" },
  "filter.apply": { ru: "Применить", en: "Apply" },
  "filter.reset": { ru: "Сбросить", en: "Reset" },

  // New bento tiles
  "bento.guarantee": { ru: "Гарантия", en: "Guarantee" },
  "bento.guaranteeTitle": { ru: "Гарантия 3 года", en: "3 Year Warranty" },
  "bento.guaranteeDesc": { ru: "На все виды демонтажных и строительных работ предоставляем официальную гарантию", en: "Official warranty on all demolition and construction work" },
  "bento.speed": { ru: "Скорость", en: "Speed" },
  "bento.minutes": { ru: "минут", en: "minutes" },
  "bento.speedDesc": { ru: "Среднее время ответа на заявку. Перезвоним и обсудим детали проекта.", en: "Average response time. We'll call back and discuss project details." },
  "bento.equipment": { ru: "Техника", en: "Equipment" },
  "bento.equipmentTitle": { ru: "Собственный парк техники", en: "Own Equipment Fleet" },
  "bento.equipmentDesc": { ru: "50+ единиц спецтехники: экскаваторы, погрузчики, самосвалы", en: "50+ units: excavators, loaders, dump trucks" },
  "bento.eco": { ru: "Экология", en: "Ecology" },
  "bento.ecoDesc": { ru: "Строительных отходов направляем на переработку. Заботимся о природе.", en: "Construction waste sent for recycling. We care about nature." },
  "bento.marketplace": { ru: "Строительная биржа", en: "Construction Marketplace" },
  "bento.marketplaceDesc": { ru: "Доска объявлений: размещайте заявки на строительство и находите лучших подрядчиков прямо на нашем сайте", en: "Post construction requests and find the best contractors right on our site" },
} as const;

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("struktura-lang");
    return (saved === "en" || saved === "ru") ? saved : "ru";
  });

  const handleSetLang = useCallback((newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("struktura-lang", newLang);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[key]?.[lang] ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export type { TranslationKey };
