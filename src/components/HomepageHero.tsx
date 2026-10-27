import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomepageHero = () => {
  const navigate = useNavigate();

  return (
    <section
      className="skol-home-hero relative isolate min-h-[min(780px,90svh)] overflow-hidden"
      aria-label="СКОЛ — строительные работы"
    >
      {/* Quiet engineering marks: background texture, not UI cards */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-y-0 right-0 w-full opacity-[0.16] sm:w-[72%]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground) / 0.12) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(110deg, transparent 5%, black 85%)",
          }}
        />
        <div className="absolute -right-36 top-[-15rem] h-[34rem] w-[34rem] rounded-full border border-primary/20 sm:-right-24 sm:top-[-18rem] sm:h-[48rem] sm:w-[48rem]" />
        <div className="absolute -right-20 top-[-9rem] h-[25rem] w-[25rem] rounded-full border border-foreground/[0.09] sm:-right-8 sm:top-[-12rem] sm:h-[36rem] sm:w-[36rem]" />
        <div className="absolute right-[13%] top-[24%] hidden h-px w-[24%] bg-primary/35 sm:block" />
        <div className="absolute right-[13%] top-[24%] hidden h-2 w-2 -translate-y-1/2 rounded-full border border-primary/60 sm:block" />
        <div className="absolute bottom-[18%] right-[8%] hidden font-mono text-[10px] tracking-[0.28em] text-foreground/30 sm:block">55°45′ N / 37°37′ E</div>
        <div className="absolute bottom-[13%] left-[5%] h-10 w-px bg-primary/50" />
        <div className="absolute bottom-[13%] left-[5%] h-px w-10 bg-primary/50" />
        <span className="absolute right-[7%] top-[18%] hidden font-mono text-[10px] tracking-[0.3em] text-primary/60 sm:block">SK / 01</span>
        <span className="absolute bottom-[9%] right-[8%] hidden font-mono text-[9px] tracking-[0.25em] text-foreground/25 sm:block">ПРОЕКТ • ПРОЦЕСС • РЕЗУЛЬТАТ</span>
        <div className="absolute bottom-[22%] right-[25%] h-1.5 w-1.5 rounded-full bg-primary/45" />
        <div className="absolute right-[25%] top-[38%] h-12 w-px bg-foreground/15" />
      </div>

      <div className="mx-auto flex min-h-[min(780px,90svh)] max-w-[88rem] items-center px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="relative z-10 w-full">
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <span className="h-px w-9 bg-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary sm:text-xs">Демонтаж · Подготовка · Строительство</span>
          </div>

          <h1 className="select-none font-display text-[clamp(5.2rem,20vw,18rem)] font-semibold leading-[0.72] tracking-[-0.105em] text-foreground">
            СКОЛ<span className="text-primary">.</span>
          </h1>

          <div className="mt-9 grid max-w-3xl gap-7 sm:mt-12 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-10">
            <p className="max-w-[35rem] text-base leading-7 text-foreground/75 sm:text-lg sm:leading-8">
              Берём объект в работу, организуем процессы и готовим пространство к следующему этапу — без лишней суеты и разрозненных подрядчиков.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                onClick={() => navigate("/contacts")}
                className="group inline-flex min-h-12 items-center gap-4 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-[filter,transform] duration-200 hover:brightness-110"
              >
                Обсудить объект
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <button
                onClick={() => navigate("/services")}
                className="group inline-flex min-h-12 items-center gap-2 py-3 text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
              >
                Наши услуги
                <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-3 sm:mt-16">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:text-[10px]">Москва и Московская область</span>
            <span className="h-px max-w-24 flex-1 bg-border/70" />
            <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground/70">01 — 26</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageHero;
