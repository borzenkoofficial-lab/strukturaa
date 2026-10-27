import { motion } from "framer-motion";
import { ArrowUpRight, Building2, Home, Truck, Wrench, Hammer, Gem, HardHat, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";

const services: { icon: typeof Building2; titleKey: TranslationKey; descKey: TranslationKey; slug: string; image: string; tag: string }[] = [
  { icon: Building2, titleKey: "services.demolition", descKey: "services.demolitionDesc", slug: "demolition", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85", tag: "Разборка / демонтаж" },
  { icon: HardHat, titleKey: "services.construction", descKey: "services.constructionDesc", slug: "construction", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=85", tag: "Монтаж / конструкции" },
  { icon: Home, titleKey: "services.renovation", descKey: "services.renovationDesc", slug: "renovation", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85", tag: "Подготовка / ремонт" },
  { icon: Hammer, titleKey: "services.apartmentDemo", descKey: "services.apartmentDemoDesc", slug: "apartment-demolition", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85", tag: "Квартиры / помещения" },
  { icon: Building2, titleKey: "services.buildingDemo", descKey: "services.buildingDemoDesc", slug: "building-demolition", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85", tag: "Здания / сооружения" },
  { icon: Truck, titleKey: "services.wasteRemoval", descKey: "services.wasteRemovalDesc", slug: "waste-removal", image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=85", tag: "Логистика / отходы" },
  { icon: Wrench, titleKey: "services.dismantling", descKey: "services.dismantlingDesc", slug: "dismantling", image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=85", tag: "Инженерные системы" },
  { icon: Gem, titleKey: "services.concrete", descKey: "services.concreteDesc", slug: "diamond-cutting", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=85", tag: "Резка / отверстия" },
];

const ServicesPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <SEOHead title="Услуги — СКОЛ" description="Демонтаж, монтаж конструкций, ремонт, вывоз строительного мусора и алмазная резка." canonical="/services" />
      <main className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <AnimatedSection>
          <header className="relative mb-8 grid overflow-hidden border border-border/60 bg-card/35 shadow-[0_28px_90px_-56px_hsl(var(--primary)/0.35)] lg:grid-cols-[1.1fr_.9fr]">
            <div className="relative z-10 flex flex-col justify-center p-6 sm:p-9 lg:p-11">
              <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-primary sm:text-xs">
                <span className="h-px w-8 bg-primary" /> СКОЛ / ПРОИЗВОДСТВЕННЫЙ КАТАЛОГ
              </p>
              <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[.98] tracking-[-.045em] text-foreground sm:text-5xl lg:text-6xl">
                {t("services.pageTitle")}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{t("services.pageSubtitle")}</p>
              <div className="mt-8 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[.12em] text-muted-foreground sm:text-xs">
                <span className="border border-border/70 px-3 py-2">01—08 / направления</span>
                <span className="border border-border/70 px-3 py-2">Расчёт по объекту</span>
              </div>
              <p className="mt-5 max-w-lg text-xs leading-6 text-muted-foreground">
                Состав, сроки и стоимость определяются после уточнения объёма, материалов, доступа и условий площадки.
              </p>
            </div>
            <div className="relative min-h-[250px] overflow-hidden border-t border-border/50 sm:min-h-[340px] lg:border-l lg:border-t-0">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=85)" }} role="img" aria-label="Визуальный образ строительной площадки" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-background/5 lg:bg-gradient-to-r lg:from-background/15 lg:via-transparent lg:to-background/10" />
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)/.2) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/.2) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
                <div>
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[.18em] text-primary">СКОЛ / WORK SYSTEM</span>
                  <p className="max-w-sm text-xl font-medium leading-snug text-white sm:text-2xl">Каждый этап — часть общего плана.</p>
                </div>
                <span className="hidden border border-white/25 bg-black/25 px-3 py-2 text-[9px] uppercase tracking-[.15em] text-white/80 backdrop-blur-sm sm:inline-block">Визуальный образ</span>
              </div>
            </div>
          </header>
        </AnimatedSection>

        <div className="mb-4 flex items-end justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-primary">01 / Что можем выполнить</p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Направления работ</h2>
          </div>
          <span className="font-mono text-xs text-muted-foreground">01—08</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <AnimatedSection key={service.slug} delay={Math.min(i * 0.045, 0.22)} className={i === 0 ? "lg:col-span-2" : ""}>
              <motion.article
                role="link"
                tabIndex={0}
                aria-label={t(service.titleKey)}
                className="group relative flex h-full cursor-pointer flex-col overflow-hidden border border-border/60 bg-card/45 transition-colors duration-300 hover:border-primary/50 hover:bg-card/70"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.22 }}
                onClick={() => navigate(`/services/${service.slug}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/services/${service.slug}`);
                  }
                }}
              >
                <div className={`relative overflow-hidden ${i === 0 ? "h-52 sm:h-64" : "h-40"}`}>
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.045]" style={{ backgroundImage: `url(${service.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-black/5" />
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)/.16) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/.16) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="border border-white/25 bg-black/25 px-2.5 py-1.5 font-mono text-[10px] text-white backdrop-blur-sm">0{i + 1}</span>
                    <span className="border border-white/20 bg-black/20 px-2.5 py-1.5 text-[9px] uppercase tracking-[.14em] text-white/85 backdrop-blur-sm">{service.tag}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-colors group-hover:bg-primary">
                    <service.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h2 className="font-display text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">{t(service.titleKey)}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{t(service.descKey)}</p>
                  <div className="mt-6 flex items-end justify-between gap-3 border-t border-border/60 pt-4">
                    <div>
                      <span className="block text-[9px] uppercase tracking-[.17em] text-muted-foreground">Формат расчёта</span>
                      <span className="mt-1 block text-sm font-medium text-foreground">По объёму и условиям</span>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-foreground transition-colors group-hover:text-primary">
                      {t("services.orderBtn")} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </motion.article>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.12}>
          <section className="mt-8 grid gap-5 border border-border/60 bg-background/35 p-5 sm:p-7 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex gap-4">
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center border border-primary/35 bg-primary/10 text-primary sm:flex"><ClipboardCheck className="h-5 w-5" /></div>
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-primary">Перед стартом</p>
                <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">Сначала разберёмся в задаче</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Опишите объект и нужный результат. Уточним исходные данные и определим, какие работы необходимо оценить.</p>
              </div>
            </div>
            <button onClick={() => navigate("/contacts")} className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary/60 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-primary hover:text-primary-foreground">
              Обсудить объект <ArrowUpRight className="h-4 w-4" />
            </button>
          </section>
        </AnimatedSection>
      </main>
    </>
  );
};

export default ServicesPage;
