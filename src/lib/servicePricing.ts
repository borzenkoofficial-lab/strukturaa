export type ServiceRate = {
  price: number | null;
  unit: string;
};

export type ServiceRateBook = Record<string, ServiceRate>;

export type ServiceRateCatalogItem = {
  slug: string;
  service: { ru: string; en: string };
  workId: string;
  title: { ru: string; en: string };
  defaultUnit: string;
};

const row = (
  slug: string,
  serviceRu: string,
  serviceEn: string,
  workId: string,
  ru: string,
  en: string,
  defaultUnit: string,
): ServiceRateCatalogItem => ({
  slug,
  service: { ru: serviceRu, en: serviceEn },
  workId,
  title: { ru, en },
  defaultUnit,
});

// The catalogue describes measurement units, not prices. Price values are intentionally
// empty until an administrator enters rates verified by the business.
export const SERVICE_RATE_CATALOG: ServiceRateCatalogItem[] = [
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "partitions", "Перегородки и ненесущие стены", "Partitions and non-load-bearing walls", "м²"),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "flooring", "Напольные покрытия", "Floor coverings", "м²"),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "screed", "Стяжка и наливной пол", "Screed and self-levelling floor", "м²"),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "ceilings", "Потолки и подвесные системы", "Ceilings and suspended systems", "м²"),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "wall-finish", "Старая отделка стен", "Existing wall finishes", "м²"),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "tiles", "Плитка и облицовка", "Tiles and cladding", "м²"),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "bathroom", "Комплексный демонтаж санузла", "Bathroom strip-out", "компл."),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "plumbing", "Сантехника и трубы", "Plumbing and pipework", "м.п."),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "electrics", "Электрика и освещение", "Electrical and lighting", "точка"),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "doors", "Двери, коробки и наличники", "Doors, frames and architraves", "шт."),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "kitchen", "Кухня и встроенные элементы", "Kitchen and fitted elements", "компл."),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "built-ins", "Шкафы и встроенная мебель", "Wardrobes and fitted furniture", "шт."),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "windows", "Подоконники, откосы и оконные блоки", "Sills, reveals and window units", "шт."),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "balcony", "Отделка балкона / лоджии", "Balcony / loggia finishes", "м²"),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "baseboards", "Плинтусы и мелкие элементы", "Skirting and small fixtures", "м.п."),
  row("apartment-demolition", "Демонтаж квартиры", "Apartment strip-out", "waste", "Упаковка, вынос и вывоз", "Packing, carry-out and removal", "м³"),

  row("building-demolition", "Демонтаж здания", "Building demolition", "full", "Полный снос здания", "Full building demolition", "м³"),
  row("building-demolition", "Демонтаж здания", "Building demolition", "roof", "Кровля и верхние конструкции", "Roof and upper structures", "м²"),
  row("building-demolition", "Демонтаж здания", "Building demolition", "facade", "Фасад и наружные стены", "Facade and external walls", "м²"),
  row("building-demolition", "Демонтаж здания", "Building demolition", "frame", "Каркас и несущие элементы", "Frame and structural elements", "т"),
  row("building-demolition", "Демонтаж здания", "Building demolition", "interior", "Внутренние конструкции и отделка", "Interior structures and finishes", "м²"),
  row("building-demolition", "Демонтаж здания", "Building demolition", "foundation", "Фундамент и плита", "Foundation and slab", "м³"),
  row("building-demolition", "Демонтаж здания", "Building demolition", "utilities", "Инженерные сети", "Utilities", "м.п."),
  row("building-demolition", "Демонтаж здания", "Building demolition", "waste", "Погрузка, вывоз и уборка", "Loading, waste removal and cleanup", "м³"),

  row("demolition", "Демонтаж зданий", "Building demolition", "roof", "Кровля и верхние конструкции", "Roof and upper structures", "м²"),
  row("demolition", "Демонтаж зданий", "Building demolition", "facade", "Фасад и наружные стены", "Facade and external walls", "м²"),
  row("demolition", "Демонтаж зданий", "Building demolition", "structure", "Каркас и несущие элементы", "Frame and structural elements", "м³"),
  row("demolition", "Демонтаж зданий", "Building demolition", "interior", "Внутренние конструкции", "Internal structures", "м²"),
  row("demolition", "Демонтаж зданий", "Building demolition", "foundation", "Фундамент и основание", "Foundation and base", "м³"),
  row("demolition", "Демонтаж зданий", "Building demolition", "utilities", "Инженерные коммуникации", "Utilities", "м.п."),
  row("demolition", "Демонтаж зданий", "Building demolition", "waste", "Погрузка и вывоз отходов", "Debris loading and removal", "м³"),
  row("demolition", "Демонтаж зданий", "Building demolition", "cleanup", "Уборка и подготовка территории", "Cleanup and site preparation", "м²"),

  row("construction", "Монтаж конструкций", "Structural works", "foundation", "Основание и опорные узлы", "Foundation and support nodes", "м³"),
  row("construction", "Монтаж конструкций", "Structural works", "columns", "Колонны и стойки", "Columns and posts", "шт."),
  row("construction", "Монтаж конструкций", "Structural works", "beams", "Балки и фермы", "Beams and trusses", "т"),
  row("construction", "Монтаж конструкций", "Structural works", "slabs", "Перекрытия и настилы", "Floor slabs and decking", "м²"),
  row("construction", "Монтаж конструкций", "Structural works", "roof", "Кровельный каркас", "Roof frame", "м²"),
  row("construction", "Монтаж конструкций", "Structural works", "stairs", "Лестницы и площадки", "Stairs and platforms", "компл."),
  row("construction", "Монтаж конструкций", "Structural works", "welding", "Сварные и болтовые соединения", "Welded and bolted connections", "компл."),
  row("construction", "Монтаж конструкций", "Structural works", "lifting", "Подъёмная техника и логистика", "Lifting equipment and logistics", "смена"),

  row("renovation", "Ремонт и отделка", "Renovation", "walls", "Стены и перегородки", "Walls and partitions", "м²"),
  row("renovation", "Ремонт и отделка", "Renovation", "floor", "Полы и основание", "Floors and substrate", "м²"),
  row("renovation", "Ремонт и отделка", "Renovation", "ceiling", "Потолки", "Ceilings", "м²"),
  row("renovation", "Ремонт и отделка", "Renovation", "wet", "Санузел и мокрые зоны", "Bathrooms and wet areas", "м²"),
  row("renovation", "Ремонт и отделка", "Renovation", "utilities", "Электрика и освещение", "Electrical and lighting", "точка"),
  row("renovation", "Ремонт и отделка", "Renovation", "plumbing", "Сантехника и отопление", "Plumbing and heating", "точка"),
  row("renovation", "Ремонт и отделка", "Renovation", "doors", "Двери и встроенные элементы", "Doors and built-in elements", "шт."),
  row("renovation", "Ремонт и отделка", "Renovation", "finish", "Покраска и финишная отделка", "Painting and final finishes", "м²"),

  row("waste-removal", "Вывоз отходов", "Waste removal", "delivery", "Подача и установка контейнера", "Container delivery and placement", "рейс"),
  row("waste-removal", "Вывоз отходов", "Waste removal", "loading", "Погрузка отходов", "Waste loading", "м³"),
  row("waste-removal", "Вывоз отходов", "Waste removal", "carryout", "Вынос из здания", "Carry-out from building", "м³"),
  row("waste-removal", "Вывоз отходов", "Waste removal", "transport", "Транспортировка", "Transportation", "рейс"),
  row("waste-removal", "Вывоз отходов", "Waste removal", "swap", "Замена / повторная подача", "Container exchange / repeat delivery", "рейс"),
  row("waste-removal", "Вывоз отходов", "Waste removal", "sorting", "Сортировка отходов", "Waste sorting", "м³"),
  row("waste-removal", "Вывоз отходов", "Waste removal", "documents", "Документы по вывозу", "Waste transport documents", "компл."),
  row("waste-removal", "Вывоз отходов", "Waste removal", "cleanup", "Уборка точки погрузки", "Loading area cleanup", "м²"),

  row("dismantling", "Демонтаж инженерных систем", "Utility dismantling", "electrics", "Кабели, проводка и щиты", "Cables, wiring and panels", "точка"),
  row("dismantling", "Демонтаж инженерных систем", "Utility dismantling", "plumbing", "Трубопроводы и сантехника", "Pipes and plumbing", "м.п."),
  row("dismantling", "Демонтаж инженерных систем", "Utility dismantling", "ventilation", "Воздуховоды и вентиляция", "Ductwork and ventilation", "м.п."),
  row("dismantling", "Демонтаж инженерных систем", "Utility dismantling", "heating", "Отопление и радиаторы", "Heating and radiators", "м.п."),
  row("dismantling", "Демонтаж инженерных систем", "Utility dismantling", "equipment", "Инженерное оборудование", "Mechanical equipment", "шт."),
  row("dismantling", "Демонтаж инженерных систем", "Utility dismantling", "cables", "Кабельные лотки и опоры", "Cable trays and supports", "м.п."),
  row("dismantling", "Демонтаж инженерных систем", "Utility dismantling", "fire", "Противопожарные системы", "Fire protection systems", "компл."),
  row("dismantling", "Демонтаж инженерных систем", "Utility dismantling", "waste", "Погрузка и вывоз", "Loading and disposal", "м³"),

  row("diamond-cutting", "Алмазная резка и бурение", "Diamond cutting and drilling", "opening", "Дверные и технологические проёмы", "Door and service openings", "м.п."),
  row("diamond-cutting", "Алмазная резка и бурение", "Diamond cutting and drilling", "slab", "Проёмы в перекрытии", "Slab openings", "м.п."),
  row("diamond-cutting", "Алмазная резка и бурение", "Diamond cutting and drilling", "drilling", "Отверстия и проходки", "Holes and penetrations", "шт."),
  row("diamond-cutting", "Алмазная резка и бурение", "Diamond cutting and drilling", "chases", "Штробы и каналы", "Chases and channels", "м.п."),
  row("diamond-cutting", "Алмазная резка и бурение", "Diamond cutting and drilling", "wall", "Резка стен и плит", "Wall and slab cuts", "м.п."),
  row("diamond-cutting", "Алмазная резка и бурение", "Diamond cutting and drilling", "reinforcement", "Работа с армированием", "Reinforcement handling", "кг"),
  row("diamond-cutting", "Алмазная резка и бурение", "Diamond cutting and drilling", "water", "Водоподача и сбор шлама", "Water supply and slurry collection", "смена"),
  row("diamond-cutting", "Алмазная резка и бурение", "Diamond cutting and drilling", "cleanup", "Уборка рабочей зоны", "Work-area cleanup", "м²"),
];

export const SERVICE_RATE_UNITS = ["м²", "м³", "м.п.", "шт.", "точка", "компл.", "рейс", "смена", "т", "кг", "ч"];

export const SERVICE_RATE_SERVICES = Array.from(
  new Map(SERVICE_RATE_CATALOG.map((item) => [item.slug, { slug: item.slug, title: item.service }])).values(),
);

export const serviceRateKey = (slug: string, workId: string) => `${slug}:${workId}`;

export const getServiceRateCatalogItem = (slug: string, workId: string) =>
  SERVICE_RATE_CATALOG.find((item) => item.slug === slug && item.workId === workId);

export const getServiceRate = (book: ServiceRateBook, slug: string, workId: string): ServiceRate => {
  const catalogItem = getServiceRateCatalogItem(slug, workId);
  const saved = book[serviceRateKey(slug, workId)];
  return {
    price: typeof saved?.price === "number" && Number.isFinite(saved.price) && saved.price > 0 ? saved.price : null,
    unit: saved?.unit && SERVICE_RATE_UNITS.includes(saved.unit) ? saved.unit : (catalogItem?.defaultUnit ?? "шт."),
  };
};
