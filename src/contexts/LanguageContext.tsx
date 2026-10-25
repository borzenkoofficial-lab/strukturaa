import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Lang = "ru" | "en";

const translations = {
  // Header
  "nav.services": { ru: "Услуги", en: "Services" },
  "nav.projects": { ru: "Проекты", en: "Projects" },
  "nav.about": { ru: "О нас", en: "About" },
  "nav.contacts": { ru: "Контакты", en: "Contacts" },
  "nav.news": { ru: "Материалы", en: "Guides" },
  "nav.blog": { ru: "Блог", en: "Blog" },
  "nav.marketplace": { ru: "Биржа", en: "Marketplace" },
  "header.search": { ru: "Демонтаж, строительство...", en: "Demolition, construction..." },
  "header.contact": { ru: "Связаться", en: "Contact" },
  "header.signIn": { ru: "Войти", en: "Sign In" },
  "header.dashboard": { ru: "Кабинет", en: "Dashboard" },

  // Homepage hero
  "hero.eyebrow": { ru: "Демонтаж · монтаж · комплексные работы", en: "Demolition · installation · integrated works" },
  "hero.titleA": { ru: "Работаем", en: "We handle" },
  "hero.titleB": { ru: "с объектом.", en: "the whole" },
  "hero.titleC": { ru: "Не с обещаниями.", en: "scope of work." },
  "hero.description": { ru: "СКОЛ — строительные и демонтажные работы для коммерческих и частных объектов в Москве и Московской области. Сначала разбираемся в задаче, затем согласуем объём работ и последовательность действий.", en: "SKOL provides construction and demolition services for commercial and private properties in Moscow and the Moscow region. We clarify the scope first, then agree on work volume and sequence." },
  "hero.primary": { ru: "Обсудить объект", en: "Discuss a project" },
  "hero.secondary": { ru: "Направления работ", en: "Explore services" },
  "hero.location": { ru: "Москва и Московская область", en: "Moscow and Moscow region" },
  "hero.scope": { ru: "Частные и коммерческие объекты", en: "Private and commercial properties" },
  "hero.format": { ru: "Отдельные и комплексные работы", en: "Individual and integrated works" },
  "hero.panelTitle": { ru: "Последовательность работ", en: "Work sequence" },
  "hero.stage1": { ru: "Оценка задачи", en: "Scope assessment" },
  "hero.stage1Desc": { ru: "Объём, ограничения и условия объекта", en: "Scope, constraints and site conditions" },
  "hero.stage2": { ru: "План и смета", en: "Plan and estimate" },
  "hero.stage2Desc": { ru: "Состав работ и согласованные этапы", en: "Defined scope and agreed stages" },
  "hero.stage3": { ru: "Выполнение работ", en: "Execution" },
  "hero.stage3Desc": { ru: "Работа по согласованной последовательности", en: "Work delivered to the agreed sequence" },
  "hero.panelFoot": { ru: "От задачи к результату", en: "From scope to delivery" },
  "category.heading": { ru: "Направления работ", en: "Areas of work" },
  "category.description": { ru: "Выберите направление, чтобы изучить состав работ и запросить расчёт под условия объекта.", en: "Choose a service to review its scope and request a site-specific estimate." },

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
  "bento.from": { ru: "По смете", en: "By estimate" },
  "bento.perSqm": { ru: "/м²", en: "/sq.m" },
  "bento.demolition": { ru: "Демонтаж зданий", en: "Building Demolition" },
  "bento.bestDeals": { ru: "Комплексные работы", en: "Integrated works" },
  "bento.dealsDesc": { ru: "Объединяем демонтаж, подготовку и последующие этапы в один согласованный план.", en: "Combine demolition, preparation and follow-up stages into one agreed plan." },
  "bento.team": { ru: "Наша команда", en: "Our Team" },
  "bento.teamDesc": { ru: "Подбираем состав бригады под объём, условия и требования конкретного объекта.", en: "We assemble the crew around the scope, site conditions and project requirements." },
  "bento.subscribe": { ru: "Подписка", en: "Subscribe" },
  "bento.subscribeBtn": { ru: "Подписаться", en: "Subscribe" },
  "bento.exclusive": { ru: "Эксклюзив", en: "Exclusive" },
  "bento.exclusiveTitle": { ru: "Алмазная резка бетона", en: "Diamond Concrete Cutting" },
  "bento.exclusiveDesc": { ru: "Алмазная резка и бурение бетона с подбором метода и мер пылеподавления под условия объекта.", en: "Diamond cutting and drilling of concrete, with methods and dust control selected for site conditions." },
  "bento.open": { ru: "Открыть", en: "Open" },
  "bento.office": { ru: "География работ", en: "Service area" },
  "bento.address": { ru: "Москва и Московская область", en: "Moscow and Moscow region" },
  "bento.hours": { ru: "Выезд и встреча — по согласованию", en: "Site visits and meetings by arrangement" },

  // News
  "news.title": { ru: "Практические материалы", en: "Practical guides" },
  "news.1.title": { ru: "Что подготовить перед демонтажом", en: "What to prepare before demolition" },
  "news.1.date": { ru: "ПАМЯТКА", en: "GUIDE" },
  "news.1.desc": { ru: "Доступ к объекту, ограничения по шуму, отключение коммуникаций и порядок вывоза отходов стоит обсудить до начала работ.", en: "Access, noise restrictions, utility isolation and waste removal should be discussed before work begins." },
  "news.2.title": { ru: "Из чего складывается смета", en: "What goes into an estimate" },
  "news.2.date": { ru: "РАЗБОР", en: "EXPLAINER" },
  "news.2.desc": { ru: "На стоимость влияют объём, материал, этажность, доступ к зоне работ, ручной перенос и требования к вывозу.", en: "Cost depends on scope, material, floor level, access, manual handling and waste removal requirements." },
  "news.3.title": { ru: "Когда выгодно объединять этапы", en: "When combining stages makes sense" },
  "news.3.date": { ru: "ПОДХОД", en: "APPROACH" },
  "news.3.desc": { ru: "Один согласованный план помогает связать демонтаж, подготовку помещения и последующие строительные работы.", en: "One agreed plan can connect demolition, space preparation and subsequent construction work." },
  "news.4.title": { ru: "Что проверить до старта работ", en: "What to check before work starts" },
  "news.4.date": { ru: "ЧЕК-ЛИСТ", en: "CHECKLIST" },
  "news.4.desc": { ru: "Состав работ, границы ответственности, доступ на площадку, сроки и порядок согласования изменений должны быть понятны обеим сторонам.", en: "Scope, responsibilities, site access, schedule and change approval should be clear to both parties." },
  "news.5.title": { ru: "Демонтаж в действующем здании", en: "Demolition in an occupied building" },
  "news.5.date": { ru: "ОСОБЕННОСТИ", en: "CONSIDERATIONS" },
  "news.5.desc": { ru: "Заранее учитывают маршруты выноса, защиту общих зон, график доступа и требования по пыли и шуму.", en: "Plan carrying routes, protection of shared areas, access windows, dust and noise requirements in advance." },
  "news.6.title": { ru: "Как организовать вывоз строительных отходов", en: "Planning construction waste removal" },
  "news.6.date": { ru: "ПРАКТИКА", en: "PRACTICE" },
  "news.6.desc": { ru: "Объём отходов, условия погрузки и подъезд транспорта лучше оценить до согласования сметы и графика.", en: "Estimate waste volume, loading conditions and vehicle access before confirming the estimate and schedule." },
  "news.7.title": { ru: "Как подготовить объект к оценке", en: "Preparing a site for assessment" },
  "news.7.date": { ru: "ПАМЯТКА", en: "GUIDE" },
  "news.7.desc": { ru: "Фото, планы, примерные размеры и описание ограничений позволяют предметнее обсудить объём работ до выезда.", en: "Photos, plans, approximate dimensions and site constraints help define the scope before a visit." },
  "news.8.title": { ru: "Что важно в техническом задании", en: "What matters in a scope of work" },
  "news.8.date": { ru: "ЧЕК-ЛИСТ", en: "CHECKLIST" },
  "news.8.desc": { ru: "Фиксируйте результат каждого этапа, ограничения объекта, требования к сохранению конструкций и порядок приёмки.", en: "Define each stage’s deliverable, site constraints, elements to preserve and acceptance process." },
  "news.readMore": { ru: "Все материалы", en: "All guides" },

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
  "services.concreteDesc": { ru: "Алмазное бурение и резка бетона, кирпича и железобетона. Метод и меры пылеподавления подбираются под объект.", en: "Diamond drilling and cutting of concrete, brick and reinforced concrete. Method and dust control are selected for the site." },

  // Services page
  "services.pageTitle": { ru: "Все услуги", en: "All Services" },
  "services.pageSubtitle": { ru: "Полный спектр демонтажных и строительных работ", en: "Full range of demolition and construction services" },
  "services.orderBtn": { ru: "Заказать", en: "Order" },
  "services.priceFrom": { ru: "от", en: "from" },

  // Process
  "process.title": { ru: "Как мы работаем", en: "How We Work" },
  "process.subtitle": { ru: "Четыре простых шага до результата", en: "Four simple steps to results" },
  "process.step1": { ru: "Заявка", en: "Request" },
  "process.step1Desc": { ru: "Опишите задачу и приложите фото, планы или ведомость объёмов, если они есть.", en: "Describe the task and attach photos, plans or a quantity schedule if available." },
  "process.step2": { ru: "Оценка", en: "Assessment" },
  "process.step2Desc": { ru: "Уточним объём, условия объекта, ограничения и состав работ для расчёта.", en: "We clarify scope, site conditions, constraints and work items for an estimate." },
  "process.step3": { ru: "Выполнение", en: "Execution" },
  "process.step3Desc": { ru: "Согласуем последовательность, сроки и точки контроля до начала выполнения.", en: "We agree on sequence, schedule and checkpoints before execution." },
  "process.step4": { ru: "Вывоз мусора", en: "Waste Removal" },
  "process.step4Desc": { ru: "Порядок погрузки, вывоза и передачи отходов фиксируется в составе работ отдельно.", en: "Loading, removal and waste handover are defined in the agreed scope." },

  // Testimonials
  "testimonials.title": { ru: "Отзывы клиентов", en: "Client Reviews" },
  "testimonials.subtitle": { ru: "Что говорят те, кто уже работал с нами", en: "What our clients say about us" },
  "testimonial.1.name": { ru: "Прозрачный состав работ", en: "Clear scope of work" },
  "testimonial.1.role": { ru: "Принцип работы", en: "Working principle" },
  "testimonial.1.text": { ru: "До начала работ согласуем состав, объёмы и стоимость. Изменения обсуждаются отдельно.", en: "We agree on scope, quantities and cost before work starts. Changes are discussed separately." },
  "testimonial.2.name": { ru: "Последовательность этапов", en: "Defined sequence" },
  "testimonial.2.role": { ru: "Принцип работы", en: "Working principle" },
  "testimonial.2.text": { ru: "Планируем порядок выполнения с учётом условий объекта, доступа и взаимодействия с другими работами.", en: "We plan the sequence around site conditions, access and coordination with other trades." },
  "testimonial.3.name": { ru: "Один согласованный план", en: "One agreed plan" },
  "testimonial.3.role": { ru: "Принцип работы", en: "Working principle" },
  "testimonial.3.text": { ru: "Если объект требует нескольких этапов, связываем их в общий план вместо разрозненных задач.", en: "When a project needs several stages, we connect them in one plan rather than treating them as disconnected tasks." },

  // CTA
  "cta.title": { ru: "Готовы начать проект?", en: "Ready to Start?" },
  "cta.desc": { ru: "Опишите задачу и условия объекта. Уточним состав работ и подготовим расчёт после оценки исходных данных.", en: "Describe the task and site conditions. We will clarify the scope and prepare an estimate after reviewing the details." },
  "cta.call": { ru: "Позвонить", en: "Call Us" },
  "cta.request": { ru: "Оставить заявку", en: "Submit Request" },

  // Footer
  "footer.rights": { ru: "© 2026 СКОЛ. Все права защищены.", en: "© 2026 SKOL. All rights reserved." },
  "footer.servicesTitle": { ru: "Услуги", en: "Services" },
  "footer.companyTitle": { ru: "Компания", en: "Company" },
  "footer.contactTitle": { ru: "Контакты", en: "Contact" },
  "footer.phone": { ru: "+7 (936) 666-99-58", en: "+7 (936) 666-99-58" },
  "footer.email": { ru: "borzenkos@vk.com", en: "borzenkos@vk.com" },
  "footer.address": { ru: "Москва и Московская область", en: "Moscow and Moscow region" },
  "footer.privacy": { ru: "Политика конфиденциальности", en: "Privacy Policy" },

  // About page
  "about.title": { ru: "О компании СКОЛ", en: "About SKOL" },
  "about.subtitle": { ru: "Демонтаж, монтаж и комплексные строительные работы", en: "Demolition, installation and integrated construction work" },
  "about.story": { ru: "СКОЛ помогает решать строительные задачи на коммерческих и частных объектах. Начинаем с оценки условий площадки, уточняем объём и границы ответственности, затем согласуем последовательность работ и смету.", en: "SKOL helps deliver construction work for commercial and private properties. We begin by assessing site conditions, clarifying scope and responsibilities, then agree on the work sequence and estimate." },
  "about.mission": { ru: "Работаем по понятному плану: согласованный состав работ, прозрачные договорённости и последовательность, учитывающая реальные условия объекта.", en: "We work to a clear plan: agreed scope, transparent terms and a sequence that accounts for real site conditions." },
  "about.value1": { ru: "Безопасность", en: "Safety" },
  "about.value1Desc": { ru: "До начала работ уточняем ограничения площадки, требования к доступу и меры, необходимые для безопасного выполнения задачи.", en: "Before work begins, we clarify site constraints, access requirements and the measures needed for safe execution." },
  "about.value2": { ru: "Качество", en: "Quality" },
  "about.value2Desc": { ru: "Фиксируем состав и объёмы работ, согласуем смету и отдельно обсуждаем изменения, если условия объекта требуют корректировок.", en: "We define scope and quantities, agree on the estimate and discuss changes separately if site conditions require adjustments." },
  "about.value3": { ru: "Экология", en: "Ecology" },
  "about.value3Desc": { ru: "Заранее определяем порядок погрузки и вывоза строительных отходов с учётом объёма и условий площадки.", en: "We define how construction waste will be loaded and removed based on volume and site conditions." },

  // Contacts page
  "contacts.title": { ru: "Свяжитесь с нами", en: "Contact Us" },
  "contacts.subtitle": { ru: "Мы всегда на связи и готовы обсудить ваш проект", en: "We're always available and ready to discuss your project" },
  "contacts.phone": { ru: "Телефон", en: "Phone" },
  "contacts.email": { ru: "Email", en: "Email" },
  "contacts.address": { ru: "География работ", en: "Service area" },
  "contacts.workHours": { ru: "Режим работы", en: "Working Hours" },
  "contacts.formName": { ru: "Ваше имя", en: "Your name" },
  "contacts.formPhone": { ru: "Телефон", en: "Phone" },
  "contacts.formMessage": { ru: "Опишите ваш проект", en: "Describe your project" },
  "contacts.formSubmit": { ru: "Отправить заявку", en: "Submit Request" },
  "contacts.formSuccess": { ru: "Заявка отправлена. Свяжемся с вами по указанным контактам.", en: "Request sent. We will contact you using the details provided." },

  // Projects page
  "projects.title": { ru: "Наши проекты", en: "Our Projects" },
  "projects.subtitle": { ru: "Примеры выполненных работ", en: "Examples of completed work" },
  "projects.1.title": { ru: "Демонтаж административного здания", en: "Administrative building demolition" },
  "projects.1.desc": { ru: "Демонтажные работы на объекте площадью около 500 м². Название заказчика не публикуется.", en: "Demolition work at a site of approximately 500 m². The client is not named publicly." },
  "projects.2.title": { ru: "Демонтаж актового зала", en: "Assembly hall demolition" },
  "projects.2.desc": { ru: "Демонтаж помещения с учётом существующих конструкций и подготовки к следующему этапу работ.", en: "Demolition of an assembly hall, accounting for existing structures and the next work stage." },
  "projects.3.title": { ru: "Фасад главного офиса LADA", en: "LADA head office facade" },
  "projects.3.desc": { ru: "Демонтаж и восстановление фасада, включая работы с окнами и ограждениями.", en: "Facade demolition and restoration, including work on windows and railings." },
  "projects.4.title": { ru: "Материалы объекта", en: "Project materials" },
  "projects.4.desc": { ru: "Описание будет добавлено после проверки материалов", en: "Description will be added after verifying project materials" },
  "projects.area": { ru: "Площадь", en: "Area" },
  "projects.duration": { ru: "Срок", en: "Duration" },
  "projects.details": { ru: "Подробнее", en: "Details" },
  "projects.5.title": { ru: "Материалы объекта", en: "Project materials" },
  "projects.5.desc": { ru: "Описание будет добавлено после проверки материалов", en: "Description will be added after verifying project materials" },
  "projects.6.title": { ru: "Материалы объекта", en: "Project materials" },
  "projects.6.desc": { ru: "Описание будет добавлено после проверки материалов", en: "Description will be added after verifying project materials" },
  "projects.7.title": { ru: "Материалы объекта", en: "Project materials" },
  "projects.7.desc": { ru: "Описание будет добавлено после проверки материалов", en: "Description will be added after verifying project materials" },
  "projects.8.title": { ru: "Материалы объекта", en: "Project materials" },
  "projects.8.desc": { ru: "Описание будет добавлено после проверки материалов", en: "Description will be added after verifying project materials" },
  "projects.9.title": { ru: "Материалы объекта", en: "Project materials" },
  "projects.9.desc": { ru: "Описание будет добавлено после проверки материалов", en: "Description will be added after verifying project materials" },
  "projects.10.title": { ru: "Материалы объекта", en: "Project materials" },
  "projects.10.desc": { ru: "Описание будет добавлено после проверки материалов", en: "Description will be added after verifying project materials" },

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
  "bento.guarantee": { ru: "Условия договора", en: "Contract terms" },
  "bento.guaranteeTitle": { ru: "Условия договора", en: "Contract terms" },
  "bento.guaranteeDesc": { ru: "Гарантийные обязательства и исключения фиксируются в договоре с учётом состава работ.", en: "Warranty obligations and exclusions are defined in the contract based on the scope." },
  "bento.speed": { ru: "Обратная связь", en: "Follow-up" },
  "bento.minutes": { ru: "минут", en: "minutes" },
  "bento.speedDesc": { ru: "Уточним задачу и согласуем удобный способ дальнейшей связи.", en: "We clarify the task and agree on a convenient way to follow up." },
  "bento.equipment": { ru: "Техника", en: "Equipment" },
  "bento.equipmentTitle": { ru: "Техника под задачу", en: "Equipment for the task" },
  "bento.equipmentDesc": { ru: "Подбираем необходимую технику и способ выполнения под условия объекта.", en: "Equipment and work methods are selected for the site conditions." },
  "bento.eco": { ru: "Экология", en: "Ecology" },
  "bento.ecoDesc": { ru: "Порядок погрузки и вывоза отходов согласуется с учётом объёма и условий площадки.", en: "Waste loading and removal are agreed based on volume and site conditions." },
  "bento.marketplace": { ru: "Комплексные работы", en: "Integrated works" },
  "bento.marketplaceDesc": { ru: "Обсудим состав работ и подготовим расчёт после уточнения условий объекта.", en: "We discuss the scope and prepare an estimate after clarifying site conditions." },
  "bento.shop": { ru: "Каталог услуг", en: "Service catalogue" },
  "bento.shopDesc": { ru: "Каталог услуг СКОЛ: демонтаж, монтаж и комплексные строительные работы.", en: "SKOL services: demolition, installation and integrated construction work." },
  "bento.hotServices": { ru: "Направления работ", en: "Areas of work" },
  "bento.hotServicesDesc": { ru: "Подбор решения под задачу и условия конкретного объекта.", en: "Choose an approach based on the task and site conditions." },
  "bento.hotDemolition": { ru: "Демонтаж больших площадей", en: "Large-area demolition" },
  "bento.hotDemolitionPrice": { ru: "По смете", en: "By estimate" },
  "bento.hotWaste": { ru: "Вывоз мусора", en: "Waste Removal" },
  "bento.hotWastePrice": { ru: "По объёму", en: "By volume" },
  "bento.hotReno": { ru: "Ремонт под ключ", en: "Turnkey Renovation" },
  "bento.hotRenoPrice": { ru: "По смете", en: "By estimate" },
  "bento.newsTitle": { ru: "Практические материалы", en: "Practical guides" },
  "bento.newsDesc": { ru: "Практические материалы о подготовке объектов, сметах и последовательности работ.", en: "Practical guides to site preparation, estimates and work sequencing." },
  "bento.projectsTitle": { ru: "Наши проекты", en: "Our Projects" },
  "bento.projectsDesc": { ru: "Посмотрите примеры демонтажных, фасадных и комплексных работ.", en: "Explore examples of demolition, facade and integrated work." },
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
