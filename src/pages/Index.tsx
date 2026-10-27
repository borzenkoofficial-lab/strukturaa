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

const Index = () => {
  return (
    <div className="min-h-screen bg-background gradient-dark">
      <SEOHead canonical="/" />
      <Header />

      <main>
        <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 sm:pt-8">
          <div className="relative isolate overflow-hidden rounded-2xl border border-border/60 bg-card/45 px-5 py-5 sm:px-7 sm:py-6 lg:px-9">
            <div className="pointer-events-none absolute -right-10 -top-20 -z-10 h-56 w-56 rounded-full border border-primary/10 sm:-right-4 sm:h-72 sm:w-72" />
            <div className="pointer-events-none absolute -right-1 top-0 -z-10 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
            <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8">
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
                  <div key={label} className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl border border-border/50 bg-background/45 px-2 py-3 text-center md:flex-row md:justify-start md:px-3 md:py-2.5 md:text-left">
                    <Icon className="h-4 w-4 shrink-0 text-primary sm:h-[18px] sm:w-[18px]" />
                    <span className="text-[10px] font-medium leading-tight text-foreground sm:text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3">
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
