import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Lang = "ru" | "en";

const translations = {
  // Header
  "nav.services": { ru: "Услуги", en: "Services" },
  "nav.projects": { ru: "Проекты", en: "Projects" },
  "nav.about": { ru: "О нас", en: "About" },
  "nav.contacts": { ru: "Контакты", en: "Contacts" },
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

  // Bento grid
  "bento.from": { ru: "от 500₽", en: "from $7" },
  "bento.perSqm": { ru: "/м²", en: "/sq.m" },
  "bento.demolition": { ru: "Демонтаж", en: "Demolition" },
  "bento.bestDeals": { ru: "Лучшие решения", en: "Best Solutions" },
  "bento.dealsDesc": { ru: "Скидки 50–60% на комплекс работ", en: "50–60% off for complex projects" },
  "bento.team": { ru: "Наша команда", en: "Our Team" },
  "bento.teamDesc": { ru: "Профессионалы с опытом работы более 15 лет", en: "Professionals with 15+ years experience" },
  "bento.subscribe": { ru: "Подписка", en: "Subscribe" },
  "bento.subscribeBtn": { ru: "Подписаться", en: "Subscribe" },
  "bento.exclusive": { ru: "Эксклюзив", en: "Exclusive" },
  "bento.exclusiveTitle": { ru: "Качество без компромиссов", en: "Uncompromising Quality" },
  "bento.exclusiveDesc": { ru: "Используем передовые технологии для точного и безопасного демонтажа", en: "Using advanced tech for precise and safe demolition" },
  "bento.open": { ru: "Открыть", en: "Open" },
  "bento.office": { ru: "Наш офис", en: "Our Office" },
  "bento.address": { ru: "г. Москва, ул. Строителей, д. 15", en: "15 Stroiteley St., Moscow" },
  "bento.hours": { ru: "Пн–Пт: 9:00–18:00", en: "Mon–Fri: 9:00–18:00" },

  // Stats
  "stats.projects": { ru: "Проектов выполнено", en: "Projects Completed" },
  "stats.years": { ru: "Лет на рынке", en: "Years in Business" },
  "stats.clients": { ru: "Довольных клиентов", en: "Satisfied Clients" },

  // Services
  "services.title": { ru: "Наши услуги", en: "Our Services" },
  "services.all": { ru: "Все услуги", en: "All Services" },
  "services.demolition": { ru: "Демонтаж зданий", en: "Building Demolition" },
  "services.demolitionDesc": { ru: "Полный и частичный демонтаж любой сложности", en: "Full and partial demolition of any complexity" },
  "services.construction": { ru: "Строительство", en: "Construction" },
  "services.constructionDesc": { ru: "Возведение объектов под ключ", en: "Turnkey construction" },
  "services.renovation": { ru: "Ремонт и отделка", en: "Renovation & Finishing" },
  "services.renovationDesc": { ru: "Капитальный и косметический ремонт", en: "Major and cosmetic renovation" },

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
