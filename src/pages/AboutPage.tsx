import { motion } from "framer-motion";
import { Shield, Award, Leaf, ArrowUpRight, ClipboardList, Search, Ruler, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";

const values: { icon: typeof Shield; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: Shield, titleKey: "about.value1", descKey: "about.value1Desc" },
  { icon: Award, titleKey: "about.value2", descKey: "about.value2Desc" },
  { icon: Leaf, titleKey: "about.value3", descKey: "about.value3Desc" },
];

const principles = [
  { icon: ClipboardList, title: "Сначала задача", text: "Уточняем, что требуется демонтировать, подготовить или смонтировать — и какой результат нужен заказчику." },
  { icon: Search, title: "Затем условия", text: "Учитываем материалы, доступ, ограничения площадки, объём работ и вывоз отходов." },
  { icon: Ruler, title: "Потом расчёт", text: "Согласуем состав работ, последовательность, сроки и сметные позиции до старта." },
  { icon: CheckCircle2, title: "Работа по этапам", text: "Двигаемся по согласованному плану и отдельно фиксируем изменения объёма." },
];

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEOHead title="О компании — СКОЛ" description="Подход СКОЛ к демонтажным и строительным работам: понятные этапы, согласованные объёмы и контроль исполнения." canonical="/about" />
      <main className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <AnimatedSection>
          <header className="relative mb-7 grid overflow-hidden rounded-2xl border border-border/60 bg-card/35 shadow-[0_28px_90px_-56px_hsl(var(--primary)/0.35)] lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative z-10 flex flex-col justify-center p-6 sm:p-9 lg:p-12">
              <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-primary sm:text-xs">
                <span className="h-px w-8 bg-primary" /> СКОЛ / ПОДХОД К РАБОТЕ
              </p>
              <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[.98] tracking-[-.045em] text-foreground sm:text-5xl lg:text-6xl">
                {t("about.title")}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                {t("about.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/services" className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
                  Изучить направления <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link to="/contacts" className="inline-flex min-h-11 items-center gap-2 border border-border/70 px-5 py-3 text-sm font-medium text-foreground transition hover:border-primary/50">
                  Обсудить объект
                </Link>
              </div>
              <div className="mt-9 flex items-center gap-3 border-t border-border/60 pt-4 text-[10px] uppercase tracking-[.17em] text-muted-foreground">
                <span className="font-mono text-primary">01</span>
                <span>Принцип работы — ясность до начала работ</span>
              </div>
            </div>
            <div className="relative min-h-[270px] overflow-hidden border-t border-border/50 sm:min-h-[360px] lg:border-l lg:border-t-0">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=85)" }}
                role="img"
                aria-label="Архитектурный визуальный образ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-background/5 lg:bg-gradient-to-r lg:from-background/15 lg:via-transparent lg:to-background/10" />
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)/.15) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/.15) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
                <div className="max-w-xs">
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[.18em] text-primary">СКОЛ / 01</span>
                  <p className="text-lg font-medium leading-snug text-white sm:text-xl">Порядок в деталях. Предсказуемость в работе.</p>
                </div>
                <span className="hidden border border-white/25 bg-black/25 px-3 py-2 text-[9px] uppercase tracking-[.15em] text-white/80 backdrop-blur-sm sm:inline-block">Визуальный образ</span>
              </div>
            </div>
          </header>
        </AnimatedSection>

        <AnimatedSection delay={0.06}>
          <section className="relative mb-10 overflow-hidden border border-border/60 bg-card/45 p-6 sm:p-9 lg:p-11">
            <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border border-primary/15" />
            <div className="pointer-events-none absolute -right-1 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/35 to-transparent" />
            <div className="relative grid gap-7 lg:grid-cols-[.35fr_1fr] lg:gap-12">
              <div>
                <p className="font-mono text-xs uppercase tracking-[.18em] text-primary">02 / Принцип</p>
                <p className="mt-3 text-sm text-muted-foreground">Не усложнять процесс ради красивых обещаний</p>
              </div>
              <div>
                <p className="max-w-4xl text-xl font-medium leading-relaxed tracking-tight text-foreground sm:text-2xl lg:text-3xl">{t("about.story")}</p>
                <div className="mt-6 max-w-3xl border-l-2 border-primary pl-4">
                  <p className="text-sm leading-7 text-muted-foreground sm:text-base">{t("about.mission")}</p>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <section className="mb-11">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-primary">03 / В основе</p>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Принципы работы</h2>
            </div>
            <span className="hidden font-mono text-xs text-muted-foreground sm:block">03 / 03</span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {values.map((value, i) => (
              <AnimatedSection key={value.titleKey} delay={0.08 + i * 0.07}>
                <motion.article className="group relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden border border-border/60 bg-card/45 p-5 transition-colors hover:border-primary/40 sm:p-6" whileHover={{ y: -3 }} transition={{ duration: 0.22 }}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">0{i + 1} / PRINCIPLE</span>
                    <div className="flex h-10 w-10 items-center justify-center border border-border/80 bg-background/50 text-primary transition-colors group-hover:border-primary/40">
                      <value.icon className="h-5 w-5" strokeWidth={1.6} />
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">{t(value.titleKey)}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{t(value.descKey)}</p>
                  </div>
                  <div className="mt-5 flex justify-end border-t border-border/60 pt-3 text-muted-foreground">
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                </motion.article>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section className="mb-9">
          <div className="mb-5 border-b border-border/60 pb-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-primary">04 / Последовательность</p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">От задачи к результату</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.055}>
                <motion.article className="h-full border border-border/60 bg-background/35 p-5 sm:p-6" whileHover={{ y: -2 }}>
                  <div className="mb-8 flex items-center justify-between">
                    <span className="font-mono text-xs text-primary">0{i + 1}</span>
                    <item.icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
                </motion.article>
              </AnimatedSection>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutPage;
