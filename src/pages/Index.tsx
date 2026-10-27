import { motion } from "framer-motion";
import { ArrowUpRight, Building2, Hammer, Wrench } from "lucide-react";
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

      <main>
        <section className="mx-auto max-w-7xl px-4 pt-5 pb-8 sm:px-6 sm:pt-8 sm:pb-12">
          <div className="relative isolate overflow-hidden rounded-2xl border border-border/60 bg-card/45 px-5 py-5 shadow-[0_18px_60px_-38px_hsl(var(--primary)/0.28)] sm:px-7 sm:py-6 lg:px-9">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_42%,hsl(var(--primary)/0.09),transparent_42%),linear-gradient(115deg,hsl(var(--background)/0.08),transparent_55%)]" />
            <div className="pointer-events-none absolute -right-10 -top-20 -z-10 h-56 w-56 rounded-full border border-primary/10 sm:-right-4 sm:h-72 sm:w-72" />
            <div className="pointer-events-none absolute -right-1 top-0 -z-10 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
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

            <div className="relative z-10 grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8">
              <div className="max-w-3xl">
                <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
                  <span className="h-px w-6 bg-primary" />
                  Строительная платформа
                </div>
                <h1 className="max-w-2xl font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  Строительные задачи — <span className="text-primary">в одном месте</span>
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Услуги, инструмент, оборудование и проекты — начните с нужного раздела и найдите решение для своего объекта.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 md:w-[245px] md:grid-cols-1 md:gap-2.5">
                {[
                  { icon: Hammer, label: "Услуги" },
                  { icon: Wrench, label: "Инструмент" },
                  { icon: Building2, label: "Проекты и техника" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl border border-border/50 bg-background/65 px-2 py-3 text-center backdrop-blur-sm md:flex-row md:justify-start md:px-3 md:py-2.5 md:text-left">
                    <Icon className="h-4 w-4 shrink-0 text-primary sm:h-[18px] sm:w-[18px]" />
                    <span className="text-[10px] font-medium leading-tight text-foreground sm:text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative z-10 mt-5 flex items-center justify-between border-t border-border/50 pt-3">
              <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[10px]">Выберите направление ниже</span>
              <ArrowUpRight className="h-4 w-4 text-primary/80" aria-hidden="true" />
            </div>
          </div>
        </section>

        <BentoGrid />
      </main>

      <StoriesBar />
      <FeaturesCarousel />
      <StatsSection />
      <ProcessSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
