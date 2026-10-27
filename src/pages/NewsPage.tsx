import { motion } from "framer-motion";
import { ArrowUpRight, Newspaper, BookOpen, Layers3 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";

const newsItems: { titleKey: TranslationKey; dateKey: TranslationKey; descKey: TranslationKey; image: string; topic: string }[] = [
  { titleKey: "news.1.title", dateKey: "news.1.date", descKey: "news.1.desc", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=85", topic: "Подготовка объекта" },
  { titleKey: "news.2.title", dateKey: "news.2.date", descKey: "news.2.desc", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=85", topic: "Организация работ" },
  { titleKey: "news.3.title", dateKey: "news.3.date", descKey: "news.3.desc", image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=85", topic: "Инструмент и процесс" },
  { titleKey: "news.4.title", dateKey: "news.4.date", descKey: "news.4.desc", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=85", topic: "Работа на площадке" },
  { titleKey: "news.5.title", dateKey: "news.5.date", descKey: "news.5.desc", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85", topic: "Документация" },
  { titleKey: "news.6.title", dateKey: "news.6.date", descKey: "news.6.desc", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85", topic: "Планирование" },
  { titleKey: "news.7.title", dateKey: "news.7.date", descKey: "news.7.desc", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85", topic: "Материалы и среда" },
  { titleKey: "news.8.title", dateKey: "news.8.date", descKey: "news.8.desc", image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=85", topic: "Практика" },
];

const NewsPage = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEOHead title="Материалы — СКОЛ" description="Практические материалы о подготовке объектов, сметах, демонтаже и организации строительных работ." canonical="/news" />
      <main className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <AnimatedSection>
          <header className="relative mb-8 grid overflow-hidden border border-border/60 bg-card/35 lg:grid-cols-[1fr_.72fr]">
            <div className="relative z-10 flex flex-col justify-center p-6 sm:p-9 lg:p-11">
              <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-primary sm:text-xs">
                <span className="h-px w-8 bg-primary" /> СКОЛ / БАЗА ЗНАНИЙ
              </p>
              <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[.98] tracking-[-.045em] text-foreground sm:text-5xl lg:text-6xl">{t("news.title")}</h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">Практические рекомендации по подготовке объектов, расчёту объёмов и организации строительных работ.</p>
              <div className="mt-8 flex flex-wrap gap-2 text-[10px] uppercase tracking-[.14em] text-muted-foreground">
                <span className="border border-border/70 px-3 py-2">Подготовка</span>
                <span className="border border-border/70 px-3 py-2">Процессы</span>
                <span className="border border-border/70 px-3 py-2">Планирование</span>
              </div>
            </div>
            <div className="relative min-h-[220px] overflow-hidden border-t border-border/50 sm:min-h-[300px] lg:border-l lg:border-t-0">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=85)" }} role="img" aria-label="Архитектурный визуальный образ" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/5 lg:bg-gradient-to-r lg:from-background/20 lg:via-transparent lg:to-background/10" />
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)/.2) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/.2) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
                <div>
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[.18em] text-primary">СКОЛ / NOTES</span>
                  <p className="max-w-sm text-xl font-medium leading-snug text-white sm:text-2xl">Знания, которые помогают подготовить решение.</p>
                </div>
                <span className="hidden border border-white/25 bg-black/25 px-3 py-2 text-[9px] uppercase tracking-[.15em] text-white/80 backdrop-blur-sm sm:inline-block">Визуальный образ</span>
              </div>
            </div>
          </header>
        </AnimatedSection>

        <div className="mb-5 flex items-end justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-primary">01 / Материалы</p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Из практики и подготовки</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><BookOpen className="h-4 w-4" /> <span>08 материалов</span></div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item, i) => (
            <AnimatedSection key={item.titleKey} delay={Math.min(i * 0.045, 0.24)} className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}>
              <motion.article className="group relative flex h-full flex-col overflow-hidden border border-border/60 bg-card/40 transition-colors hover:border-primary/40 hover:bg-card/65" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <div className={`relative overflow-hidden ${i === 0 ? "h-56 sm:h-72" : "h-40"}`}>
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]" style={{ backgroundImage: `url(${item.image})` }} role="img" aria-label={`Визуальный образ: ${item.topic}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/5 to-black/5" />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="border border-white/25 bg-black/25 px-2.5 py-1.5 font-mono text-[10px] text-white backdrop-blur-sm">0{i + 1}</span>
                    <span className="border border-white/20 bg-black/20 px-2.5 py-1.5 text-[9px] uppercase tracking-[.12em] text-white/90 backdrop-blur-sm">{item.topic}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center border border-white/25 bg-black/20 text-white backdrop-blur-sm transition-colors group-hover:bg-primary"><Newspaper className="h-4 w-4" /></div>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[.14em] text-muted-foreground">{t(item.dateKey)}</span>
                    <span className="font-mono text-[10px] text-primary">СКОЛ / NOTE</span>
                  </div>
                  <h2 className="font-display text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">{t(item.titleKey)}</h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{t(item.descKey)}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                    <span className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Материал для изучения</span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                </div>
              </motion.article>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.12}>
          <section className="mt-8 flex flex-col gap-4 border border-border/60 bg-background/35 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex gap-4">
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center border border-primary/35 bg-primary/10 text-primary sm:flex"><Layers3 className="h-5 w-5" /></div>
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-primary">Следующий шаг</p>
                <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">Есть задача, которая не укладывается в общую схему?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Обсудим условия объекта и необходимые работы отдельно.</p>
              </div>
            </div>
            <a href="/contacts" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-primary/60 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-primary hover:text-primary-foreground">Обсудить задачу <ArrowUpRight className="h-4 w-4" /></a>
          </section>
        </AnimatedSection>
      </main>
    </>
  );
};

export default NewsPage;
