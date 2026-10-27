import { motion } from "framer-motion";
import { ArrowUpRight, Building2, Hammer, Wrench, Youtube } from "lucide-react";
import Header from "@/components/Header";
import BentoGrid from "@/components/BentoGrid";
import FeaturesCarousel from "@/components/FeaturesCarousel";
import StoriesBar from "@/components/stories/StoriesBar";
import StatsSection from "@/components/StatsSection";
import ProcessSection from "@/components/ProcessSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const particles = [
  { left: "7%", top: "24%", delay: 0, duration: 9 },
  { left: "19%", top: "72%", delay: 1.4, duration: 11 },
  { left: "31%", top: "18%", delay: 2.2, duration: 10 },
  { left: "43%", top: "81%", delay: 0.8, duration: 12 },
  { left: "54%", top: "32%", delay: 3.1, duration: 9.5 },
  { left: "63%", top: "68%", delay: 1.9, duration: 11.5 },
  { left: "72%", top: "17%", delay: 2.7, duration: 10.5 },
  { left: "81%", top: "54%", delay: 0.4, duration: 12.5 },
  { left: "91%", top: "28%", delay: 3.6, duration: 9 },
  { left: "37%", top: "51%", delay: 4.1, duration: 13 },
  { left: "68%", top: "84%", delay: 1.1, duration: 10 },
  { left: "12%", top: "46%", delay: 2.9, duration: 11 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background gradient-dark">
      <SEOHead canonical="/" />
      <Header />
      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 sm:pt-4">
        <StoriesBar />
      </div>

      <main>
        <section className="skol-home-section mx-auto max-w-7xl px-4 pt-5 pb-8 sm:px-6 sm:pt-8 sm:pb-12">
          <div className="skol-home-intro relative isolate overflow-hidden rounded-2xl border border-border/60 bg-card/45 px-5 py-7 shadow-[0_18px_60px_-38px_hsl(var(--primary)/0.28)] sm:px-8 sm:py-9 lg:px-10 lg:py-11">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_42%,hsl(var(--primary)/0.09),transparent_42%),linear-gradient(115deg,hsl(var(--background)/0.08),transparent_55%)]" />
            <div className="pointer-events-none absolute -right-10 -top-20 -z-10 h-56 w-56 rounded-full border border-primary/10 sm:-right-4 sm:h-72 sm:w-72" />
            <div className="pointer-events-none absolute -right-1 top-0 -z-10 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

            <div className="skol-home-particles pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              {particles.map((particle, index) => (
                <motion.span
                  key={index}
                  className="absolute block h-2.5 w-3.5"
                  style={{ left: particle.left, top: particle.top }}
                  animate={{
                    x: [0, 13, -10, 7, 0],
                    y: [0, -17, 8, -11, 0],
                    rotate: [-18, 24, -9, 17, -18],
                    opacity: [0.12, 0.75, 0.3, 0.85, 0.12],
                    scale: [0.75, 1.1, 0.85, 1.2, 0.75],
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="absolute left-0 top-[2px] h-1.5 w-1.5 rounded-full bg-primary/70 shadow-[0_0_9px_2px_hsl(var(--primary)/0.42)]" />
                  <span className="absolute right-0 top-0 h-2 w-1.5 rotate-[-24deg] rounded-full bg-primary/35 shadow-[0_0_7px_1px_hsl(var(--primary)/0.24)]" />
                  <span className="absolute right-0 bottom-0 h-2 w-1.5 rotate-[24deg] rounded-full bg-primary/45 shadow-[0_0_7px_1px_hsl(var(--primary)/0.28)]" />
                </motion.span>
              ))}
            </div>

            <div className="relative z-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:gap-10">
              <div className="max-w-3xl">
                <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
                  <span className="h-px w-7 bg-primary" />
                  Строительная платформа
                  <span className="ml-1 rounded-full border border-primary/25 px-2 py-1 text-[9px] tracking-[0.12em] text-primary/90">STRUKTURA</span>
                </div>
                <h1 className="skol-home-title max-w-3xl font-display text-3xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  Строительные задачи —
                  <span className="block mt-1 text-primary">в одном месте</span>
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-7">
                  Пространство для тех, кто строит, ремонтирует и выбирает оборудование. Изучайте направления, находите нужные решения и переходите к подходящим разделам без лишнего поиска.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Для объекта и ремонта", "Инструмент и оборудование", "Проекты и техника"].map((item) => (
                    <span key={item} className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/55 px-3 py-2 text-[10px] font-medium text-foreground/90 sm:text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.45)]" />
                      {item}
                    </span>
                  ))}
                </div>

                <div className="skol-home-youtube-row mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <a
                    href="https://www.youtube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Открыть YouTube"
                    className="group inline-flex w-fit min-h-11 items-center gap-3 border border-primary/35 bg-background/55 px-3 py-2.5 transition-colors duration-300 hover:border-primary/70 hover:bg-primary/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary/12 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Youtube className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    </span>
                    <span className="flex flex-col text-left">
                      <span className="text-[9px] font-semibold uppercase tracking-[.17em] text-muted-foreground">Смотрите нас</span>
                      <span className="text-sm font-semibold text-foreground">YouTube</span>
                    </span>
                    <ArrowUpRight className="ml-2 h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </a>

                  <div className="flex min-w-0 items-center gap-3 sm:border-l sm:border-border/60 sm:pl-4">
                    <span className="hidden h-8 w-px bg-primary/35 sm:block" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[.18em] text-primary">Мы блогеры</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Наша история — за кадром и на объектах.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="skol-home-nav-panel relative min-w-0 rounded-xl border border-border/50 bg-background/45 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">Навигация по платформе</span>
                  <span className="font-mono text-[10px] text-primary/80">01 — 03</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { icon: Hammer, number: "01", label: "Услуги", description: "Направления работ и решения для объекта" },
                    { icon: Wrench, number: "02", label: "Инструмент", description: "Оснащение для строительных задач" },
                    { icon: Building2, number: "03", label: "Проекты и техника", description: "Примеры, техника и практические идеи" },
                  ].map(({ icon: Icon, number, label, description }) => (
                    <div key={label} className="group flex items-start gap-3 rounded-lg border border-border/45 bg-card/65 px-3 py-3 transition-colors duration-300 hover:border-primary/35 hover:bg-card/90 sm:px-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-primary/70">{number}</span>
                          <span className="text-sm font-semibold text-foreground">{label}</span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
                      </div>
                      <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-primary" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="skol-home-quick-points relative z-10 mt-7 grid gap-3 border-t border-border/50 pt-5 sm:grid-cols-3 sm:gap-4">
              {[
                { number: "01", title: "Определите задачу", description: "Начните с нужного направления." },
                { number: "02", title: "Изучите варианты", description: "Сравните подходы и доступную информацию." },
                { number: "03", title: "Переходите к делу", description: "Откройте подходящий раздел ниже." },
              ].map((item) => (
                <div key={item.number} className="flex gap-3 sm:flex-col sm:gap-2">
                  <span className="pt-0.5 font-mono text-xs text-primary/80">{item.number}</span>
                  <div>
                    <p className="text-xs font-semibold text-foreground sm:text-sm">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <BentoGrid />
      </main>

      <FeaturesCarousel />
      <StatsSection />
      <ProcessSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
